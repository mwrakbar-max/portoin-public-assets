/* Native, dependency-free interactions except the lazy loaded Haoqi GLTF scene. */
(()=>{
 const body=document.body,reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduce.matches,heroVisible=true,pointer={x:0,y:0},target={x:0,y:0};
 const pauseButton=document.querySelector('.motion-toggle');
 const hero=document.querySelector('.hero');
 function setPause(next){paused=next;body.classList.toggle('paused',paused);if(pauseButton){pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.setAttribute('aria-label',paused?'Jalankan animasi':'Jeda animasi');pauseButton.innerHTML=window.PortoinIcons?window.PortoinIcons.svg(paused?'play':'pause'):(paused?'▶':'Ⅱ');}document.dispatchEvent(new Event('portoin-motion-change'));}
 setPause(paused);pauseButton?.addEventListener('click',()=>setPause(!paused));
 const extruded=hero?.querySelector('.extruded-type');if(extruded&&!extruded.querySelector('.type-fill')){const value=extruded.textContent;extruded.textContent='';for(const cls of ['shade-left','shade-right','type-fill']){const span=document.createElement('span');span.className=cls;span.textContent=value;if(cls!=='type-fill')span.setAttribute('aria-hidden','true');extruded.append(span);}}
 const repeated=hero?.querySelector('.px-word');if(repeated)repeated.textContent=hero.querySelector('h1').textContent;
 reduce.addEventListener('change',()=>{document.documentElement.dataset.reducedMotion=String(reduce.matches);setPause(reduce.matches);});
 document.documentElement.dataset.reducedMotion=String(reduce.matches);
 document.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>{a.closest('details').open=false;}));
 document.querySelectorAll('.message-form').forEach(form=>form.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(form),email=form.dataset.email;if(!email||/[\r\n]/.test(email))return;location.href='mailto:'+encodeURIComponent(email)+'?subject='+encodeURIComponent('Pesan portfolio — '+data.get('name'))+'&body='+encodeURIComponent(String(data.get('message'))+'\n\nNama: '+data.get('name')+'\nEmail: '+data.get('email'));}));
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('is-hidden');observer.unobserve(e.target);}}),{rootMargin:'0px 0px -20px 0px',threshold:.03});
  if(!reduce.matches)document.querySelectorAll('.section-heading,.history-item,.skill-row,.project-card').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('reveal-target','is-hidden');observer.observe(el);}});
  if(hero)new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;hero.style.animationPlayState=heroVisible?'running':'paused';document.dispatchEvent(new Event('portoin-motion-change'));},{rootMargin:'200px'}).observe(hero);
 }
 hero?.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=hero.getBoundingClientRect();target={x:(e.clientX-r.left)/r.width-.5,y:(e.clientY-r.top)/r.height-.5};});
 hero?.addEventListener('pointerleave',()=>{target={x:0,y:0};});
 // The orbit keeps the DOM order intact for Portoin's project detail and ordering controls.
 const orbit=document.querySelector('.orbit-gallery');let orbitIndex=0;
 if(orbit){const cards=[...orbit.querySelectorAll('.project-card')],position=document.querySelector('.orbit-position');
  function layout(){if(!cards.length){document.querySelector('.orbit-controls')?.remove();return;}orbit.classList.add('orbit-ready');cards.forEach((card,i)=>{let d=(i-orbitIndex+cards.length)%cards.length;if(d>cards.length/2)d-=cards.length;const angle=d*.65;const x=Math.sin(angle)*(innerWidth<760?220:380),y=(1-Math.cos(angle))*180;card.style.transform='translate(-50%,-50%) translate('+x+'px,'+y+'px) rotate('+(d*12)+'deg) scale('+(d===0?1:.78)+')';card.style.opacity=Math.abs(d)<=1?'1':'0';card.style.zIndex=String(10-Math.abs(d));card.style.pointerEvents=Math.abs(d)<=1?'auto':'none';card.inert=Math.abs(d)>1;});if(position)position.textContent=String(orbitIndex+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');}
  document.querySelectorAll('[data-orbit]').forEach(b=>{b.disabled=cards.length<2;b.addEventListener('click',()=>{orbitIndex=(orbitIndex+Number(b.dataset.orbit)+cards.length)%cards.length;layout();});});window.addEventListener('resize',layout);orbit.addEventListener('portoin-orbit-step',e=>{orbitIndex=(orbitIndex+e.detail+cards.length)%cards.length;layout();});layout();
 }
 // Native scrolling on touch, pointer dragging on desktop, keyboard arrows on the gallery.
 document.querySelectorAll('.drag-gallery').forEach(gallery=>{
  gallery.tabIndex=0;gallery.setAttribute('role','region');let start=0,scroll=0,drag=false,moved=false;
  gallery.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.button!==0)return;start=e.clientX;scroll=gallery.scrollLeft;drag=true;moved=false;});
  gallery.addEventListener('pointermove',e=>{if(!drag)return;const delta=e.clientX-start;if(Math.abs(delta)>8){moved=true;gallery.classList.add('dragging');gallery.scrollLeft=scroll-delta;}});
  const end=()=>{drag=false;gallery.classList.remove('dragging');if(moved)gallery.dataset.dragged='true';setTimeout(()=>{delete gallery.dataset.dragged;},100);};
  window.addEventListener('pointerup',end);gallery.addEventListener('pointercancel',end);
  gallery.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopImmediatePropagation();moved=false;}},true);
  gallery.addEventListener('keydown',e=>{if(e.target!==gallery)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();gallery.scrollBy({left:gallery.clientWidth*.7*(e.key==='ArrowRight'?1:-1),behavior:paused?'auto':'smooth'});}});
 });
 const vinyl=document.querySelector('.vinyl-toggle');vinyl?.addEventListener('click',()=>{const boom=vinyl.closest('.boombox'),off=boom.classList.toggle('vinyl-paused');vinyl.setAttribute('aria-pressed',String(!off));vinyl.setAttribute('aria-label',off?'Putar piringan hitam':'Jeda piringan hitam');vinyl.innerHTML=window.PortoinIcons?window.PortoinIcons.svg(off?'play':'pause'):(off?'▶':'Ⅱ');});
 // Brief typewriter entrance; the complete name remains in the accessible heading.
 const typed=document.querySelector('.typed-intro');if(typed&&!paused){const value=typed.dataset.text;let i=0;typed.setAttribute('aria-label',value);typed.textContent='';const timer=setInterval(()=>{if(paused||i>=value.length){typed.textContent=value;clearInterval(timer);return;}typed.textContent=value.slice(0,++i);},55);}
 const video=document.getElementById('kail-film');let videoReady=false;
 if(video){video.addEventListener('loadeddata',()=>{videoReady=true;if(!reduce.matches)video.currentTime=Math.min(video.duration*.15,1);});video.addEventListener('error',()=>{video.style.display='none';});}
 let scene,camera,renderer,model,threeReady=false,lastFrame=0,time=0,loadStarted=false;
 function script(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='/template-assets/ten/'+src;s.onload=resolve;s.onerror=reject;document.head.append(s);});}
 async function initHello(){
  if(loadStarted||!document.getElementById('hello-canvas'))return;loadStarted=true;
  try{await script('three.min.js');await script('GLTFLoader.js');await script('hello-model.js');const T=window.THREE,canvas=document.getElementById('hello-canvas'),stage=canvas.parentElement;
   renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
   scene=new T.Scene();camera=new T.PerspectiveCamera(30,1,.1,100);camera.position.set(0,0,8);
   renderer.toneMappingExposure=.85;scene.add(new T.HemisphereLight(0xc4e8ff,0x5781ac,.9));const light=new T.DirectionalLight(0xffffff,2);light.position.set(2,4,4);scene.add(light);const rim=new T.DirectionalLight(0x72baff,1.4);rim.position.set(-4,0,2);scene.add(rim);
   const envCanvas=document.createElement('canvas');envCanvas.width=512;envCanvas.height=256;const ctx=envCanvas.getContext('2d'),grad=ctx.createLinearGradient(0,0,0,256);grad.addColorStop(0,'#c1dcf0');grad.addColorStop(.25,'#ffffff');grad.addColorStop(.4,'#193f65');grad.addColorStop(.55,'#bce1ff');grad.addColorStop(.7,'#5e97c5');grad.addColorStop(1,'#e9e3d6');ctx.fillStyle=grad;ctx.fillRect(0,0,512,256);ctx.fillStyle='#ffffff';ctx.fillRect(65,20,60,185);ctx.fillRect(290,30,95,160);const env=new T.CanvasTexture(envCanvas);env.mapping=T.EquirectangularReflectionMapping;const pmrem=new T.PMREMGenerator(renderer);const reflection=pmrem.fromEquirectangular(env).texture;scene.environment=reflection;env.dispose();pmrem.dispose();
   const gltf=await new Promise((resolve,reject)=>new T.GLTFLoader().parse(JSON.stringify(window.PORTOIN_HELLO_MODEL),'',resolve,reject));model=gltf.scene;const box=new T.Box3().setFromObject(model),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());model.position.sub(center);const group=new T.Group();group.add(model);const scale=5.5/Math.max(size.x,size.y,size.z);group.scale.setScalar(scale);group.rotation.z=-.07;scene.add(group);model=group;
   group.traverse(node=>{if(node.isMesh)node.material=new T.MeshStandardMaterial({color:0x1358a0,metalness:.95,roughness:.16,envMap:reflection,envMapIntensity:1});});
   function resize(){const r=stage.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.position.z=camera.aspect<1.8?10:8;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(stage);resize();canvas.addEventListener('webglcontextlost',()=>{threeReady=false;stage.classList.remove('model-ready');});stage.classList.add('model-ready');threeReady=true;document.dispatchEvent(new Event('portoin-three-ready'));delete window.PORTOIN_HELLO_MODEL;
  }catch(error){document.querySelector('.hello-stage')?.classList.remove('model-ready');}
 }
 if(document.getElementById('hello-canvas')){if('IntersectionObserver' in window){const once=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){initHello();once.disconnect();}},{rootMargin:'100px'});once.observe(document.querySelector('.hello-stage'));}else initHello();}
 const floating=[...document.querySelectorAll('.floating-work,.lab-sticker')],pxWord=document.querySelector('.px-word');
 function tick(now){requestAnimationFrame(tick);if(now-lastFrame<33)return;lastFrame=now;if(document.hidden||!heroVisible)return;const moving=!paused;time+=moving?.033:0;pointer.x+=(target.x-pointer.x)*.09;pointer.y+=(target.y-pointer.y)*.09;
  if(threeReady){if(moving){model.rotation.y=pointer.x*.32+Math.sin(time*.35)*.09;model.rotation.x=pointer.y*.2;model.position.y=Math.sin(time*.8)*.07;}renderer.render(scene,camera);}
  if(moving)floating.forEach((el,i)=>{el.style.transform='translate('+pointer.x*(i%2?-18:18)+'px,'+pointer.y*16+'px)';});
  if(pxWord&&moving)pxWord.style.setProperty('--pointer-tilt',pointer.y*12+'deg');

 }
 requestAnimationFrame(tick);
})();
