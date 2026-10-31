(() => {
 const $=id=>document.getElementById(id);if(!$("croCheckout"))return;
 let config=null,order=null,wallet=null,account=null,busy=false,uncertain=false;
 const status=s=>{$("croStatus").textContent=s;};
 async function api(action,body){const r=await fetch(`/api/cro/${action}`,{method:body?"POST":"GET",headers:body?{"content-type":"application/json"}:{},body:body?JSON.stringify(body):undefined,cache:"no-store",signal:AbortSignal.timeout(30000)});const d=await r.json();if(!r.ok)throw new Error(d.error||"Servizio non disponibile");return d;}
 const credentials=()=>({id:order.id,accessToken:order.accessToken});
 function save(){try{sessionStorage.setItem("gaia-cro-order",JSON.stringify({...credentials(),txHash:$("croTxHash").value,uncertain}));}catch{}}
 function render(){
  $("croReceiver").textContent=order?.receiver||config?.receiver||"Non configurato";
  $("croAccount").textContent=account||"Portafoglio non collegato";
  $("croConnect").disabled=busy||!config?.available;
  $("croCreate").disabled=busy||!config?.available||!account||Boolean(order);
  $("croTopic").disabled=busy||Boolean(order);
  $("croPay").disabled=busy||!order||!account||order.status==="paid"||Boolean($("croTxHash").value)||uncertain||!config?.available||!order.backedUp;
  $("croVerify").disabled=busy||!order||!$("croTxHash").value.trim();
  $("croDownload").disabled=busy||order?.status!=="paid";
  $("croBackup").disabled=busy||!order;
  $("croOrderSummary").textContent=order?`Ordine ${order.id} | ${order.summary||"Report tematico"} | Prezzo: 5 CRO + commissioni della rete` : "Scegli un argomento e prepara l'ordine. Nessun addebito fino alla tua firma nel portafoglio.";
 }
 async function action(fn){if(busy)return;busy=true;render();try{await fn();}catch(e){status(e.code===4001?"Operazione annullata nel portafoglio.":e.message||"Operazione non riuscita. Riprova la verifica senza pagare di nuovo.");}finally{busy=false;render();}}
 function download(name,content,type){const u=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement("a");a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
 async function load(){try{config=await api("config");status(config.available?"Pagamenti CRO disponibili su Cronos EVM. Il sito non riceve chiavi private.":config.reason);const saved=JSON.parse(sessionStorage.getItem("gaia-cro-order")||"null");if(saved){order=await api("resume",saved);$("croTxHash").value=saved.txHash||order.txHash||"";uncertain=Boolean(saved.uncertain);status("Ordine precedente recuperato. Usa Verifica pagamento o scarica il report gia' pagato.");}}catch(e){status(e.message);}render();}
 $("croConnect").addEventListener("click",()=>action(async()=>{wallet=window.ethereum;if(!wallet?.request)throw new Error("Apri Gaia-Lumen nel browser di un portafoglio compatibile Cronos EVM, oppure usa un'estensione come MetaMask. Crypto.com App e' il conto destinatario; non si collega come portafoglio web.");const accounts=await wallet.request({method:"eth_requestAccounts"});account=accounts?.[0];if(!/^0x[0-9a-f]{40}$/i.test(account||""))throw new Error("Portafoglio non disponibile");status("Portafoglio collegato. Prepara l'ordine per vedere il riepilogo.");}));
 $("croCreate").addEventListener("click",()=>action(async()=>{order=await api("order",{payer:account,topic:$("croTopic").value});uncertain=false;save();status("Report preparato e salvato. Conserva il riferimento ordine; poi autorizza 5 CRO dal portafoglio.");}));
 $("croPay").addEventListener("click",()=>action(async()=>{
  if(!wallet||!order)throw new Error("Collega prima il portafoglio");
  if(await wallet.request({method:"eth_chainId"})!=="0x19")await wallet.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x19"}]});
  const accounts=await wallet.request({method:"eth_accounts"});if(await wallet.request({method:"eth_chainId"})!=="0x19"||accounts?.[0]?.toLowerCase()!==order.payer.toLowerCase())throw new Error("Seleziona Cronos EVM e il portafoglio con cui hai creato l'ordine.");
  uncertain=true;save();status("Conferma nel portafoglio: 5 CRO al destinatario visualizzato, piu' commissioni della rete.");
  try{const txHash=await wallet.request({method:"eth_sendTransaction",params:[{from:order.payer,to:order.receiver,value:order.value,data:order.data,chainId:"0x19"}]});if(!/^0x[0-9a-f]{64}$/i.test(txHash||""))throw new Error("Invio da controllare nel portafoglio. Inserisci l'hash e verifica; non pagare di nuovo.");$("croTxHash").value=txHash;save();status("Transazione inviata. Salva di nuovo il riferimento per includere l'hash, poi premi Verifica pagamento: occorrono 15 conferme della rete.");}
  catch(e){if(e.code===4001){uncertain=false;save();}throw e;}
 }));
 $("croTxHash").addEventListener("input",()=>{if(order)save();render();});
 $("croVerify").addEventListener("click",()=>action(async()=>{const d=await api("verify",{...credentials(),txHash:$("croTxHash").value.trim()});order.status=d.status;save();status(d.status==="paid"?"Pagamento verificato sulla blockchain. Il tuo report e' pronto da scaricare.":`Pagamento in attesa: ${d.confirmations}/15 conferme. Riprova tra qualche secondo, senza pagare di nuovo.`);}));
 $("croDownload").addEventListener("click",()=>action(async()=>{const d=await api("report",{...credentials(),txHash:$("croTxHash").value.trim()});download(`gaia-lumen-report-${order.id}.txt`,d.report,"text/plain;charset=utf-8");status("Report scaricato. Conserva il riferimento ordine per recuperarlo.");}));
 $("croBackup").addEventListener("click",()=>{download(`gaia-lumen-ordine-${order.id}.json`,JSON.stringify({...credentials(),txHash:$("croTxHash").value,uncertain}),"application/json");order.backedUp=true;save();render();status("Riferimento salvato: conservalo privatamente insieme all'hash del pagamento. E' necessario per recuperare il report e non contiene chiavi del portafoglio.");});
 $("croRestore").addEventListener("change",e=>action(async()=>{const file=e.target.files?.[0];if(!file||file.size>16000)throw new Error("Scegli il file JSON del riferimento ordine.");const saved=JSON.parse(await file.text());const restored=await api("resume",saved);order={...restored,backedUp:true};$("croTxHash").value=saved.txHash||restored.txHash||"";uncertain=Boolean(saved.uncertain);save();status("Ordine recuperato. Verifica la transazione o scarica il report gia' pagato.");}));
 wallet=window.ethereum;if(wallet?.on)wallet.on("accountsChanged",accounts=>{account=accounts?.[0]||null;render();});
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();load();}},{rootMargin:"100px"});observer.observe($("croCheckout"));render();
})();
