import {FORMATION_STAGES,formationSnapshot} from "./gestation-model.js";
const root=document.getElementById("gestationExplorer");
if(root){
  const $=id=>document.getElementById(id);
  let snapshot=null,selected=0,following=true,received=0;
  const date=s=>s?new Date(s).toLocaleDateString("it-IT",{timeZone:"UTC"}):"Non disponibile";
  const buttons=FORMATION_STAGES.map((s,i)=>{
    const b=document.createElement("button");b.type="button";b.textContent=`${i+1}. ${s.title}`;b.addEventListener("click",()=>choose(i));$("gestationSteps").append(b);return b;
  });
  function choose(i){selected=i;following=false;render();}
  function render(){
    const phase=snapshot?.phases[selected]||FORMATION_STAGES[selected];
    $("gestationTitle").textContent=phase.title;
    $("gestationSummary").textContent=phase.summary;
    $("gestationExplanation").textContent=phase.detail;
    $("gestationQuestion").textContent=phase.question;
    $("gestationImage").setAttribute("href",`assets/gestation-stages.svg#${phase.image}`);
    $("gestationImageLabel").textContent=`Illustrazione concettuale: ${phase.title}`;
    $("gestationPhaseStatus").textContent=`Fase esplorata: ${phase.status||"in attesa dei dati"}. Intervallo del calendario: ${date(phase.from)} - ${date(phase.to)} (UTC).`;
    $("gestationMode").textContent=following?"Segui la fase attuale":"Esplorazione libera: il calendario del progetto non cambia";
    $("gestationFollow").setAttribute("aria-pressed",String(following));
    $("gestationRange").value=String(selected);$("gestationRange").setAttribute("aria-valuetext",phase.title);
    for(const [i,b] of buttons.entries()){b.setAttribute("aria-pressed",String(i===selected));b.textContent=`${i+1}. ${FORMATION_STAGES[i].title} - ${snapshot?.phases[i].status||"in attesa"}`;}
    $("gestationPrevious").disabled=selected===0;$("gestationNext").disabled=selected===4;
    $("gestationDiscuss").disabled=!received;
    if(snapshot){
      const pct=snapshot.progress===null?null:snapshot.progress*100;
      $("gestationProgress").value=pct||0;
      $("gestationProgressText").textContent=`Calendario complessivo: ${pct===null?"non disponibile":pct.toFixed(1)+"%"} | fase ${snapshot.active<0?"?":snapshot.active+1}/${snapshot.total}: ${snapshot.currentTitle}.`;
      $("gestationBeyond").textContent=snapshot.active>=5?"Le prime cinque tappe sono concluse. Il calendario prosegue nelle fasi successive; puoi continuare a esplorare queste immagini.":"Questo modulo approfondisce le prime cinque tappe del percorso di nove fasi gia' presente nel sito.";
    }
    status();
  }
  function status(){const age=received?Date.now()-received:Infinity;$("gestationConnection").textContent=!received?"In attesa dello stato del sito...":age>15000?"Aggiornamento sospeso o connessione assente: visualizzo l'ultimo stato ricevuto.":`Stato ricevuto alle ${new Date(received).toLocaleTimeString("it-IT")}. Aggiornato con il ciclo dati del sito.`;}
  window.addEventListener("gaia:state",e=>{if(!e.detail?.cosmogenesis)return;snapshot=formationSnapshot(e.detail.cosmogenesis);received=Date.now();if(following&&snapshot.active>=0)selected=Math.min(4,snapshot.active);render();});
  $("gestationRange").addEventListener("input",e=>choose(Number(e.target.value)));
  $("gestationPrevious").addEventListener("click",()=>choose(Math.max(0,selected-1)));
  $("gestationNext").addEventListener("click",()=>choose(Math.min(4,selected+1)));
  $("gestationFollow").addEventListener("click",()=>{following=true;if(snapshot?.active>=0)selected=Math.min(4,snapshot.active);render();});
  $("gestationDiscuss").addEventListener("click",()=>{const input=document.getElementById("chatInput");if(!input)return;input.value=`Parliamo della fase ${FORMATION_STAGES[selected].title}: ${FORMATION_STAGES[selected].question}`;input.focus();input.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"center"});});
  setInterval(()=>{if(!document.hidden)status();},5000);
  render();
}
