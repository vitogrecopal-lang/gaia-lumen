(() => {
  const byId = id => document.getElementById(id);
  const root = byId('monitoraggio-cosmico');
  if (!root) return;
  const canvas = byId('cosmicCanvas'), ctx = canvas.getContext('2d');
  const model = byId('cosmicModel'), view = byId('cosmicView'), layer = byId('cosmicLayer');
  const yaw = byId('cosmicYaw'), pitch = byId('cosmicPitch'), zoom = byId('cosmicZoom');
  const history = byId('cosmicHistory'), pause = byId('cosmicPause');
  const samples = [];
  let lastReceived = 0, lastSample = 0, sequence = 0, paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = false, angle = 0, lastFrame = 0, dragging = null, animation = null;
  const finite = n => typeof n === 'number' && Number.isFinite(n) ? n : null;
  const cap = (n,a,b) => Math.min(b,Math.max(a,n));
  const fmt = (n,unit='') => finite(n) === null ? 'Non disponibile' : `${n.toLocaleString('it-IT',{maximumFractionDigits:3})}${unit}`;
  const clock = n => new Date(n).toLocaleTimeString('it-IT');
  function selected() { return samples[Math.min(Number(history.value),samples.length-1)] || null; }
  function extract(state) {
    const p = state.planetProject || {}, life = state.lifeCycle || {};
    const h = state.cosmogenesis?.epsilonEridaniHabitat || {}, growth = h.gestationGrowth || {};
    const c = growth.current || {}, orb = h.orbitalMechanics || {};
    return {id: ++sequence, received: Date.now(), aster: {
      name: p.name || 'Aster Gaia', mass: finite(p.massEarth), radius: finite(p.radiusEarth), orbit: finite(p.orbitAu), pressure: finite(p.atmosphereBar), oxygen: finite(p.oxygenPercent), water: finite(p.waterPercent), temperature: finite(p.meanTempC), bio: finite(life.biosphere) === null ? null : cap(life.biosphere*100,0,100), generation: finite(p.generation), sourceTime: p.history?.at(-1)?.time || null
    }, galia: {
      name: 'Galia-Lumen', mass: finite(h.galiaLumen?.massEarth), radius: finite(h.galiaLumen?.radiusEarth), orbit: finite(orb.semiMajorAxisAu ?? h.galiaLumen?.orbitAu), pressure: finite(c.pressureBar), oxygen: finite(c.oxygenPct), water: finite(c.oceanCoveragePct), temperature: finite(c.meanTempC), bio: finite(c.biospherePct), stage: growth.stage?.name || null, sourceTime: growth.updatedAt || null, inner: finite(h.habitableZone?.innerAu), outer: finite(h.habitableZone?.outerAu), eccentricity: finite(orb.eccentricity)
    }};
  }
  function data() { return selected()?.[model.value] || {}; }
  function updateConnection() {
    const age = Date.now()-lastReceived;
    byId('cosmicConnection').textContent = !lastReceived ? 'In attesa dello stato del sito...' : !navigator.onLine ? `Offline: ultima ricezione ${clock(lastReceived)}. Dati conservati.` : age > 15000 ? `Aggiornamento in ritardo: ultima ricezione ${clock(lastReceived)}. Dati conservati.` : `Stato ricevuto alle ${clock(lastReceived)}. Aggiornamento automatico del sito ogni 3 s.`;
  }
  function renderMetrics() {
    const s=selected(), d=data();
    const metrics=[['Massa',fmt(d.mass,' M Terra')],['Orbita',fmt(d.orbit,' AU')],['Pressione',fmt(d.pressure,' bar')],['Biosfera (indice)',fmt(d.bio,' / 100')],['Ossigeno',fmt(d.oxygen,' %')],['Acqua (superficie)',fmt(d.water,' %')],['Temperatura',fmt(d.temperature,' C')],['Raggio',fmt(d.radius,' R Terra')]];
    byId('cosmicMetrics').replaceChildren(...metrics.map(([label,value])=>{const div=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;div.append(dt,dd);return div;}));
    byId('cosmicHistoryLabel').textContent=s ? `${Number(history.value)===0?'Ultima lettura':'Storico: lettura precedente'} ${clock(s.received)} | ${samples.length}/60 campioni nella sessione` : 'Nessuna lettura ricevuta.';
    byId('cosmicSource').textContent=`${d.name || 'Pianeta'} | ${d.stage || (d.generation !== null && d.generation !== undefined ? 'Generazione '+d.generation : 'Parametri in attesa')}. ${d.sourceTime && Number.isFinite(Date.parse(d.sourceTime)) ? 'Data del modello: '+new Date(d.sourceTime).toLocaleString('it-IT')+'.' : 'Data dei parametri non disponibile.'}`;
    byId('cosmicViewLabel').textContent=(view.value==='orbit'?'Orbita 3D':layer.selectedOptions[0].textContent)+' | illustrazione del modello';
    updateConnection(); draw();
  }
  window.addEventListener('gaia:state',event=>{
    lastReceived=Date.now();
    if(lastReceived-lastSample<2400) {updateConnection(); return;}
    const current=event.detail;
    if(!current?.planetProject && !current?.cosmogenesis?.epsilonEridaniHabitat) return;
    lastSample=lastReceived;
    const offset=Number(history.value);
    samples.unshift(extract(current)); if(samples.length>60)samples.pop();
    history.max=Math.max(0,samples.length-1);history.disabled=samples.length<2;
    if(offset>0)history.value=Math.min(offset+1,samples.length-1);
    renderMetrics();
  });
  function project(x,y,z) {
    const a=Number(yaw.value)*Math.PI/180+angle, b=Number(pitch.value)*Math.PI/180;
    const xx=x*Math.cos(a)+z*Math.sin(a), zz=-x*Math.sin(a)+z*Math.cos(a);
    return [xx,y*Math.cos(b)-zz*Math.sin(b),y*Math.sin(b)+zz*Math.cos(b)];
  }
  function draw() {
    if(!ctx)return;
    const w=canvas.width,h=canvas.height,d=data(), scale=Number(zoom.value)/100;
    ctx.fillStyle='#040b17';ctx.fillRect(0,0,w,h);
    for(let i=0;i<70;i++){ctx.fillStyle=i%3?'#607b9c':'#c9e5ff';ctx.fillRect((i*193+17)%w,(i*i*37+23)%h,i%3?1:2,1);}
    if(!selected()){ctx.fillStyle='#c9e5ff';ctx.font='18px sans-serif';ctx.fillText('In attesa dei dati',w*.23,h*.5);return;}
    if(view.value==='orbit'){
      const orbit=finite(d.orbit), eccentricity=cap(d.eccentricity || 0,0,.7), r=155*scale;
      const path=(radius,color,width)=>{ctx.beginPath();for(let i=0;i<=120;i++){let t=i*Math.PI/60;const v=project((Math.cos(t)-eccentricity)*radius,0,Math.sin(t)*radius*Math.sqrt(1-eccentricity*eccentricity));const x=w/2+v[0],y=h/2+v[1]*.65;if(!i)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();};
      if(model.value==='galia'&&orbit>0&&d.inner&&d.outer){path(r*(d.inner+d.outer)/(2*orbit),'#163c3b',Math.min(85,(d.outer-d.inner)/orbit*r));}
      path(r,'#88cee5',2);
      const sun=ctx.createRadialGradient(w/2,h/2,1,w/2,h/2,25);sun.addColorStop(0,'#fff9d9');sun.addColorStop(.4,'#ffb75a');sun.addColorStop(1,'#ff9e2200');ctx.fillStyle=sun;ctx.beginPath();ctx.arc(w/2,h/2,25,0,Math.PI*2);ctx.fill();
      const v=project((Math.cos(.9)-eccentricity)*r,0,Math.sin(.9)*r*Math.sqrt(1-eccentricity*eccentricity));ctx.fillStyle='#8df5dc';ctx.beginPath();ctx.arc(w/2+v[0],h/2+v[1]*.65,10,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#d9edff';ctx.font='16px sans-serif';ctx.fillText('Demi-asse maggiore: '+fmt(orbit,' AU'),24,34);ctx.fillText('Geometria orbitale illustrativa',24,58);
      return;
    }
    const radius=135*scale*(d.radius?cap(Math.cbrt(d.radius),.8,1.2):1), cells=[];
    const terrain=(lat,lon)=>Math.sin(lon*3+Math.sin(lat*4))*Math.cos(lat*3)+.4*Math.sin(lon*7-lat*5);
    const xyz=(lat,lon)=>project(Math.cos(lat)*Math.sin(lon),Math.sin(lat),Math.cos(lat)*Math.cos(lon));
    for(let i=0;i<24;i++)for(let j=0;j<48;j++){
      const la=-Math.PI/2+i*Math.PI/24,lo=j*Math.PI/24;
      const points=[xyz(la,lo),xyz(la+Math.PI/24,lo),xyz(la+Math.PI/24,lo+Math.PI/24),xyz(la,lo+Math.PI/24)];
      const z=points.reduce((s,p)=>s+p[2],0)/4;if(z<0)continue;
      const land=terrain(la,lo)>(finite(d.water)===null?0:(d.water/100-.5)*2);
      const light=cap(.25+z*.55-points[0][0]*.22,.16,1);
      let rgb=land?[155,119,76]:[24,116,165];
      if(layer.value==='biosphere')rgb=land?[50,95+cap(d.bio||0,0,100),93]:[16,66,102];
      if(layer.value==='atmosphere')rgb=[43,102+Math.min(50,(d.pressure||0)*25),184];
      if(land&&Math.abs(la)>1.2)rgb=[195,218,229];
      cells.push({points,z,color:`rgb(${rgb.map(v=>Math.round(v*light)).join(',')})`});
    }
    const halo=ctx.createRadialGradient(w/2,h/2,radius*.9,w/2,h/2,radius*1.2);halo.addColorStop(0,'#71ccff00');halo.addColorStop(.65,layer.value==='atmosphere'?'#71ccff60':'#71ccff25');halo.addColorStop(1,'#71ccff00');ctx.fillStyle=halo;ctx.fillRect(w/2-radius*1.2,h/2-radius*1.2,radius*2.4,radius*2.4);
    cells.sort((a,b)=>a.z-b.z).forEach(cell=>{ctx.beginPath();cell.points.forEach((p,i)=>{const x=w/2+p[0]*radius,y=h/2-p[1]*radius;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.fillStyle=cell.color;ctx.fill();});
    ctx.fillStyle='#d9edff';ctx.font='18px sans-serif';ctx.fillText(d.name || '',24,32);
  }
  function animate(time){animation=null;if(!visible||document.hidden)return;if(time-lastFrame>33){if(!paused&&!dragging)angle+=.003;draw();lastFrame=time;}if(!paused)animation=requestAnimationFrame(animate);}
  function wake(){if(animation===null&&visible&&!document.hidden)animation=requestAnimationFrame(animate);}
  function syncPause(){pause.textContent=paused?'Riprendi rotazione':'Pausa rotazione';pause.setAttribute('aria-pressed',String(paused));wake();draw();}
  pause.addEventListener('click',()=>{paused=!paused;syncPause();});
  [yaw,pitch,zoom,model,view,layer,history].forEach(input=>input.addEventListener('input',renderMetrics));
  byId('cosmicLive').addEventListener('click',()=>{history.value=0;renderMetrics();});
  byId('cosmicReset').addEventListener('click',()=>{yaw.value=20;pitch.value=15;zoom.value=100;angle=0;view.value='globe';layer.value='surface';history.value=0;renderMetrics();});
  canvas.addEventListener('pointerdown',e=>{dragging={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!dragging)return;yaw.value=((Number(yaw.value)+(e.clientX-dragging.x)*.7+540)%360)-180;pitch.value=cap(Number(pitch.value)+(e.clientY-dragging.y)*.5,-70,70);dragging={x:e.clientX,y:e.clientY};draw();});
  const release=()=>{dragging=null;};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;wake();},{rootMargin:'100px'}).observe(canvas);else{visible=true;wake();}
  document.addEventListener('visibilitychange',()=>{updateConnection();wake();});
  window.addEventListener('online',updateConnection);window.addEventListener('offline',updateConnection);
  setInterval(updateConnection,5000);syncPause();renderMetrics();
})();
