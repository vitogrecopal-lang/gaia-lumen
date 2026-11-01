for(const root of document.querySelectorAll("[data-report-sample]")){
 const topic=document.getElementById(root.dataset.topicControl),generate=root.querySelector("[data-sample-generate]"),download=root.querySelector("[data-sample-download]"),preview=root.querySelector("[data-sample-text]"),status=root.querySelector("[data-sample-status]");
 let sample=null,busy=false;
 topic.addEventListener("change",()=>{sample=null;download.disabled=true;preview.hidden=true;status.textContent="Argomento cambiato. Puoi generare un nuovo esempio gratuito.";});
 generate.addEventListener("click",async()=>{
  if(busy)return;const requestedTopic=topic.value;busy=true;generate.disabled=true;download.disabled=true;preview.hidden=true;sample=null;status.textContent="Preparo l'esempio dalle fonti pubbliche disponibili...";
  try{const r=await fetch(`/api/cro/sample?topic=${encodeURIComponent(requestedTopic)}`,{cache:"no-store",signal:AbortSignal.timeout(18000)});const d=await r.json();if(!r.ok)throw new Error(d.error||"Esempio non disponibile");if(topic.value!==requestedTopic)throw new Error("Argomento cambiato: genera un nuovo esempio.");sample=d;preview.textContent=d.text;preview.hidden=false;download.disabled=false;status.textContent=`Esempio pronto: ${d.count} bollettini. Compilato il ${new Date(d.generatedAt).toLocaleString("it-IT")}. Esempio senza connessione al portafoglio.`;}
  catch(e){status.textContent=e.name==="TimeoutError"?"Le fonti non rispondono in tempo. Riprova fra poco.":e.message||"Esempio temporaneamente non disponibile.";}
  finally{busy=false;generate.disabled=false;}
 });
 download.addEventListener("click",()=>{if(!sample)return;const url=URL.createObjectURL(new Blob([sample.text],{type:"text/plain;charset=utf-8"})),a=document.createElement("a");a.href=url;a.download=`gaia-lumen-esempio-${sample.topic}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
}
