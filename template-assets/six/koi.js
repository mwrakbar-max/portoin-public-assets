const TAU = Math.PI * 2
const CELL = 2 // css px per dot
const INK = 'rgb(29,34,32)'

const BAYER = (() => {
  const m = [
    [0, 32, 8, 40, 2, 34, 10, 42], [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38], [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41], [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37], [63, 31, 55, 23, 61, 29, 53, 21],
  ]
  return m.map((row) => row.map((v) => (v + .5) * 4))
})()

// luminance of each koi variety: body, fins and its markings along the body
// markings: [t along body 0..1, offset across (-1..1), length, width, tone]
// body / marking tones: low values = dense ink. Bodies are deliberately
// dark so every fish reads as a solid, tightly dotted shape.
const VARIETIES = {
  kohaku: { body: 58, marks: [[.16, -.1, .15, .75, 0], [.4, .18, .19, .85, 0], [.64, -.08, .12, .65, 8]] },
  tancho: { body: 64, marks: [[.1, 0, .075, .62, 0]] },
  showa: { body: 46, marks: [[.18, .2, .12, .75, 0], [.38, -.2, .16, .9, 30], [.6, .25, .13, .75, 0], [.77, -.1, .08, .55, 30]] },
  ogon: { body: 38, marks: [[.45, 0, .52, .42, 96]] },
  bekko: { body: 60, marks: [[.28, -.35, .06, .42, 0], [.46, .3, .07, .48, 0], [.62, -.2, .05, .38, 0]] },
  asagi: { body: 44, marks: [[.45, 0, .45, .5, 0], [.18, .72, .1, .32, 0], [.18, -.72, .1, .32, 0]] },
}

const SCHOOL = [
  { kind: 'kohaku', len: 118, depth: 1, cruise: 26 },
  { kind: 'showa', len: 108, depth: .94, cruise: 22 },
  { kind: 'ogon', len: 96, depth: .9, cruise: 30 },
  { kind: 'tancho', len: 104, depth: .97, cruise: 24 },
  { kind: 'bekko', len: 88, depth: .86, cruise: 28 },
  { kind: 'asagi', len: 84, depth: .8, cruise: 20 },
]

const STONES = [
  { x: .63, y: .38, w: .06, h: .04, rot: -.3 },
  { x: .27, y: .72, w: .045, h: .03, rot: .5 },
  { x: .16, y: .3, w: .032, h: .022, rot: .1 },
  { x: .82, y: .76, w: .036, h: .025, rot: -.8 },
]
const PADS = [
  { x: .13, y: .2, r: .085, rot: .6, spin: .018, notch: .5 },
  { x: .2, y: .33, r: .052, rot: 2.4, spin: -.024, notch: .45 },
  { x: .86, y: .74, r: .075, rot: 4.1, spin: .02, notch: .55, flower: true },
  { x: .76, y: .86, r: .045, rot: 1.2, spin: -.03, notch: .5 },
]

const SEGMENTS = 14

// tone curve before dithering: clean highlights, solid darks, so the
// drawing reads as ink rather than as grey noise
const CURVE = (() => {
  const lut = new Uint8Array(256)
  for (let i = 0; i < 256; i += 1) {
    const x = i / 255
    let y = x < .5 ? .5 * Math.pow(2 * x, 1.25) : 1 - .5 * Math.pow(2 * (1 - x), 1.25)
    y = Math.min(1, y * 1.06)
    if (x > .94) y = 1
    lut[i] = Math.round(y * 255)
  }
  return lut
})()

const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a))
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

/* a tileable cellular (F2 − F1) texture: bright wandering lines, like the
   light a rippled surface throws on the bottom of a pond */
function causticTile(size, cells, seed) {
  let s = seed
  const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647 }
  const pts = []
  for (let i = 0; i < cells * cells; i += 1) {
    pts.push([((i % cells) + rand()) / cells, (Math.floor(i / cells) + rand()) / cells])
  }
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(size, size)
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      // integer-frequency warp keeps the tile seamless but bends the lines
      const u = x / size + Math.sin((y / size) * TAU * 2 + seed) * .035
      const v = y / size + Math.sin((x / size) * TAU * 3 + seed * .5) * .03
      let f1 = 9
      let f2 = 9
      for (let k = 0; k < pts.length; k += 1) {
        let dx = Math.abs(((u % 1) + 1) % 1 - pts[k][0]); if (dx > .5) dx = 1 - dx
        let dy = Math.abs(((v % 1) + 1) % 1 - pts[k][1]); if (dy > .5) dy = 1 - dy
        const d = dx * dx + dy * dy
        if (d < f1) { f2 = f1; f1 = d } else if (d < f2) f2 = d
      }
      const edge = (Math.sqrt(f2) - Math.sqrt(f1)) * cells
      const light = Math.exp(-edge * 22)
      const i = (y * size + x) * 4
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 0
      img.data[i + 3] = Math.round(light * 255)
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}

function makeKoi(spec, index, width, height) {
  const scale = width / 620
  const angle = (index / SCHOOL.length) * TAU + .4
  const x = width * (.5 + Math.cos(angle) * .26)
  const y = height * (.5 + Math.sin(angle) * .22)
  const heading = angle + Math.PI / 2
  const len = spec.len * scale * 1.18
  const seg = len / SEGMENTS
  const spine = []
  for (let i = 0; i <= SEGMENTS; i += 1) spine.push([x - Math.cos(heading) * seg * i, y - Math.sin(heading) * seg * i])
  return {
    ...spec,
    len,
    seg,
    x, y,
    angle: heading,
    wander: heading,
    speed: spec.cruise * scale,
    phase: index * 1.7,
    seedA: index * 2.31 + .7,
    seedB: index * 1.13 + 2.1,
    fear: 0,
    fearX: 0,
    fearY: 0,
    spine,
  }
}

function widthAt(t, len) {
  // narrow nose, widest at a third, tapering into the tail
  return Math.sin(Math.pow(t, .62) * Math.PI) * len * .125 + len * .01
}

(() => {
  const canvasRef = {current:document.getElementById('koi-pond')}; if (!canvasRef.current) return;
  const input = {current:{x:-999,y:-999,active:false,taps:[]}}

  const cleanup = (() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const scene = document.createElement('canvas')
    const sctx = scene.getContext('2d', { willReadFrequently: true })
    let reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tileA = causticTile(96, 5, 7)
    const tileB = causticTile(96, 4, 131)
    const patA = sctx.createPattern(tileA, 'repeat')
    const patB = sctx.createPattern(tileB, 'repeat')

    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let dpr = 1
    let mask = null
    let offX = null
    let offY = null
    let koi = []
    let food = []
    let ripples = []
    let frame = 0
    let last = performance.now()
    let running = false
    let visible = true
    let clock = 0

    const resize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (!w || !h) return
      const sx = width ? w / width : 1
      const sy = height ? h / height : 1
      width = w
      height = h
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      cols = Math.ceil(w / CELL)
      rows = Math.ceil(h / CELL)
      scene.width = cols
      scene.height = rows
      offX = new Float32Array(cols * rows)
      offY = new Float32Array(cols * rows)

      // the pond outline: a soft, slightly irregular rounded rectangle that
      // lets the dither thin out into the page instead of stopping at an edge
      mask = new Float32Array(cols * rows)
      const r = Math.min(w, h) * .2
      const soft = Math.min(w, h) * .12
      for (let j = 0; j < rows; j += 1) {
        for (let i = 0; i < cols; i += 1) {
          const px = (i + .5) * CELL
          const py = (j + .5) * CELL
          const qx = Math.abs(px - w / 2) - (w / 2 - r - 6)
          const qy = Math.abs(py - h / 2) - (h / 2 - r - 6)
          const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
          const a = Math.atan2(py - h / 2, px - w / 2)
          const wobble = Math.sin(a * 3 + 1.3) * 5 + Math.sin(a * 7 - .4) * 2.5
          mask[j * cols + i] = 1 - smooth(-soft, 0, outside + wobble)
        }
      }

      if (!koi.length) koi = SCHOOL.map((spec, i) => makeKoi(spec, i, w, h))
      else if (sx !== 1 || sy !== 1) {
        koi.forEach((k) => {
          k.x *= sx; k.y *= sy
          k.spine.forEach((p) => { p[0] *= sx; p[1] *= sy })
        })
      }
    }

    /* -------------------------------------------------------- simulation */
    const step = (dt, t) => {
      const scale = width / 620
      const cx = width / 2
      const cy = height / 2
      const p = input.current

      // taps: a fish under the finger bolts, anywhere else gets food
      p.taps.splice(0).forEach(({ x, y }) => {
        ripples.push({ x, y, t })
        let hit = null
        koi.forEach((k) => {
          k.spine.forEach(([sx, sy]) => {
            if (Math.hypot(sx - x, sy - y) < 16 * scale + k.len * .06) hit = k
          })
        })
        koi.forEach((k) => {
          const d = Math.hypot(k.x - x, k.y - y)
          if (k === hit || d < 60 * scale) {
            k.fear = k === hit ? 1 : Math.max(k.fear, .55)
            k.fearX = x
            k.fearY = y
          }
        })
        if (!hit) {
          for (let n = 0; n < 3; n += 1) {
            const a = Math.random() * TAU
            const d = Math.random() * 9 * scale
            food.push({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, t, eaten: false })
          }
        }
      })
      food = food.filter((f) => !f.eaten && t - f.t < 14)
      ripples = ripples.filter((r) => t - r.t < 2.2)

      koi.forEach((k, index) => {
        // wander: a heading that drifts slowly, and relaxes toward where the
        // fish is actually going so the two never fight
        k.wander += (Math.sin(t * .23 + k.seedA) * .6 + Math.sin(t * .61 + k.seedB) * .4) * dt * .38
        k.wander += wrap(k.angle - k.wander) * dt * .35
        let dx = Math.cos(k.wander)
        let dy = Math.sin(k.wander)
        let turnRate = .75
        let target = k.cruise * scale * (.8 + .35 * (.5 + .5 * Math.sin(t * .23 + k.seedB)))

        // stay inside the pond: the pull grows smoothly near the edge
        const ex = (k.x - cx) / (width * .47)
        const ey = (k.y - cy) / (height * .44)
        const edge = Math.hypot(ex, ey)
        if (edge > .74) {
          const pull = (edge - .74) * 7
          dx -= ex / edge * pull
          dy -= ey / edge * pull
          turnRate += pull * .5
        }

        // keep a little space between fish
        koi.forEach((o, j) => {
          if (j === index) return
          const ox = k.x - o.x
          const oy = k.y - o.y
          const d = Math.hypot(ox, oy)
          const room = (k.len + o.len) * .5
          if (d > 0 && d < room) {
            const push = (1 - d / room) * 2.6
            dx += ox / d * push
            dy += oy / d * push
          }
        })

        // food: the nearest pellet within sight wins
        let meal = null
        let best = 230 * scale
        food.forEach((f) => {
          if (f.eaten) return
          const d = Math.hypot(f.x - k.x, f.y - k.y)
          if (d < best) { best = d; meal = f }
        })
        if (meal && k.fear < .2) {
          const d = best || 1
          dx += (meal.x - k.x) / d * 2.6
          dy += (meal.y - k.y) / d * 2.6
          target = Math.max(target, (44 + Math.min(40, best * .25)) * scale)
          turnRate = 2.6
          if (d < k.len * .09 + 4) meal.eaten = true
        }

        // a hovering cursor is a shadow over the water: drift away from it
        if (p.active) {
          const hx = k.x - p.x
          const hy = k.y - p.y
          const d = Math.hypot(hx, hy)
          if (d < 58 * scale && d > 0) {
            const push = (1 - d / (58 * scale)) * 1.8
            dx += hx / d * push
            dy += hy / d * push
            target = Math.max(target, 40 * scale)
          }
        }

        // fear: bolt away, then calm down
        if (k.fear > .01) {
          const fx = k.x - k.fearX
          const fy = k.y - k.fearY
          const d = Math.hypot(fx, fy) || 1
          dx += fx / d * 5 * k.fear
          dy += fy / d * 5 * k.fear
          target = Math.max(target, 150 * scale * k.fear)
          turnRate = 2 + 5 * k.fear
          k.fear = Math.max(0, k.fear - dt * .55)
        }

        const want = Math.atan2(dy, dx)
        const diff = wrap(want - k.angle)
        k.angle += clamp(diff, -turnRate * dt, turnRate * dt)
        k.speed += (target - k.speed) * Math.min(1, dt * (k.fear > .1 ? 5 : 1.4))
        k.x += Math.cos(k.angle) * k.speed * dt
        k.y += Math.sin(k.angle) * k.speed * dt

        // tail beat: faster and wider when the fish is working hard
        const effort = clamp(k.speed / (k.cruise * scale), .4, 5)
        k.phase += dt * (3.2 + effort * 2.4)
        k.amp = .055 + Math.min(.06, effort * .014)

        // the body follows the head, segment by segment; each joint can only
        // bend so far, so a tight turn becomes an arc instead of a curl
        const sp = k.spine
        sp[0][0] = k.x
        sp[0][1] = k.y
        let prev = k.angle
        for (let i = 1; i < sp.length; i += 1) {
          const a = Math.atan2(sp[i - 1][1] - sp[i][1], sp[i - 1][0] - sp[i][0])
          const bent = prev + clamp(wrap(a - prev), -.24, .24)
          sp[i][0] = sp[i - 1][0] - Math.cos(bent) * k.seg
          sp[i][1] = sp[i - 1][1] - Math.sin(bent) * k.seg
          prev = bent
        }
      })

      // dots: cursor repulsion and ripple rings, eased back to rest
      const R = 44
      for (let j = 0; j < rows; j += 1) {
        for (let i = 0; i < cols; i += 1) {
          const n = j * cols + i
          const bx = (i + .5) * CELL
          const by = (j + .5) * CELL
          let fx = 0
          let fy = 0
          if (p.active) {
            const vx = bx - p.x
            const vy = by - p.y
            const d2 = vx * vx + vy * vy
            if (d2 < R * R && d2 > .1) {
              const d = Math.sqrt(d2)
              const f = (1 - d / R) ** 3 * 12
              fx += vx / d * f
              fy += vy / d * f
            }
          }
          for (let k = 0; k < ripples.length; k += 1) {
            const rp = ripples[k]
            const age = t - rp.t
            const radius = age * 120
            const life = 1 - age / 2.2
            const sx = bx - rp.x
            const sy = by - rp.y
            const d = Math.hypot(sx, sy)
            const band = Math.abs(d - radius)
            if (band < 20 && d > .1) {
              const f = (1 - band / 20) * life * 6
              fx += sx / d * f
              fy += sy / d * f
            }
          }
          offX[n] += (fx - offX[n]) * .14
          offY[n] += (fy - offY[n]) * .14
        }
      }
    }

    /* ------------------------------------------------------------ scene */
    // the scene is drawn as an ink illustration: light water, crisp dark
    // outlines, dense markings. Ordered dither keeps every edge readable.
    const tone = (l, a = 1) => `rgba(${l},${l},${l},${a})`

    const koiShape = (k) => {
      const s = k.spine
      const n = s.length
      // undulate the chain sideways: a travelling wave, strongest at the tail
      const pts = s.map(([x, y], i) => {
        const a = s[Math.max(0, i - 1)]
        const b = s[Math.min(n - 1, i + 1)]
        const ang = Math.atan2(a[1] - b[1], a[0] - b[0])
        const t = i / (n - 1)
        const sway = Math.sin(k.phase - t * 4.2) * Math.pow(t, 1.7) * k.len * k.amp
        return { x: x - Math.sin(ang) * sway, y: y + Math.cos(ang) * sway, ang, t }
      })
      const left = []
      const right = []
      pts.forEach(({ x, y, ang, t }) => {
        const w = widthAt(t, k.len)
        left.push([x - Math.sin(ang) * w, y + Math.cos(ang) * w])
        right.push([x + Math.sin(ang) * w, y - Math.cos(ang) * w])
      })
      // a rounded head: an ellipse cap around the first joint
      const body = new Path2D()
      const c = pts[1]
      const w1 = widthAt(c.t, k.len)
      body.moveTo(left[1][0], left[1][1])
      for (let i = 2; i < n; i += 1) body.lineTo(left[i][0], left[i][1])
      for (let i = n - 1; i >= 1; i -= 1) body.lineTo(right[i][0], right[i][1])
      body.ellipse(c.x, c.y, Math.max(w1 * 1.5, k.len * .07), w1, c.ang, -Math.PI / 2, Math.PI / 2, false)
      body.closePath()
      return { pts, body }
    }

    const koiShadow = (k) => {
      const { body } = koiShape(k)
      sctx.save()
      sctx.translate(k.len * .06, k.len * .13)
      sctx.fillStyle = tone(150, .85 * k.depth)
      sctx.fill(body)
      sctx.restore()
    }

    const fin = (draw, fill) => {
      sctx.fillStyle = tone(fill)
      sctx.strokeStyle = tone(40)
      sctx.lineWidth = 1.6
      sctx.beginPath()
      draw()
      sctx.fill()
      sctx.stroke()
    }

    const drawKoi = (k) => {
      const v = VARIETIES[k.kind]
      const { pts, body } = koiShape(k)
      const n = pts.length

      // caudal fin: two lobes that lag behind the last segment, with rays
      const tail = pts[n - 1]
      const tailAng = tail.ang + Math.sin(k.phase - 4.6) * .38
      const L = k.len
      sctx.save()
      sctx.translate(tail.x, tail.y)
      sctx.rotate(tailAng + Math.PI)
      fin(() => {
        sctx.moveTo(-L * .03, 0)
        sctx.quadraticCurveTo(L * .1, -L * .16, L * .25, -L * .11)
        sctx.quadraticCurveTo(L * .15, -L * .01, L * .25, L * .11)
        sctx.quadraticCurveTo(L * .1, L * .16, -L * .03, 0)
      }, 96)
      sctx.strokeStyle = tone(40)
      sctx.lineWidth = 1.2
      ;[-.08, -.04, .04, .08].forEach((ry) => {
        sctx.beginPath(); sctx.moveTo(0, 0); sctx.lineTo(L * .2, ry * L); sctx.stroke()
      })
      sctx.restore()

      // pectoral fins, rowing
      const chest = pts[3]
      const flap = Math.sin(k.phase * .8) * .32
      ;[-1, 1].forEach((side) => {
        const w = widthAt(chest.t, L) * 1.05
        sctx.save()
        sctx.translate(chest.x - Math.sin(chest.ang) * w * side, chest.y + Math.cos(chest.ang) * w * side)
        sctx.rotate(chest.ang + Math.PI + side * (.8 + flap))
        fin(() => sctx.ellipse(L * .07, 0, L * .09, L * .04, 0, 0, TAU), 96)
        sctx.restore()
      })
      // pelvic fins, smaller, further back
      const hip = pts[7]
      ;[-1, 1].forEach((side) => {
        const w = widthAt(hip.t, L) * .75
        sctx.save()
        sctx.translate(hip.x - Math.sin(hip.ang) * w * side, hip.y + Math.cos(hip.ang) * w * side)
        sctx.rotate(hip.ang + Math.PI + side * (.9 - flap * .5))
        fin(() => sctx.ellipse(L * .04, 0, L * .05, L * .024, 0, 0, TAU), 96)
        sctx.restore()
      })

      // body and its markings
      sctx.save()
      sctx.fillStyle = tone(v.body)
      sctx.fill(body)
      sctx.clip(body)
      v.marks.forEach(([t, off, l, w, lum]) => {
        const idx = clamp(Math.round(t * (n - 1)), 0, n - 1)
        const p = pts[idx]
        const half = widthAt(p.t, L)
        sctx.fillStyle = tone(lum)
        sctx.beginPath()
        sctx.ellipse(
          p.x - Math.sin(p.ang) * half * off,
          p.y + Math.cos(p.ang) * half * off,
          l * L, Math.max(1, half * w), p.ang, 0, TAU,
        )
        sctx.fill()
      })
      // shade the flank away from the light so the body reads round
      const mid = pts[Math.round(n * .4)]
      const g = sctx.createLinearGradient(
        mid.x - Math.sin(mid.ang) * L * .14, mid.y + Math.cos(mid.ang) * L * .14,
        mid.x + Math.sin(mid.ang) * L * .14, mid.y - Math.cos(mid.ang) * L * .14,
      )
      g.addColorStop(0, tone(0, .45))
      g.addColorStop(.5, tone(0, 0))
      g.addColorStop(1, tone(255, .12))
      sctx.fillStyle = g
      sctx.fill(body)
      // scales: rows of small arcs opening toward the tail
      sctx.strokeStyle = tone(245, .55)
      sctx.lineWidth = 1.1
      for (let i = 2; i < n - 3; i += 1) {
        const p = pts[i]
        const half = widthAt(p.t, L)
        const r = Math.max(1.6, half * .32)
        for (let row = -2; row <= 2; row += 1) {
          const off = row * .36 + (i % 2 ? .18 : 0)
          if (Math.abs(off) > .82) continue
          const cx = p.x - Math.sin(p.ang) * half * off
          const cy = p.y + Math.cos(p.ang) * half * off
          sctx.beginPath()
          sctx.arc(cx, cy, r, p.ang + Math.PI - 1.1, p.ang + Math.PI + 1.1)
          sctx.stroke()
        }
      }
      // a soft light running down the back gives the solid body its volume
      sctx.strokeStyle = tone(236, .38)
      sctx.lineWidth = Math.max(1.5, L * .03)
      sctx.lineCap = 'round'
      sctx.beginPath()
      pts.slice(1, n - 4).forEach(({ x, y }, i) => (i ? sctx.lineTo(x, y) : sctx.moveTo(x, y)))
      sctx.stroke()
      // deeper fish sit further under the surface
      sctx.fillStyle = tone(200, (1 - k.depth) * .7)
      sctx.fill(body)
      sctx.restore()

      sctx.strokeStyle = tone(0)
      sctx.lineWidth = 2.6
      sctx.stroke(body)

      // eyes
      sctx.fillStyle = tone(10)
      const eye = pts[1]
      const ew = widthAt(eye.t, L) * .6
      ;[-1, 1].forEach((side) => {
        sctx.beginPath()
        sctx.arc(eye.x - Math.sin(eye.ang) * ew * side, eye.y + Math.cos(eye.ang) * ew * side, Math.max(1.5, L * .02), 0, TAU)
        sctx.fill()
      })
    }

    const drawPad = (pad, t) => {
      const x = pad.x * width + Math.sin(t * .11 + pad.rot) * 3
      const y = pad.y * height + Math.cos(t * .09 + pad.rot) * 2
      const r = pad.r * width
      const rot = pad.rot + t * pad.spin
      sctx.save()
      sctx.translate(x, y)
      sctx.rotate(rot)
      // shadow
      sctx.fillStyle = tone(190, .9)
      sctx.beginPath()
      sctx.arc(r * .1, r * .16, r, pad.notch * .5, TAU - pad.notch * .5)
      sctx.lineTo(r * .1, r * .16)
      sctx.fill()
      // leaf with its notch
      const leaf = new Path2D()
      leaf.moveTo(0, 0)
      leaf.arc(0, 0, r, pad.notch * .5, TAU - pad.notch * .5)
      leaf.closePath()
      sctx.fillStyle = tone(206)
      sctx.fill(leaf)
      // veins
      sctx.strokeStyle = tone(120)
      sctx.lineWidth = 1.2
      for (let i = 0; i < 9; i += 1) {
        const a = pad.notch * .5 + (i + .5) / 9 * (TAU - pad.notch)
        sctx.beginPath()
        sctx.moveTo(0, 0)
        sctx.quadraticCurveTo(Math.cos(a + .08) * r * .5, Math.sin(a + .08) * r * .5, Math.cos(a) * r * .9, Math.sin(a) * r * .9)
        sctx.stroke()
      }
      // highlight
      sctx.fillStyle = tone(240, .8)
      sctx.beginPath()
      sctx.ellipse(-r * .34, -r * .3, r * .3, r * .16, -.7, 0, TAU)
      sctx.fill()
      sctx.strokeStyle = tone(20)
      sctx.lineWidth = 2
      sctx.stroke(leaf)
      if (pad.flower) {
        sctx.rotate(-rot)
        for (let layer = 0; layer < 2; layer += 1) {
          for (let i = 0; i < 7; i += 1) {
            const a = i / 7 * TAU + layer * .45 + t * .02
            const len = r * (layer ? .36 : .5)
            sctx.save()
            sctx.rotate(a)
            sctx.fillStyle = tone(layer ? 255 : 244)
            sctx.strokeStyle = tone(60)
            sctx.lineWidth = 1.8
            sctx.beginPath()
            sctx.moveTo(0, 0)
            sctx.quadraticCurveTo(len * .5, -len * .38, len, 0)
            sctx.quadraticCurveTo(len * .5, len * .38, 0, 0)
            sctx.fill()
            sctx.stroke()
            sctx.restore()
          }
        }
        sctx.fillStyle = tone(80)
        sctx.beginPath()
        sctx.arc(0, 0, r * .09, 0, TAU)
        sctx.fill()
      }
      sctx.restore()
    }

    const paint = (t) => {
      sctx.setTransform(1 / CELL, 0, 0, 1 / CELL, 0, 0)
      sctx.globalCompositeOperation = 'source-over'
      sctx.globalAlpha = 1

      // water: pale, a touch deeper toward the edges
      const depth = sctx.createRadialGradient(width * .5, height * .46, 0, width * .5, height * .5, width * .58)
      depth.addColorStop(0, tone(255))
      depth.addColorStop(.5, tone(252))
      depth.addColorStop(1, tone(196))
      sctx.fillStyle = depth
      sctx.fillRect(0, 0, width, height)

      // stones on the floor, seen through the water
      STONES.forEach((st) => {
        sctx.save()
        sctx.translate(st.x * width, st.y * height)
        sctx.rotate(st.rot)
        const w = st.w * width
        const h = st.h * width
        sctx.fillStyle = tone(150)
        sctx.beginPath()
        sctx.ellipse(1.5, 2.5, w, h, 0, 0, TAU)
        sctx.fill()
        sctx.fillStyle = tone(208)
        sctx.beginPath()
        sctx.ellipse(-w * .08, -h * .12, w * .92, h * .86, 0, 0, TAU)
        sctx.fill()
        sctx.restore()
      })

      // the light net on the pond floor, drawn as fine ink lines that
      // drift against each other
      const tile = 96 * 2.4
      patA.setTransform(new DOMMatrix().translate(t * 7, t * 3.5).scale(tile / 96))
      sctx.fillStyle = patA
      sctx.globalAlpha = .3
      sctx.fillRect(0, 0, width, height)
      patB.setTransform(new DOMMatrix().translate(-t * 5, t * 6).scale(tile * 1.35 / 96))
      sctx.fillStyle = patB
      sctx.globalAlpha = .18
      sctx.fillRect(0, 0, width, height)
      sctx.globalCompositeOperation = 'source-over'
      sctx.globalAlpha = 1

      // food pellets float on the surface and slowly soak through
      food.forEach((f) => {
        const age = t - f.t
        sctx.fillStyle = `rgba(20,20,20,${clamp(1.4 - age / 10, 0, 1)})`
        sctx.beginPath()
        sctx.arc(f.x, f.y, 3.2, 0, TAU)
        sctx.fill()
      })

      const school = [...koi].sort((a, b) => a.depth - b.depth)
      school.forEach(koiShadow)
      school.forEach(drawKoi)

      PADS.forEach((pad) => drawPad(pad, t))

      // ripple rings: dark on pale water
      ripples.forEach((rp) => {
        const age = t - rp.t
        const life = 1 - age / 2.2
        for (let ring = 0; ring < 3; ring += 1) {
          const radius = age * 70 - ring * 13
          if (radius <= 0) continue
          sctx.strokeStyle = tone(30, .9 * life * (1 - ring * .25))
          sctx.lineWidth = 2
          sctx.beginPath()
          sctx.ellipse(rp.x, rp.y, radius, radius * .84, 0, 0, TAU)
          sctx.stroke()
        }
      })
    }

    const render = () => {
      const lum = sctx.getImageData(0, 0, cols, rows).data
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = INK
      const size = CELL * .96
      const inset = (CELL - size) / 2
      for (let j = 0; j < rows; j += 1) {
        const bayer = BAYER[j & 7]
        for (let i = 0; i < cols; i += 1) {
          const n = j * cols + i
          const m = mask[n]
          if (m <= .002) continue
          const l = CURVE[lum[n * 4]] * m + 255 * (1 - m)
          if (l >= bayer[i & 7]) continue
          ctx.fillRect(i * CELL + inset + offX[n], j * CELL + inset + offY[n], size, size)
        }
      }
    }

    const loop = (now) => {
      const dt = Math.min(.05, (now - last) / 1000)
      last = now
      clock += dt
      step(dt, clock)
      paint(clock)
      render()
      frame = requestAnimationFrame(loop)
    }

    const start = () => {
      if (running || reduced || !visible || document.hidden || document.body.classList.contains('portoin-motion-paused')) return
      running = true
      last = performance.now()
      frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    resize()
    // settle the school into a natural spread before the first paint
    for (let i = 0; i < 90; i += 1) { clock += 1 / 30; step(1 / 30, clock) }
    paint(clock)
    render()

    const ro = new ResizeObserver(() => { resize(); if (!running) { paint(clock); render() } })
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start(); else stop()
    })
    io.observe(canvas)
    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)
    const onMotion = () => {
      reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced || document.body.classList.contains('portoin-motion-paused')) stop(); else start()
    }
    document.addEventListener('portoin-motion-change', onMotion)
    start()

    input.current.redraw = () => { if (!running) { step(1 / 60, clock); paint(clock); render() } }

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      document.removeEventListener('portoin-motion-change', onMotion)
    }
  })()

  const locate = (event) => {
    const canvas = canvasRef.current
    const box = canvas.getBoundingClientRect()
    return {
      x: (event.clientX - box.left) * (canvas.clientWidth / box.width),
      y: (event.clientY - box.top) * (canvas.clientHeight / box.height),
    }
  }
  const move = (event) => {
    const { x, y } = locate(event)
    input.current.x = x
    input.current.y = y
    input.current.active = event.pointerType === 'mouse' || event.pressure > 0
  }
  const tap = (event) => {
    const point = locate(event)
    input.current.taps.push(point)
    input.current.redraw?.()
  }


  canvasRef.current.addEventListener('pointermove',move);
  canvasRef.current.addEventListener('pointerdown',tap);
  canvasRef.current.addEventListener('pointerleave',()=>{input.current.active=false});
  canvasRef.current.addEventListener('pointercancel',()=>{input.current.active=false});
  window.addEventListener('pagehide',()=>cleanup?.(),{once:true});
})();
