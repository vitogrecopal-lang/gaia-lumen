import {UPDATE_TOPICS,bulletinState,topicBulletins,newlyReceived} from "./world-updates-model.js";
export function createWorldUpdates(){
  const $=id=>document.getElementById(id),seen=new Set();
  let data=null,initialized=false,offline=false;
  const date=s=>s?new Date(s).toLocaleString("it-IT"):"non disponibile";
  function node(tag,text,parent){const n=document.createElement(tag);n.textContent=text;if(parent)parent.append(n);return n;}
  function link(item,parent){const a=node("a",item.title,parent);a.href=item.url;a.target="_blank";a.rel="noopener noreferrer";}
  function current(id){return data?.items.find(i=>i.url===$(id).value);}
  function sourceDetail(item,target){
    target.replaceChildren();if(!item)return;
    const source=data.sources.find(s=>s.id===item.source);
    link(item,target);
    node("p",`${item.source} | Pubblicazione/evento: ${date(item.publishedAt)} | Ricezione fonte: ${date(source?.fetchedAt)} | ${bulletinState(item,data.sources,Date.now(),offline)}.`,target);
  }
  function progress(){const selected=current("worldCriticalEvent"),checked=$("worldCriticalChecks").querySelectorAll("input:checked").length;
    $("worldCriticalDownload").disabled=!selected;
    $("worldCriticalProgress").textContent=selected?`${checked}/4 passaggi dichiarati da te. Il completamento non dimostra che la notizia sia vera.`:"Seleziona una notizia per iniziare.";
  }
  function review(){sourceDetail(current("worldCriticalEvent"),$("worldCriticalSource"));sourceDetail(current("worldCompareEvent"),$("worldCriticalCompare"));progress();}
  function options(id,placeholder){const select=$(id),prior=select.value;select.replaceChildren();const empty=node("option",placeholder,select);empty.value="";
    for(const i of data.items){const o=node("option",`${i.source} | ${i.title}`,select);o.value=i.url;}
    if(data.items.some(i=>i.url===prior))select.value=prior;
    else if(prior&&id==="worldCriticalEvent")resetNotes();
  }
  function resetNotes(){for(const input of $("worldCriticalChecks").querySelectorAll("input"))input.checked=false;$("worldCriticalNotes").value="";$("worldCompareEvent").value="";}
  function select(url){if($("worldCriticalEvent").value!==url)resetNotes();$("worldCriticalEvent").value=url;review();$("worldCritical").scrollIntoView({block:"start",behavior:"instant"});$("worldCriticalEvent").focus({preventScroll:true});}
  function cards(){const box=$("worldUpdateCards");box.replaceChildren();
    for(const topic of UPDATE_TOPICS){const items=topicBulletins(data.items,topic.id);
      if(!items.length){const card=node("article","",box);card.className="world-update-card";node("h4",topic.label,card);node("p","Nessun bollettino ricevuto per questo ambito. Controlla lo stato delle fonti.",card);}
      for(const i of items){const card=node("article","",box);card.className="world-update-card";const status=bulletinState(i,data.sources,Date.now(),offline);card.dataset.stale=String(status==="Ricezione non aggiornata");node("span",`${topic.label} | ${status}`,card).className="truth-badge real";const heading=node("h4","",card);link(i,heading);const source=data.sources.find(s=>s.id===i.source);node("small",`${i.source} | Pubblicazione: ${date(i.publishedAt)} | Ricezione: ${date(source?.fetchedAt)}`,card);const b=node("button","Verifica e confronta",card);b.type="button";b.addEventListener("click",()=>select(i.url));}
    }
  }
  function render(next){const isNewSnapshot=data!==next;data=next;
    if(isNewSnapshot){offline=false;const fresh=data.items.filter(i=>!data.sources.find(s=>s.id===i.source)?.stale);const count=initialized?newlyReceived(fresh,seen).length:0;for(const i of fresh)seen.add(i.url);while(seen.size>1000)seen.delete(seen.values().next().value);$("worldNewUpdates").textContent=initialized?`${count} nuovi bollettini ricevuti dall'ultimo controllo in questa pagina. Non indica nuovi eventi o gravita'.`:"Prima ricezione: i bollettini disponibili non vengono conteggiati come nuovi.";initialized=true;}
    options("worldCriticalEvent","Scegli una notizia");options("worldCompareEvent","Scegli un confronto facoltativo");cards();review();
  }
  $("worldCriticalEvent").addEventListener("change",()=>{resetNotes();review();});
  $("worldCompareEvent").addEventListener("change",review);
  $("worldCriticalChecks").addEventListener("change",progress);
  $("worldCriticalDownload").addEventListener("click",()=>{const item=current("worldCriticalEvent");if(!item)return;const comparison=current("worldCompareEvent"),source=data.sources.find(s=>s.id===item.source);
    const text=["GAIA-LUMEN - SCHEDA PERSONALE DI LETTURA CRITICA",`Compilata: ${date(new Date().toISOString())}`,"Autovalutazione del lettore, non certificazione o verifica indipendente.",item.title,item.url,`Fonte: ${item.source}`,`Pubblicazione/evento: ${date(item.publishedAt)}`,`Ricezione: ${date(source?.fetchedAt)}`,bulletinState(item,data.sources,Date.now(),offline),"CONFRONTO",comparison?`${comparison.source}: ${comparison.title}\n${comparison.url}\nPubblicazione: ${date(comparison.publishedAt)}`:"Nessun secondo bollettino selezionato.","PASSAGGI DICHIARATI",...[...$("worldCriticalChecks").querySelectorAll("input")].map(i=>`${i.checked?"[x]":"[ ]"} ${i.value}`),"EVIDENZE E INCERTEZZE (APPUNTI DEL LETTORE)",$("worldCriticalNotes").value||"Nessun appunto."].join("\n\n");
    const url=URL.createObjectURL(new Blob([text],{type:"text/plain;charset=utf-8"})),a=document.createElement("a");a.href=url;a.download="gaia-lumen-lettura-critica.txt";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  return {render,select,markOffline(){offline=true;if(data){cards();review();}$("worldNewUpdates").textContent="Ricezione interrotta: i bollettini visibili non sono aggiornati.";}};
}
