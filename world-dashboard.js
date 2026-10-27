import {createEventMap} from "./world-event-map.js";
import {validLocation} from "./world-map-model.js";
(() => {
  const root=document.getElementById("worldDashboard"); if(!root)return;
  const $=id=>document.getElementById(id);
  const colors={NASA:"#7fcaff",ESA:"#b7a3ff",WHO:"#6ce9b2",UN:"#ffc778",USGS:"#ff8d98"};
  let data=null,busy=false,expanded=false,stopped=false,lastLoad=0;
  function node(tag,text,parent){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(parent)parent.append(n);return n;}
  function link(text,url,parent){const a=node("a",text,parent);a.href=url;a.target="_blank";a.rel="noopener noreferrer";return a;}
  function date(s){return s?new Date(s).toLocaleString("it-IT"):"mai";}
  function filtered(){const cutoff=Date.now()-Number($("worldDays").value)*86400000;const term=$("worldSearch").value.toLowerCase().trim();return (data?.items||[]).filter(i=>(!$("worldSource").value||i.source===$("worldSource").value)&&(!$("worldCategory").value||i.category===$("worldCategory").value)&&Date.parse(i.publishedAt)>=cutoff&&(!term||i.title.toLowerCase().includes(term)));}
  function showEvent(i){const p=$("worldSelection");p.replaceChildren();node("strong",`${i.source} | ${date(i.publishedAt)} `,p);link(i.title,i.url,p);if(validLocation(i))node("span",` | Coordinate WGS84: ${i.lat.toFixed(3)} lat, ${i.lon.toFixed(3)} lon | Magnitudo: ${Number.isFinite(i.magnitude)?i.magnitude:"non disponibile"} | Profondita': ${Number.isFinite(i.depthKm)?i.depthKm+" km":"non disponibile"}`,p);if(data?.sources.find(s=>s.id===i.source)?.stale)node("strong"," | Fonte non aggiornata: ultimo dato memorizzato.",p);}
  const eventMap=createEventMap(showEvent);
  function render(){
    if(!data)return;
    const items=filtered();
    $("worldCount").textContent=`${items.length} elementi nel campione filtrato. ${items.filter(validLocation).length} geolocalizzati; le notizie senza coordinate restano nella timeline.`;
    const sourceBox=$("worldSources");sourceBox.replaceChildren();
    for(const s of data.sources){const p=node("p",undefined,sourceBox);link(s.id,s.url,p);node("span",` - ${s.stale?"NON AGGIORNATA":"disponibile"} | bollettino piu' recente: ${date(s.latestPublishedAt)} | ultima ricezione: ${date(s.fetchedAt)} | ultimo tentativo: ${date(s.attemptedAt)}${s.error?" | "+s.error:""}`,p);}
    $("worldSelection").textContent="Seleziona un punto o scegli un evento nell'elenco sotto la mappa per visualizzare fonte e coordinate.";
    eventMap.update(items);
    const chart=$("worldChart");chart.replaceChildren();
    const max=Math.max(1,...Object.keys(colors).map(s=>items.filter(i=>i.source===s).length));
    for(const s of Object.keys(colors)){const count=items.filter(i=>i.source===s).length,row=node("div",undefined,chart);node("span",`${s}: ${count}`,row);const bar=node("span","",row);bar.className="world-bar";bar.style.width=`${count/max*100}%`;bar.style.background=colors[s];}
    const list=$("worldTimeline");list.replaceChildren();
    for(const i of items.slice(0,80)){const li=node("li",undefined,list);node("small",`${date(i.publishedAt)} | ${i.source} | ${i.category}`,li);link(i.title,i.url,li);if(validLocation(i)){const locate=node("button","Mostra sulla mappa",li);locate.type="button";locate.addEventListener("click",()=>{eventMap.focusEvent(i.id);$("worldMap").scrollIntoView({block:"center",behavior:"instant"});});}const b=node("button","Usa come scenario",li);b.type="button";b.addEventListener("click",()=>{showEvent(i);$("worldScenario").textContent=`Scenario selezionato: ${i.source} - ${i.title}. Nessuna conseguenza reale prevista.`;});}
    if(!items.length)node("li","Nessun elemento disponibile con questi filtri. Prova ad ampliare il periodo o controlla lo stato delle fonti.",list);
    if(items.length>80)node("li",`Mostrati gli 80 elementi piu' recenti di ${items.length}; restringi i filtri per esplorare gli altri.`,list);
    simulate();
  }
  function simulate(){
    const count=filtered().length, cooperation=Number($("worldCoop").value),resilience=Number($("worldResilience").value);
    $("worldCoopValue").textContent=String(cooperation);$("worldResilienceValue").textContent=String(resilience);
    const demand=Math.min(100,count*2),residual=Math.max(0,Math.round(demand-(cooperation+resilience)/4));
    $("worldSimulation").textContent=`SIMULAZIONE DIDATTICA: ${count} elementi filtrati. Carico convenzionale ${demand}/100; carico residuo ${residual}/100. Formula: carico = min(100, elementi x 2); residuo = max(0, carico - (cooperazione + resilienza)/4), arrotondato. Questi numeri dipendono dal campione e dalle tue ipotesi: non sono probabilita', rischio geopolitico, previsione sanitaria o valutazione delle politiche reali.`;
  }
  async function load(){
    if(busy)return;busy=true;$("worldRefresh").disabled=true;$("worldStatus").textContent="Aggiornamento delle cinque fonti...";
    try{const r=await fetch("/api/world-dashboard",{signal:AbortSignal.timeout(18000),cache:"no-store"});if(!r.ok)throw new Error();data=await r.json();lastLoad=Date.now();render();$("worldStatus").textContent=`Ricezione dashboard: ${date(data.generatedAt)}. ${data.sources.filter(s=>!s.stale).length}/5 fonti disponibili. Aggiornamento ogni 5 minuti mentre la pagina e' visibile. Titoli nella lingua originale.`;}
    catch{$("worldStatus").textContent="Connessione non disponibile. Gli eventuali dati visibili sono della ricezione precedente, non aggiornati.";}
    finally{busy=false;$("worldRefresh").disabled=false;}
  }
  const preferenceIds=["worldSource","worldCategory","worldDays"];
  try{const saved=JSON.parse(localStorage.getItem("gaia-world-view")||"{}");for(const id of preferenceIds){if([...$(id).options].some(o=>o.value===saved[id]))$(id).value=saved[id];}}catch{}
  for(const id of preferenceIds)$(id).addEventListener("change",()=>{try{localStorage.setItem("gaia-world-view",JSON.stringify(Object.fromEntries(preferenceIds.map(k=>[k,$(k).value]))));}catch{}$("worldScenario").textContent="Scenario: campione di bollettini attualmente filtrato.";render();});
  $("worldSearch").addEventListener("input",render);
  for(const id of ["worldCoop","worldResilience"])$(id).addEventListener("input",simulate);
  $("worldRefresh").addEventListener("click",load);
  $("worldAuto").addEventListener("change",()=>{stopped=!$("worldAuto").checked;});
  $("worldExpand").addEventListener("click",()=>{expanded=!expanded;if(expanded){root.setAttribute("popover","manual");root.showPopover();}else{root.hidePopover();root.removeAttribute("popover");}$("worldExpand").textContent=expanded?"Riduci dashboard":"Espandi dashboard";$("worldExpand").setAttribute("aria-expanded",String(expanded));});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&expanded)$("worldExpand").click();});
  setInterval(()=>{if(!stopped&&!document.hidden&&Date.now()-lastLoad>=300000)load();},300000);
  document.addEventListener("visibilitychange",()=>{if(!document.hidden&&!stopped&&Date.now()-lastLoad>=300000)load();});
  // Load only when approaching this panel; no work during initial chat rendering.
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();load();}},{rootMargin:"200px"});observer.observe(root);
})();
