/* Interactions adapted for editable Portoin content from the supplied references. */
(()=>{'use strict';
function init(){
 const hero=document.getElementById('hero');if(!hero)return;
 const id=document.documentElement.dataset.portoinTemplate,reduce=matchMedia('(prefers-reduced-motion:reduce)'),fine=matchMedia('(pointer:fine)'),gsap=window.gsap;
 let paused=reduce.matches||document.body.classList.contains('paused'),visible=true;const cleanup=[];
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{rootMargin:'100px'}).observe(hero);
 const active=()=>!paused&&visible&&!document.hidden;
 const film=hero.querySelector('video.stone-mask');if(film){const syncFilm=()=>{paused=reduce.matches||document.body.classList.contains('paused');if(active())film.play().catch(()=>{});else film.pause();};syncFilm();document.addEventListener('portoin-motion-change',syncFilm);document.addEventListener('visibilitychange',syncFilm);reduce.addEventListener('change',syncFilm);new IntersectionObserver(()=>syncFilm()).observe(film);}
 document.addEventListener('portoin-motion-change',()=>{paused=reduce.matches||document.body.classList.contains('paused');});
 reduce.addEventListener('change',()=>{paused=reduce.matches||document.body.classList.contains('portoin-motion-paused');});
 const pointer={x:.5,y:.5};hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width;pointer.y=(e.clientY-r.top)/r.height;});
 const terminal=hero.querySelector('.terminal-input');
 if(terminal)terminal.addEventListener('keydown',e=>{if(e.key!=='Enter')return;e.preventDefault();const command=terminal.value.trim().toLowerCase();terminal.value='';const output=hero.querySelector('.terminal-output');
  const commands={help:'Commands: about / projects / skills / contact / clear',about:hero.querySelector('.hero-summary')?.textContent||'Tambahkan ringkasan profil Anda.',projects:[...document.querySelectorAll('#projects .project-info h3')].map(n=>n.textContent).join(' / ')||'Belum ada proyek.',skills:document.querySelector('#skills')?.textContent.trim().replace(/\s+/g,' ').slice(0,350)||'Belum ada keahlian.',contact:document.querySelector('#contact a[href^="mailto:"]')?.textContent||'Hubungi saya melalui bagian kontak.'};
  if(command==='clear'){output.replaceChildren();return;}const line=document.createElement('p');line.textContent='$ '+command+' — '+(commands[command]||'Perintah belum dikenal. Ketik help.');output.append(line);while(output.children.length>7)output.firstElementChild.remove();output.scrollTop=output.scrollHeight;
  if(['projects','skills','contact'].includes(command))document.getElementById(command)?.scrollIntoView({behavior:reduce.matches?'auto':'smooth'});
 });
 const lens=hero.querySelector('.news-lens'),lensButton=hero.querySelector('.lens-toggle');
 if(lens&&lensButton){let on=false;lensButton.addEventListener('click',()=>{on=!on;lensButton.setAttribute('aria-pressed',String(on));lens.style.display=on?'block':'none';lens.style.transform=`translate(${Math.max(0,hero.clientWidth/2-90)}px,${Math.max(0,hero.clientHeight/2-90)}px)`;});hero.addEventListener('pointermove',e=>{if(!on||!fine.matches)return;const r=hero.getBoundingClientRect();lens.style.transform=`translate(${Math.min(hero.clientWidth-185,Math.max(0,e.clientX-r.left-90))}px,${Math.max(0,e.clientY-r.top-90)}px)`;});}
 for(const canvas of hero.querySelectorAll('canvas.twelve-scene')){
  const ctx=canvas.getContext('2d');if(!ctx)continue;let w=0,h=0,last=0,t=0;const kind=canvas.dataset.scene;
  const resize=()=>{const r=hero.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,1.5);w=r.width;h=r.height;canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);draw();};
  function draw(){ctx.clearRect(0,0,w,h);ctx.lineWidth=1;
   if(kind==='globe'){const x=w*.75,y=h*.43,r=Math.min(w*.32,h*.43);ctx.strokeStyle='#a3fa2360';for(let j=0;j<13;j++){const a=j*Math.PI/13+t*.18;ctx.beginPath();ctx.ellipse(x,y,r*Math.abs(Math.cos(a)),r,0,0,Math.PI*2);ctx.stroke();}for(let j=-4;j<=4;j++){const lat=j/5;ctx.beginPath();ctx.ellipse(x,y+r*lat,r*Math.sqrt(1-lat*lat),Math.max(2,r*.17*Math.sqrt(1-lat*lat)),0,0,Math.PI*2);ctx.stroke();}}
   else if(kind==='ribbons'){ctx.strokeStyle='#ff442145';ctx.lineWidth=3;for(let i=0;i<23;i++){ctx.beginPath();for(let j=0;j<=80;j++){const u=j/80,x=u*w,y=h*.55+Math.sin(u*6+t*.45+i*.15)*h*.19+i*6+Math.sin(u*15-t*.25)*20;j?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}}
   else{const silk=kind==='silk';ctx.strokeStyle=silk?'#f2513048':'#e5ff362b';ctx.lineWidth=silk?1.1:.8;for(let i=0;i<55;i++){ctx.beginPath();for(let j=0;j<=45;j++){const u=j/45,x=u*w,y=i*h/55+Math.sin(u*7+t*.25+i*.13)*h*.18+Math.cos(u*12-t*.18)*h*.06+(pointer.y-.5)*20*Math.sin(u*Math.PI);j?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}}
  }
  const observer=new ResizeObserver(resize);observer.observe(hero);
  let frame;function tick(now){if(active()&&now-last>33){t+=.033;draw();last=now;}frame=requestAnimationFrame(tick);}frame=requestAnimationFrame(tick);cleanup.push(()=>{cancelAnimationFrame(frame);observer.disconnect();});
 }
 const tilt=hero.querySelector('.stone-mask,.leo-flower,.artem-sticker');
 if(tilt&&fine.matches&&!reduce.matches){hero.addEventListener('pointermove',()=>{if(!active())return;tilt.style.transform=`perspective(900px) rotateX(${(pointer.y-.5)*-13}deg) rotateY(${(pointer.x-.5)*18}deg)`;});hero.addEventListener('pointerleave',()=>tilt.style.transform='');}
 const sticker=hero.querySelector('.artem-sticker img');if(sticker){const original=sticker.getAttribute('src');const sync=()=>{sticker.src=paused?original.replace('.gif','-still.webp'):original;};sync();document.addEventListener('portoin-motion-change',sync);reduce.addEventListener('change',sync);}
 const rail=hero.querySelector('.disc-rail');if(rail){rail.addEventListener('wheel',e=>{if(rail.scrollWidth>rail.clientWidth&&Math.abs(e.deltaX)>Math.abs(e.deltaY)){rail.scrollLeft+=e.deltaX;e.preventDefault();}},{passive:false});}
 // Motion of images stays separate from shared text reveals and cursor effects.
 if(gsap&&!reduce.matches&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);
  const scenes={ 'bleibtgleich-digital':['.stone-stage',{y:100,scale:.85}], 'leo-world':['.leo-flower',{rotation:45,y:180}], 'huy-editorial':['.huy-hero-image',{scale:1.18,y:70}], 'guillaume-journey':['.zhu-orbit',{rotation:65,y:120}], 'a24-film-library':['.project-disc',{rotationY:15,y:70}], 'artem-motion':['.artem-ribbon',{x:-140,rotation:2}], 'silvia-flow':['.silvia-orb',{scale:1.4,y:120}] };
  const scene=scenes[id];if(scene&&hero.querySelector(scene[0]))gsap.to(hero.querySelectorAll(scene[0]),{...scene[1],ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1}});
 }
 if(id==='ohhmy-studio'&&!reduce.matches&&fine.matches){const load=document.createElement('script');load.src='/template-assets/twelve/matter.min.js';load.onload=()=>{
  const M=window.Matter;if(!M)return;const layer=hero.querySelector('.ohh-tools'),chips=[...layer.querySelectorAll('.drag-chip')];const engine=M.Engine.create({gravity:{x:0,y:.15}}),bodies=chips.map((chip,i)=>{const r=chip.getBoundingClientRect(),hr=hero.getBoundingClientRect(),body=M.Bodies.rectangle(r.left-hr.left+r.width/2,r.top-hr.top+r.height/2,r.width,r.height,{restitution:.6,friction:.02,angle:(i-1)*.1});M.Composite.add(engine.world,body);chip.style.left='0';chip.style.top='0';chip.style.right='auto';chip.style.bottom='auto';chip.style.rotate='none';return body;});
  let walls=[];const bounds=()=>{walls.forEach(x=>M.Composite.remove(engine.world,x));const w=hero.clientWidth,h=hero.clientHeight;walls=[M.Bodies.rectangle(w/2,h+30,w+100,60,{isStatic:true}),M.Bodies.rectangle(-30,h/2,60,h+100,{isStatic:true}),M.Bodies.rectangle(w+30,h/2,60,h+100,{isStatic:true})];M.Composite.add(engine.world,walls);};bounds();const observer=new ResizeObserver(bounds);observer.observe(hero);
  let drag=null;chips.forEach((chip,i)=>{chip.addEventListener('pointerdown',e=>{if(paused)return;drag=bodies[i];M.Body.setStatic(drag,true);chip.setPointerCapture(e.pointerId);chip.style.cursor='grabbing';});chip.addEventListener('pointermove',e=>{if(drag!==bodies[i])return;const r=hero.getBoundingClientRect();M.Body.setPosition(drag,{x:Math.max(30,Math.min(hero.clientWidth-30,e.clientX-r.left)),y:Math.max(30,Math.min(hero.clientHeight-30,e.clientY-r.top))});});const end=()=>{if(drag===bodies[i]){M.Body.setStatic(drag,false);drag=null;}chip.style.cursor='grab';};chip.addEventListener('pointerup',end);chip.addEventListener('pointercancel',end);});
  let last=0,frame;function tick(now){if(active()&&now-last>33){M.Engine.update(engine,33);bodies.forEach((body,i)=>{chips[i].style.transform=`translate(${body.position.x-chips[i].offsetWidth/2}px,${body.position.y-chips[i].offsetHeight/2}px) rotate(${body.angle}rad)`;});last=now;}frame=requestAnimationFrame(tick);}frame=requestAnimationFrame(tick);cleanup.push(()=>{cancelAnimationFrame(frame);observer.disconnect();M.Engine.clear(engine);});
 };document.body.append(load);}
 window.addEventListener('pagehide',()=>cleanup.forEach(fn=>fn()),{once:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
