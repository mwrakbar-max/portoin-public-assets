/* Animation patterns adapted from the supplied captures; no foreign application,
   analytics or hard-coded reference identities are embedded in the portfolio. */
(()=>{
 'use strict';
 const profiles={"ohhmy-studio":{"cursor": "dot", "projectParallax": true},"jcedrik-terminal":{"cursor": "cross", "projectParallax": true},"robert-newspaper":{"cursor": "glass", "projectParallax": true},"silvia-flow":{"cursor": "dot", "projectParallax": true},"guillaume-journey":{"cursor": "dot", "projectParallax": true},"bleibtgleich-digital":{"cursor": "dot", "projectParallax": true},"a24-film-library":{"cursor": "dot", "projectParallax": true},"curtis-artspace":{"cursor": "cross", "projectParallax": true},"loehx-future":{"cursor": "cross", "projectParallax": true},"leo-world":{"cursor": "glass", "projectParallax": true},"huy-editorial":{"cursor": "dot", "projectParallax": true},"artem-motion":{"cursor": "dot", "projectParallax": true},
  'haoqi-lab':{cursor:'cross',words:true,projectParallax:true},
  'alejandro-creative':{cursor:'dot',words:true,magnetic:22},
  'gallery-play':{cursor:'dot',words:true,blur:true,trail:true},
  'pamidor-studio':{cursor:'dot',words:true,projectParallax:true,marquee:true},
  'bermawy-notebook':{cursor:'paper',paper:true,words:true},
  'zainab-sky':{cursor:'glass',paper:true,projectParallax:true},
  'goats-bold':{cursor:'pink',words:true,projectParallax:true,magnetic:22,marquee:true},
  'kail-bubbles':{cursor:'glass',blur:true,projectParallax:true},
  'okay-dev':{cursor:'cross',words:true,projectParallax:true},
  'px-push':{cursor:'pixel',words:true,marquee:true},
  'arqos-studio':{cursor:'dot',words:true,projectParallax:true},
  'lurais-editorial':{cursor:'dot',words:true,projectParallax:true},
  'velocity-racing':{cursor:'cross',words:true,projectParallax:true,marquee:true},
  'bintang-koi':{cursor:'dot',paper:true},
  'michael-orange':{cursor:'dot',words:true,projectParallax:true},
  'sift-neon':{cursor:'neon',words:true},
  'unboxed-scrapbook':{cursor:'paper',paper:true,words:true},
  'majd':{cursor:'dot',words:true,projectParallax:true},
  'zara-miller':{cursor:'pink',words:true,projectParallax:true},
  'derek-muller':{cursor:'dot'},
  'creatiie':{cursor:'glass',words:true,projectParallax:true},
  'developer':{cursor:'dot'},'minimal':{cursor:'dot'},'professional':{cursor:'dot'}
 };
 const paths={arrow:'<path d="M7 17 17 7M7 7h10v10"/>',down:'<path d="M12 4v16m-6-6 6 6 6-6"/>',up:'<path d="M12 20V4m-6 6 6-6 6 6"/>',right:'<path d="M4 12h16m-6-6 6 6-6 6"/>',left:'<path d="M20 12H4m6-6-6 6 6 6"/>',menu:'<path d="M5 7h14M5 12h14M5 17h14"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',play:'<path d="m8 5 11 7-11 7Z"/>',pause:'<path d="M8 5v14M16 5v14"/>',pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',phone:'<path d="m7 3 3 5-3 3c1 3 3 5 6 6l3-3 5 3c0 3-2 5-5 4C8 19 4 15 3 8c-1-3 1-5 4-5Z"/>',plus:'<path d="M12 5v14M5 12h14"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',sparkle:'<path d="m12 3 2.7 6.3L21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7Z"/>',circle:'<circle cx="12" cy="12" r="7"/>',wave:'<path d="M7 11V6a1.5 1.5 0 0 1 3 0v5-7a1.5 1.5 0 0 1 3 0v7-6a1.5 1.5 0 0 1 3 0v7-4a1.5 1.5 0 0 1 3 0v7c0 5-3 7-7 7-3 0-5-3-7-6l-2-3c-1-2 1-3 3-1l1 1"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',briefcase:'<rect x="3" y="7" width="18" height="14" rx="3"/><path d="M8 7V4h8v3M3 12c5 3 13 3 18 0M12 12v4"/>',flower:'<path d="M12 9C6 0 1 8 9 12c-9 6-1 11 3 3 6 9 11 1 3-3 9-6 1-11-3-3Z"/>',smile:'<circle cx="12" cy="12" r="9"/><path d="M8 9h.01M16 9h.01M7 14q5 6 10 0"/>',command:'<path d="M8 8h8v8H8zM8 8H5a3 3 0 1 1 3-3v3Zm8 0V5a3 3 0 1 1 3 3h-3Zm0 8h3a3 3 0 1 1-3 3v-3Zm-8 0v3a3 3 0 1 1-3-3h3Z"/>'};
 const svg=key=>'<svg class="portoin-icon" data-portoin-icon="'+key+'" viewBox="0 0 24 24" aria-hidden="true">'+(paths[key]||paths.arrow)+'</svg>';
 window.PortoinIcons={svg};
 const symbolMap={'↗':'arrow','↙':'left','↘':'down','↑':'up','↓':'down','→':'right','←':'left','☰':'menu','✕':'close','✣':'flower','✳':'sparkle','✦':'sparkle','▣':'grid','⌘':'command','◇':'sparkle','◉':'circle','●':'circle','☏':'phone','📞':'phone','📍':'pin','✉️':'mail','👋':'wave','☺':'smile','Ⅱ':'pause','▶':'play','✿':'flower','✽':'flower'};
 const symbols=/↗|↙|↘|↑|↓|→|←|☰|✕|✣|✳|✦|▣|⌘|◇|◉|●|☏|📞|📍|✉️|👋|☺|Ⅱ|▶|✿|✽/gu;
 function icons(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];let n;
  while(n=walker.nextNode()){if(n.parentElement?.closest('script,style,svg,textarea,input,.portoin-project-copy'))continue;symbols.lastIndex=0;if(symbols.test(n.textContent))nodes.push(n);}
  for(const node of nodes){const value=node.textContent,fragment=document.createDocumentFragment();let last=0;symbols.lastIndex=0;for(const m of value.matchAll(symbols)){fragment.append(document.createTextNode(value.slice(last,m.index)));const wrap=document.createElement('span');wrap.innerHTML=svg(symbolMap[m[0]]);fragment.append(wrap.firstChild);last=m.index+m[0].length;}fragment.append(document.createTextNode(value.slice(last)));node.replaceWith(fragment);}
 }
 // Only template UI affordances are normalized; profile and project descriptions are untouched.
 document.querySelectorAll('nav,footer,.pill,.button,.circle-link,.project-arrow,.project-info>span,.skill-symbol,.skill-row>b,.section-head>small,.section-heading h2,.section-head h2,.creatiie-dock,.koi-dock,.zara-smile,.brand-flower,.motion-toggle,.vinyl-toggle,.orbit-controls button,.portoin-dialog .close,.portoin-added-message button,.message-form button,.goat-orb,.meadow,.race-badge,.orbit-badge,.michael-work>b,.scroll-label,.unbox-link,.back-top,.hero-actions,.availability,.creatiie-profile small,.portrait-caption,.notebook-intro>small,.contact-links a,.project-links a,.document-links a,.contact-card a,.sift-intro>.eyebrow,.about-copy>.muted').forEach(icons);
 const id=document.documentElement.dataset.portoinTemplate||[...document.body.classList].find(x=>profiles[x])||'developer';
 document.documentElement.dataset.portoinTemplate=id;document.documentElement.dataset.portoinMotionVersion='20261004';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),fine=matchMedia('(pointer:fine) and (hover:hover)'),body=document.body,hero=document.getElementById('hero');
 let button=document.querySelector('.motion-toggle'),ownsButton=!button;
 if(!button){button=document.createElement('button');button.className='portoin-motion-control';button.type='button';button.setAttribute('aria-label','Jeda animasi');button.setAttribute('aria-pressed','false');body.append(button);}
 let userPaused=body.classList.contains('paused'),disabled=()=>reduced.matches||userPaused;
 const animate=window.gsap,ST=window.ScrollTrigger;
 const progress=document.createElement('div');progress.className='portoin-progress';progress.setAttribute('aria-hidden','true');body.append(progress);
 const cursor=document.createElement('div');cursor.className='portoin-cursor style-'+(profiles[id]?.cursor||'dot');cursor.setAttribute('aria-hidden','true');cursor.innerHTML=svg('arrow')+'<span>Lihat</span>';body.append(cursor);
 let context,scrollY=window.scrollY,pointerX=innerWidth/2,pointerY=innerHeight/2,cx=pointerX,cy=pointerY,pointerInside=false,onProject=false,dirty=true,lastTick=0,scrollJobs=[],pointerJobs=[],revealTweens=[],cursor3d;
 const syncPause=()=>{const off=disabled();body.classList.toggle('portoin-motion-paused',off);button.innerHTML=svg(off?'play':'pause');button.setAttribute('aria-pressed',String(off));button.setAttribute('aria-label',reduced.matches?'Animasi dikurangi sesuai pengaturan perangkat':off?'Jalankan animasi':'Jeda animasi');if(animate)animate.globalTimeline.paused(off||document.hidden);if(off){revealTweens.forEach(t=>t.progress(1));document.querySelectorAll('.reveal-target.is-hidden').forEach(x=>x.classList.remove('is-hidden'));cursor.style.opacity='0';cursor3d?.hide();}dirty=true;};
 if(ownsButton)button.addEventListener('click',()=>{if(reduced.matches)return;userPaused=!userPaused;body.classList.toggle('paused',userPaused);syncPause();document.dispatchEvent(new Event('portoin-motion-change'));});
 document.addEventListener('portoin-motion-change',()=>{userPaused=body.classList.contains('paused');syncPause();});
 document.addEventListener('visibilitychange',syncPause);
 reduced.addEventListener('change',()=>{context?.revert();scrollJobs=[];pointerJobs=[];revealTweens=[];if(!reduced.matches)build();syncPause();document.dispatchEvent(new Event('portoin-motion-change'));});
 fine.addEventListener('change',()=>{cursor.style.opacity='0';pointerInside=false;});
 const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));
 const listen=(target,name,handler,options)=>{target?.addEventListener(name,handler,options);return()=>target?.removeEventListener(name,handler,options);};
 window.addEventListener('scroll',()=>{scrollY=window.scrollY;dirty=true;},{passive:true});
 window.addEventListener('resize',()=>{dirty=true;ST?.refresh();});
 const privateInput=target=>target?.closest('input,textarea,select,[contenteditable],dialog,iframe');
 document.addEventListener('pointermove',event=>{if(event.pointerType==='touch'||!fine.matches)return;pointerX=event.clientX;pointerY=event.clientY;pointerInside=!privateInput(event.target);onProject=!!event.target.closest('.project-cover,.project-image,.project-board,.project-media');cursor.classList.toggle('is-project',onProject);const surface=event.target.closest('section')||body;const color=getComputedStyle(surface).color.match(/[\d.]+/g)?.map(Number);cursor.classList.toggle('dark-surface',color&&color[0]+color[1]+color[2]>530);dirty=true;},{passive:true});
 document.addEventListener('pointerleave',()=>{pointerInside=false;cursor.style.opacity='0';cursor3d?.hide();});
 document.addEventListener('pointerdown',()=>{if(!disabled()&&fine.matches)animate?.fromTo(cursor,{scale:.72},{scale:1,duration:.3});});
 const rectProgress=(element,start=1,end=0)=>{const r=element.getBoundingClientRect();return clamp((innerHeight*start-r.top)/(r.height+innerHeight*(start-end)));};
 function revealWords(element){
  if(!element||element.querySelector('img,svg,canvas')||element.children.length)return [element].filter(Boolean);
  const value=element.textContent;const out=[];element.replaceChildren();
  value.split(/(\s+)/).forEach(word=>{if(!word.trim()){element.append(document.createTextNode(word));return;}const mask=document.createElement('span');mask.className='portoin-word-mask';const span=document.createElement('span');span.className='portoin-reveal-word';span.textContent=word;mask.append(span);element.append(mask);out.push(span);});return out;
 }
 function parallax(element,amount=50,axis='y',selector=null){if(!element)return;const subject=selector||element;animate.fromTo(element,{[axis]:-amount*.35},{[axis]:amount,duration:1,ease:'none',scrollTrigger:{trigger:subject,start:'top bottom',end:'bottom top',scrub:.65}});}
 function magnetic(selector,strength=16){
  document.querySelectorAll(selector).forEach(element=>{const move=event=>{if(disabled()||!fine.matches||event.pointerType==='touch')return;const r=element.getBoundingClientRect();animate.to(element,{x:(event.clientX-r.left-r.width/2)/r.width*strength,y:(event.clientY-r.top-r.height/2)/r.height*strength,duration:.45,ease:'power3.out',overwrite:'auto'});};const leave=()=>animate.to(element,{x:0,y:0,duration:.6,ease:'elastic.out(1,.5)',overwrite:'auto'});context.add(()=>{const a=listen(element,'pointermove',move),b=listen(element,'pointerleave',leave);return()=>{a();b();};});});
 }
 function marquee(){const host=document.querySelector('#about');if(!host||host.querySelector('.portoin-work-marquee'))return;const images=[...document.querySelectorAll('#projects .project-cover img')].slice(0,6);if(images.length<2)return;const outer=document.createElement('div');outer.className='portoin-work-marquee';outer.setAttribute('aria-hidden','true');const track=document.createElement('div');track.className='portoin-marquee-track';for(let round=0;round<3;round++)images.forEach(image=>{const copy=image.cloneNode();copy.alt='';copy.loading='lazy';copy.removeAttribute('id');track.append(copy);});outer.append(track);host.append(outer);animate.to(track,{xPercent:-100/3,duration:24,repeat:-1,ease:'none'});context.add(()=>()=>outer.remove());}
 function trail(){
  const images=[...document.querySelectorAll('#projects .project-cover img')].slice(0,8).map(x=>x.currentSrc||x.src);if(!images.length)return;
  const layer=document.createElement('div');layer.className='portoin-image-trail';layer.setAttribute('aria-hidden','true');body.append(layer);let last={x:0,y:0,time:0},index=0;
  const handler=event=>{if(disabled()||!fine.matches||event.pointerType==='touch'||privateInput(event.target)||event.target.closest('#projects'))return;const now=performance.now();if(now-last.time<95||Math.hypot(event.clientX-last.x,event.clientY-last.y)<65)return;last={x:event.clientX,y:event.clientY,time:now};if(layer.childElementCount>7)layer.firstElementChild.remove();const image=document.createElement('img');image.src=images[index++%images.length];image.alt='';image.style.left=event.clientX-72+'px';image.style.top=event.clientY-50+'px';layer.append(image);animate.fromTo(image,{scale:.2,rotation:-15+Math.random()*30,opacity:0},{scale:1,opacity:1,duration:.35,ease:'power3.out'});animate.to(image,{scale:.45,y:35,opacity:0,duration:.7,delay:.55,onComplete:()=>image.remove()});};
  const remove=listen(hero||body,'pointermove',handler);context.add(()=>()=>{remove();layer.remove();});
 }
 function orbitDrag(){
  const orbit=document.querySelector('.orbit-gallery');if(!orbit)return;let start=0,active=false,moved=false;
  const down=e=>{if(e.button!==0)return;start=e.clientX;active=true;moved=false;};const move=e=>{if(!active||disabled())return;const delta=e.clientX-start;if(Math.abs(delta)>75){moved=true;orbit.classList.add('dragging');orbit.dispatchEvent(new CustomEvent('portoin-orbit-step',{detail:delta>0?-1:1}));start=e.clientX;}};const up=()=>{active=false;orbit.classList.remove('dragging');setTimeout(()=>moved=false,100);};const click=e=>{if(moved){e.preventDefault();e.stopImmediatePropagation();}};
  const removers=[listen(orbit,'pointerdown',down),listen(window,'pointermove',move),listen(window,'pointerup',up),listen(orbit,'click',click,true)];orbit.tabIndex=0;const key=e=>{if(e.target!==orbit)return;if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();orbit.dispatchEvent(new CustomEvent('portoin-orbit-step',{detail:e.key==='ArrowLeft'?-1:1}));}};removers.push(listen(orbit,'keydown',key));context.add(()=>()=>removers.forEach(r=>r()));
 }
 function build(){
  if(!animate||!ST||reduced.matches)return;animate.registerPlugin(ST);body.classList.add('portoin-motion-enabled');
   context=animate.context(self=>{context=self;
   const cfg=profiles[id]||profiles.developer,headings=[...document.querySelectorAll('main section h2,#about h2,#projects h2')].filter(x=>!x.closest('form'));
   headings.forEach(heading=>{const targets=cfg.words?revealWords(heading):[heading];revealTweens.push(animate.from(targets,{yPercent:cfg.words?110:0,y:cfg.words?0:28,opacity:cfg.blur?1:0,filter:cfg.blur?'blur(12px)':'none',stagger:.045,duration:.8,ease:'power3.out',scrollTrigger:{trigger:heading,start:'top 93%',toggleActions:'play none none reverse'}}));});
   document.querySelectorAll('.history-item,.row,.note,.skill-group,.skill-row,.portoin-story-card,.portoin-skill-group').forEach((row,i)=>revealTweens.push(animate.from(row,{y:cfg.paper?20:35,opacity:0,rotation:cfg.paper?(i%2?3:-3):0,duration:.65,delay:i%3*.035,scrollTrigger:{trigger:row,start:'top 96%',toggleActions:'play none none reverse'}})));
   const projectCards=[...document.querySelectorAll('#projects .project-card,#projects .project')];
   if(!document.querySelector('.orbit-gallery,.drag-gallery'))projectCards.forEach((card,i)=>{revealTweens.push(animate.from(card,{y:cfg.paper?45:70,opacity:0,rotation:cfg.paper?(i%2?5:-5):0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:card,start:'top 94%',toggleActions:'play none none reverse'}}));if(cfg.projectParallax){const image=card.querySelector('.project-cover img,.project-image img,.project-board img');parallax(image,25, 'y',card);}});
   magnetic('.pill,.button,.circle-link,.michael-work,.contact-links a',cfg.magnetic||12);
   if(cfg.marquee)marquee();if(cfg.trail)trail();
   // Each reference retains its distinct scroll choreography.
   if(id==='haoqi-lab'){
    animate.to('.hello-stage',{rotation:-6,scale:.88,y:90,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.9}});document.querySelectorAll('.lab-sticker').forEach((e,i)=>parallax(e,(i%2?-1:1)*90));
    if(fine.matches)initChromeCursor();
   }
   if(id==='alejandro-creative'){
    const logo=hero?.querySelector('h1');if(logo){logo.classList.add('portoin-logo-contract');animate.to(logo,{scale:.38,y:70,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'45% top',scrub:1}});}
    animate.fromTo('.hero-portrait',{clipPath:'inset(12% 7% round 45px)'},{clipPath:'inset(0% 0% round 0px)',duration:1.2,ease:'power3.out'});
    animate.from('.orbit-gallery',{rotation:-14,scale:.78,scrollTrigger:{trigger:'.projects-section',start:'top 85%',end:'top 20%',scrub:1}});orbitDrag();
    stickyHeading('#skills');
   }
   if(id==='gallery-play'){
    animate.to('.stadium-art',{yPercent:30,scale:1.12,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.65}});animate.to('.stadium-shade',{opacity:.4,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.65}});
    const gallery=document.querySelector('.drag-gallery');if(gallery){const cards=[...gallery.querySelectorAll('.project-card')];const layout=()=>{if(disabled())return;const r=gallery.getBoundingClientRect();cards.forEach(card=>{const c=card.getBoundingClientRect(),distance=clamp(((c.left+c.width/2)-(r.left+r.width/2))/r.width,-1,1);card.style.rotate='y '+(-distance*30)+'deg';card.style.translate='0 '+Math.abs(distance)*25+'px';});};const remove=listen(gallery,'scroll',layout,{passive:true});scrollJobs.push(layout);context.add(()=>()=>{remove();cards.forEach(c=>{c.style.rotate='';c.style.translate='';});});}
   }
   if(id==='pamidor-studio'){parallax(document.querySelector('.pamidor-photo'),65);stickyHeading('#skills');}
   if(id==='bermawy-notebook'){
    const photo=document.querySelector('.polaroid');if(photo){photo.classList.add('portoin-photo-cycle');const original=photo.querySelector('img');if(original){const copy=original.cloneNode();copy.className='portoin-photo-alternate';copy.alt='';photo.append(copy);context.add(()=>()=>copy.remove());}paperDrag(photo);}
    animate.to('.paperclip',{rotation:12,yoyo:true,repeat:-1,duration:3,ease:'sine.inOut'});projectCards.forEach((card,i)=>parallax(card,i%2?15:-15,'x'));
   }
   if(id==='zainab-sky'){
    parallax(document.querySelector('.cloud-one'),140,'x',hero);parallax(document.querySelector('.cloud-two'),-100,'x',hero);parallax(document.querySelector('.sky-sun'),-65,'y',hero);
    pointerJobs.push((x,y)=>{document.querySelectorAll('.meadow>span').forEach((flower,i)=>flower.style.rotate=(x*(i%2?12:-12))+'deg');});
   }
   if(id==='goats-bold'){
    animate.fromTo(hero,{clipPath:'inset(20% round 28px)',opacity:.15},{clipPath:'inset(0% round 0px)',opacity:1,duration:1.25,ease:'power4.out'});
    animate.to('.bouncy-name',{y:'35vh',scale:1.08,opacity:.05,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1}});parallax(document.querySelector('.orb-a'),120);parallax(document.querySelector('.orb-b'),-100);
   }
   if(id==='kail-bubbles')kailScroll();
   if(id==='okay-dev'){
    animate.to('.extruded-type',{rotationX:24,rotationZ:-3,y:70,scale:.85,transformPerspective:900,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.6}});document.querySelectorAll('.floating-work').forEach((e,i)=>parallax(e,(i%2?-1:1)*90));
   }
   if(id==='px-push'){
    animate.to('.px-word',{y:95,scaleY:1.3,opacity:.3,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1}});
    const reel=document.querySelector('.px-reel');if(reel)animate.fromTo(reel,{borderRadius:'50%',scale:.78},{borderRadius:'10px',scale:1.25,rotationX:0,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'55% top',scrub:.6}});
   }
   if(id==='arqos-studio'){
    animate.to('.chrome-word',{y:160,scale:1.08,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1}});parallax(document.querySelector('.arqos-portrait'),-90);stickyHeading('#skills');
    pointerJobs.push(x=>document.querySelector('.chrome-word')?.style.setProperty('background-position',(50+x*35)+'% 50%'));
   }
   if(id==='lurais-editorial'){
    animate.from('.hero-art,.abstract-art',{clipPath:'inset(100% 0 0 0)',scale:1.12,duration:1.4,ease:'power3.inOut'});parallax(document.querySelector('.hero-art,.abstract-art'),115);parallax(document.querySelector('.lurais-title'),-55);
   }
   if(id==='velocity-racing'){
    animate.to('.velocity-portrait',{scale:1.16,y:115,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1}});animate.to('.race-badge',{rotation:140,ease:'none',scrollTrigger:{trigger:hero,start:'top bottom',end:'bottom top',scrub:1}});parallax(document.querySelector('.velocity-title'),-60);animate.from('.track-pattern',{clipPath:'inset(0 100% 0 0)',duration:1.2,ease:'power4.out'});
   }
   if(id==='bintang-koi'){projectCards.forEach(c=>tilt(c,5));}
   if(id==='michael-orange'){
    animate.from('.michael-portrait',{y:90,opacity:0,duration:1.1,ease:'power3.out'});parallax(document.querySelector('.ghost-name'),90,'x',hero);parallax(document.querySelector('.michael-portrait'),60);
   }
   if(id==='sift-neon'){
    animate.to('.outline-star',{rotation:360,duration:36,repeat:-1,ease:'none'});animate.from('.sift-photo',{y:50,opacity:0,duration:1});parallax(document.querySelector('.sift-photo'),-45);projectCards.forEach(c=>tilt(c,5));
   }
   if(id==='unboxed-scrapbook'){
    animate.from('.hero-portrait',{y:100,scale:.85,opacity:0,duration:1.3,delay:.15,ease:'back.out(1.3)'});animate.from('.project-parcel',{rotationX:-65,transformPerspective:900,scale:.92,opacity:0,stagger:.08,duration:1,scrollTrigger:{trigger:'#projects',start:'top 85%'}});document.querySelectorAll('.project-board,.package,.note').forEach(e=>tilt(e,4));
    pointerJobs.push((x,y)=>{const back=document.querySelector('.hero-back');if(back){back.style.rotate='y '+x*5+'deg';back.style.translate=x*8+'px '+y*8+'px';}document.querySelectorAll('.box-hero .sticker').forEach((s,i)=>s.style.translate=x*(i%2?-16:16)+'px '+y*14+'px');});
   }
   if(id==='majd'){animate.to('.majd-star',{rotation:360,duration:38,repeat:-1,ease:'none'});parallax(hero?.querySelector('h1'),-60);projectCards.forEach(e=>tilt(e,3));}
   if(id==='zara-miller'){document.querySelectorAll('.zara-inline').forEach((image,i)=>animate.to(image,{rotation:i%2?10:-10,y:i%2?10:-10,yoyo:true,repeat:-1,duration:3+i*.4,ease:'sine.inOut'}));parallax(hero?.querySelector('h1'),-40);}
   if(id==='derek-muller'){animate.from('.hero-derek .portrait',{scale:.7,opacity:0,duration:.9,ease:'back.out(1.3)'});}
   if(id==='creatiie'){
    parallax(document.querySelector('.hero-gradient'),100);document.querySelectorAll('.hero-creatiie .sticker').forEach((sticker,i)=>parallax(sticker,i%2?70:-70));
    const dock=document.querySelector('.creatiie-dock');if(dock){const handler=e=>{if(disabled()||!fine.matches)return;dock.querySelectorAll('a').forEach(a=>{const r=a.getBoundingClientRect(),distance=Math.abs(e.clientX-(r.left+r.width/2));a.style.scale=String(1+.45*Math.max(0,1-distance/95));});};const leave=()=>dock.querySelectorAll('a').forEach(a=>a.style.scale='1');const a=listen(dock,'pointermove',handler),b=listen(dock,'pointerleave',leave);context.add(()=>()=>{a();b();leave();});}
   }
  });
  syncPause();ST.refresh();
 }
 function stickyHeading(selector){const section=document.querySelector(selector),heading=section?.querySelector('.section-heading,.section-head');if(!section||!heading||innerWidth<1000)return;const content=section.querySelector('.skill-list,.skills-grid');if(!content||content.getBoundingClientRect().height<250)return;animate.to(heading,{y:Math.min(180,content.getBoundingClientRect().height*.3),ease:'none',scrollTrigger:{trigger:section,start:'top 10%',end:'bottom bottom',scrub:1}});}
 function tilt(element,amount){const move=e=>{if(disabled()||!fine.matches)return;const r=element.getBoundingClientRect();animate.to(element,{rotationY:((e.clientX-r.left)/r.width-.5)*amount,rotationX:-((e.clientY-r.top)/r.height-.5)*amount,transformPerspective:800,duration:.5,overwrite:'auto'});};const leave=()=>animate.to(element,{rotationX:0,rotationY:0,duration:.7,overwrite:'auto'});const a=listen(element,'pointermove',move),b=listen(element,'pointerleave',leave);context.add(()=>()=>{a();b();});}
 function paperDrag(element){let down=false,x=0,y=0,dx=0,dy=0;const start=e=>{if(e.pointerType==='touch'||e.button!==0||disabled())return;down=true;x=e.clientX;y=e.clientY;element.classList.add('portoin-dragging');};const move=e=>{if(!down)return;dx=clamp(e.clientX-x,-65,65);dy=clamp(e.clientY-y,-45,45);animate.to(element,{x:dx,y:dy,rotation:dx*.08,duration:.15,overwrite:'auto'});};const end=()=>{if(!down)return;down=false;element.classList.remove('portoin-dragging');animate.to(element,{x:0,y:0,rotation:0,duration:.7,ease:'elastic.out(1,.6)',overwrite:'auto'});};const remove=[listen(element,'pointerdown',start),listen(window,'pointermove',move),listen(window,'pointerup',end)];context.add(()=>()=>remove.forEach(r=>r()));}
 function kailScroll(){
  const video=document.getElementById('kail-film');if(!video||!hero)return;let target=0,loaded=video.readyState>=2;
  const seek=()=>{if(!(loaded||video.readyState>=2)||disabled()||document.hidden||!video.duration||video.seeking)return;const next=clamp(target,.001,.999)*(video.duration-.03);if(Math.abs(video.currentTime-next)>.06)video.currentTime=next;};
  const update=e=>{target=e.progress;dirty=true;seek();};
  const trigger=ST.create({trigger:hero,start:'top top',end:()=>'+='+innerHeight*(innerWidth<760?1.2:2.2),pin:true,pinSpacing:true,scrub:.7,anticipatePin:1,invalidateOnRefresh:true,onUpdate:update});
  const loadedData=()=>{loaded=true;seek();};const removers=[listen(video,'loadeddata',loadedData),listen(video,'seeked',seek)];scrollJobs.push(seek);context.add(()=>()=>{trigger.kill();removers.forEach(r=>r());});
  animate.to('.kail-glass',{y:-60,scale:.94,opacity:.25,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:()=>'+='+innerHeight*2,scrub:1}});pointerJobs.push((x,y)=>document.querySelectorAll('.glass-bubble').forEach((b,i)=>b.style.translate=x*(i?40:-30)+'px '+y*30+'px'));
 }
 let chromeLoading=false;
 async function initChromeCursor(){
  if(chromeLoading)return;chromeLoading=true;
  try{
   if(!window.THREE)await new Promise((resolve,reject)=>{const ready=()=>{document.removeEventListener('portoin-three-ready',ready);clearTimeout(timer);resolve();};const timer=setTimeout(()=>{document.removeEventListener('portoin-three-ready',ready);reject();},18000);document.addEventListener('portoin-three-ready',ready);});
   if(!window.PortoinIcons||reduced.matches||!fine.matches)return;
   await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='/template-assets/motion/haoqi-cursor.js';script.onload=resolve;script.onerror=reject;document.head.append(script);});
   const T=window.THREE,layer=document.createElement('div');layer.className='portoin-cursor3d';layer.setAttribute('aria-hidden','true');body.append(layer);const canvas=document.createElement('canvas');layer.append(canvas);const renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));renderer.outputEncoding=T.sRGBEncoding;
   const scene=new T.Scene(),camera=new T.PerspectiveCamera(35,innerWidth/innerHeight,.1,100);camera.position.z=6;scene.add(new T.HemisphereLight(0xc7eaff,0x324c79,2));const light=new T.DirectionalLight(0xffffff,4);light.position.set(2,4,6);scene.add(light);
   const bytes=Uint8Array.from(atob(window.PORTOIN_CURSOR_MODEL),c=>c.charCodeAt(0));const gltf=await new Promise((resolve,reject)=>new T.GLTFLoader().parse(bytes.buffer,'',resolve,reject));delete window.PORTOIN_CURSOR_MODEL;
   const model=gltf.scene,box=new T.Box3().setFromObject(model),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());model.position.sub(center);const group=new T.Group();group.add(model);group.scale.setScalar(.5/Math.max(size.x,size.y,size.z));scene.add(group);group.traverse(node=>{if(node.isMesh)node.material=new T.MeshStandardMaterial({color:0x77bfff,metalness:.7,roughness:.23});});
   const resize=()=>{renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();};resize();window.addEventListener('resize',resize);
   const point=new T.Vector3();cursor3d={hide:()=>layer.style.opacity='0',render:(x,y)=>{point.set(x/innerWidth*2-1,-(y/innerHeight)*2+1,.5).unproject(camera);const direction=point.sub(camera.position).normalize();group.position.copy(camera.position).add(direction.multiplyScalar(-camera.position.z/direction.z));group.rotation.set(-.15,-.2+(x/innerWidth-.5)*.5,-.12);layer.style.opacity='1';renderer.render(scene,camera);}};layer.dataset.cursorModel='ready';
  }catch{chromeLoading=false;}
 }
 function tick(now){requestAnimationFrame(tick);if(now-lastTick<32||document.hidden)return;lastTick=now;
  const changed=Math.abs(cx-pointerX)+Math.abs(cy-pointerY)>.4;cx+=(pointerX-cx)*.22;cy+=(pointerY-cy)*.22;
  progress.style.transform='scaleX('+clamp(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))+')';
  if(disabled())return;
  if(fine.matches&&pointerInside){cursor.style.opacity=cursor3d&&!onProject?'0':'1';cursor.style.transform='translate('+(cx-(onProject?39:16))+'px,'+(cy-(onProject?39:16))+'px)';if(cursor3d&&!onProject)cursor3d.render(cx,cy);else cursor3d?.hide();}else{cursor.style.opacity='0';cursor3d?.hide();}
  if(dirty||changed){const x=(cx/innerWidth-.5)*2,y=(cy/innerHeight-.5)*2;pointerJobs.forEach(job=>job(x,y));scrollJobs.forEach(job=>job());dirty=false;}
 }
 syncPause();if(!reduced.matches)build();requestAnimationFrame(tick);
 // Recalculate pinned ranges after fonts and late image dimensions are available.
 document.fonts?.ready.then(()=>ST?.refresh());window.addEventListener('load',()=>ST?.refresh(),{once:true});
})();
