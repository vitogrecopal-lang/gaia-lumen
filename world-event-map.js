import {validLocation,projectPoint,normalizeViewport,zoomViewport,fitViewport} from "./world-map-model.js";
export function createEventMap(onSelect){
 const $=id=>document.getElementById(id),svg=$("worldMap"),NS="http://www.w3.org/2000/svg";
 let viewport={x:0,y:0,width:360,height:180},items=[],selected=null,markers=[],drag=null,loaded=false;
 const make=(tag,attrs,parent)=>{const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));parent.append(n);return n;};
 const color=i=>!Number.isFinite(i.magnitude)?"#c1d0da":i.magnitude<4?"#ffe080":i.magnitude<5?"#ffad61":"#ff687b";
 function draw(){
  svg.setAttribute("viewBox",`${viewport.x} ${viewport.y} ${viewport.width} ${viewport.height}`);
  const unit=viewport.width/Math.max(1,svg.getBoundingClientRect().width);
  for(const m of markers){
   const visible=m.x>=viewport.x-viewport.width*.05&&m.x<=viewport.x+viewport.width*1.05&&m.y>=viewport.y-viewport.height*.05&&m.y<=viewport.y+viewport.height*1.05;
   m.group.style.visibility=visible?"visible":"hidden";m.group.setAttribute("tabindex",visible?"0":"-1");
   m.dot.setAttribute("r",String((Number.isFinite(m.item.magnitude)?Math.max(4,Math.min(8,m.item.magnitude+1)):4)*unit));
   m.hit.setAttribute("r",String(12*unit));m.ring.setAttribute("r",String(11*unit));
   m.ring.style.display=m.item.id===selected?"":"none";
   m.group.setAttribute("aria-pressed",String(m.item.id===selected));
  }
  $("worldMapLabels").style.display=viewport.width<=144?"":"none";
  $("worldMapZoomOut").disabled=viewport.width>=360;$("worldMapZoomIn").disabled=viewport.width<=30;
  $("worldMapView").textContent=`Zoom ${(360/viewport.width).toFixed(1)}x | centro ${(90-viewport.y-viewport.height/2).toFixed(2)} lat, ${(((viewport.x+viewport.width/2)%360+360)%360-180).toFixed(2)} lon`;
 }
 function setView(v){viewport=normalizeViewport(v);draw();}
 function select(id,center=false){const item=items.find(i=>i.id===id);if(!item)return;selected=id;$("worldMapEvent").value=id;if(center){const p=projectPoint(item);setView({x:p.x-30,y:p.y-15,width:60});}else draw();onSelect(item);}
 function update(next){
  items=next.filter(validLocation);if(!items.some(i=>i.id===selected))selected=null;
  if(!loaded){for(const u of document.querySelectorAll("#worldGeography use, #worldMapLabels use"))u.setAttribute("href",`assets/world-natural-earth.svg#${u.dataset.layer}`);loaded=true;}
  $("worldDots").replaceChildren();markers=[];
  for(const item of items){const p=projectPoint(item);
   for(const offset of [-360,0,360]){
    const group=make("g",{transform:`translate(${p.x+offset} ${p.y})`,role:"button","aria-label":`${item.title}; ${item.lat.toFixed(3)} lat, ${item.lon.toFixed(3)} lon`,"data-event":item.id},$("worldDots"));
    const title=make("title",{},group);title.textContent=item.title;
    const hit=make("circle",{fill:"transparent",class:"world-map-hit"},group);
    const ring=make("circle",{fill:"none",stroke:"#fff5a8","stroke-width":"2","vector-effect":"non-scaling-stroke",class:"world-map-ring"},group);
    const dot=make("circle",{fill:color(item),stroke:"#142b3d","stroke-width":"1","vector-effect":"non-scaling-stroke",class:"world-map-dot"},group);
    group.addEventListener("click",()=>select(item.id));group.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();select(item.id);}});
    markers.push({item,group,hit,ring,dot,x:p.x+offset,y:p.y});
   }
  }
  const selectBox=$("worldMapEvent");selectBox.replaceChildren();const placeholder=document.createElement("option");placeholder.value="";placeholder.textContent="Seleziona un evento (anche sovrapposto)";selectBox.append(placeholder);
  for(const i of items){const o=document.createElement("option");o.value=i.id;o.textContent=i.title;selectBox.append(o);}selectBox.value=selected||"";
  selectBox.disabled=!items.length;$("worldMapFit").disabled=!items.length;
  $("worldMapEmpty").textContent=items.length?`${items.length} eventi con coordinate valide. Le dimensioni dei punti variano con la magnitudo; non indicano l'area colpita.`:"Nessun evento geolocalizzato nei filtri attuali. Le notizie prive di coordinate restano nella timeline.";
  draw();if(selected)onSelect(items.find(i=>i.id===selected));
 }
 $("worldMapZoomIn").addEventListener("click",()=>setView(zoomViewport(viewport,.65)));
 $("worldMapZoomOut").addEventListener("click",()=>setView(zoomViewport(viewport,1/.65)));
 $("worldMapReset").addEventListener("click",()=>setView({x:0,y:0,width:360}));
 $("worldMapFit").addEventListener("click",()=>setView(fitViewport(items)));
 $("worldMapEvent").addEventListener("change",e=>select(e.target.value,true));
 for(const [id,dx,dy] of [["worldMapWest",-1,0],["worldMapEast",1,0],["worldMapNorth",0,-1],["worldMapSouth",0,1]])$(id).addEventListener("click",()=>setView({...viewport,x:viewport.x+dx*viewport.width/5,y:viewport.y+dy*viewport.height/5}));
 $("worldMapTouch").addEventListener("change",()=>{svg.classList.toggle("world-map-drag",$("worldMapTouch").checked);});
 svg.addEventListener("pointerdown",e=>{if(e.button!==0||e.target.closest("[data-event]")||(e.pointerType!=="mouse"&&!$("worldMapTouch").checked))return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,v:{...viewport}};svg.setPointerCapture(e.pointerId);});
 svg.addEventListener("pointermove",e=>{if(!drag||drag.id!==e.pointerId)return;const rect=svg.getBoundingClientRect();setView({...drag.v,x:drag.v.x-(e.clientX-drag.x)*drag.v.width/rect.width,y:drag.v.y-(e.clientY-drag.y)*drag.v.height/rect.height});});
 for(const type of ["pointerup","pointercancel","lostpointercapture"])svg.addEventListener(type,()=>{drag=null;});
 svg.addEventListener("keydown",e=>{if(e.target!==svg)return;const arrows={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(arrows[e.key]){e.preventDefault();const [dx,dy]=arrows[e.key];setView({...viewport,x:viewport.x+dx*viewport.width/5,y:viewport.y+dy*viewport.height/5});}else if(e.key==="+"||e.key==="-"){e.preventDefault();setView(zoomViewport(viewport,e.key==="+"?.65:1/.65));}});
 new ResizeObserver(draw).observe(svg);
 draw();return {update,focusEvent:id=>select(id,true)};
}
