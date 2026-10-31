import {createCipheriv,createDecipheriv,randomBytes,randomUUID} from "node:crypto";
import {deflateRawSync,inflateRawSync} from "node:zlib";
export const CRO_PRICE_WEI="5000000000000000000";
export const CRO_CONFIRMATIONS=15;
const address=/^0x[0-9a-f]{40}$/i,hash=/^0x[0-9a-f]{64}$/i,uuid=/^[0-9a-f-]{36}$/i;
const fail=(message,statusCode=400)=>Object.assign(new Error(message),{statusCode});
const eq=(a,b)=>typeof a==="string"&&typeof b==="string"&&a.toLowerCase()===b.toLowerCase();
export function paymentReference(id){return "0x"+Buffer.from(`GaiaLumen:${id}`,"utf8").toString("hex");}
export async function cronosRpc(method,params=[]){
 const r=await fetch("https://evm.cronos.org",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:1,method,params}),signal:AbortSignal.timeout(8000)});
 if(!r.ok)throw fail("Rete Cronos temporaneamente non disponibile. Riprova la verifica senza pagare di nuovo.",503);
 const d=await r.json();if(d.error||!("result" in d))throw fail("Risposta Cronos non disponibile. Riprova senza pagare di nuovo.",503);return d.result;
}
export async function verifyCroTransaction(order,txHash,rpc=cronosRpc){
 if(!hash.test(txHash))throw fail("Hash della transazione non valido.");
 if(await rpc("eth_chainId")!=="0x19")throw fail("Il nodo non e' sulla rete Cronos.",503);
 const [tx,receipt]=await Promise.all([rpc("eth_getTransactionByHash",[txHash]),rpc("eth_getTransactionReceipt",[txHash])]);
 if(!tx||!receipt)return {status:"pending",confirmations:0};
 if(!eq(tx.hash,txHash)||!eq(receipt.transactionHash,txHash)||!eq(tx.from,order.payer)||!eq(tx.to,order.receiver)||!eq(receipt.to,order.receiver)||!eq(tx.input,order.tx_data)||BigInt(tx.value)!==BigInt(order.amount_wei))throw fail("La transazione non corrisponde a questo ordine: verifica mittente, destinatario, importo e riferimento.");
 if(receipt.status!=="0x1")throw fail("Transazione fallita sulla blockchain. Il report non e' stato addebitato dal sito.");
 if(!receipt.blockNumber||!eq(tx.blockHash,receipt.blockHash)||tx.blockNumber!==receipt.blockNumber)return {status:"pending",confirmations:0};
 const [block,head]=await Promise.all([rpc("eth_getBlockByNumber",[receipt.blockNumber,false]),rpc("eth_blockNumber")]);
 if(!block||!eq(block.hash,receipt.blockHash))return {status:"pending",confirmations:0};
 const confirmations=Number(BigInt(head)-BigInt(receipt.blockNumber)+1n);
 return {status:confirmations>=CRO_CONFIRMATIONS?"paid":"pending",confirmations:Math.max(0,confirmations)};
}
export function createCroService({getData,rpc=cronosRpc,env=process.env}){
 let healthUntil=0;
 function key(){if(!/^[0-9a-f]{64}$/i.test(env.GAIA_CRO_ORDER_KEY||""))throw fail("Configurazione ordini CRO non disponibile.",503);return Buffer.from(env.GAIA_CRO_ORDER_KEY,"hex");}
 function seal(o){const iv=randomBytes(12),cipher=createCipheriv("aes-256-gcm",key(),iv);cipher.setAAD(Buffer.from("gaia-cro-invoice-v1"));const encrypted=Buffer.concat([cipher.update(deflateRawSync(Buffer.from(JSON.stringify(o)))),cipher.final()]);const token=["v1",iv.toString("base64url"),cipher.getAuthTag().toString("base64url"),encrypted.toString("base64url")].join(".");if(token.length>12000)throw fail("Report troppo grande: seleziona un argomento piu' specifico.",503);return token;}
 function settings(){return {enabled:env.GAIA_CRO_ENABLED==="true"&&address.test(env.GAIA_CRO_RECEIVER||"")&&!/^0x0{40}$/i.test(env.GAIA_CRO_RECEIVER||""),receiver:env.GAIA_CRO_RECEIVER||null,chainId:"0x19",network:"Cronos EVM",priceCro:"5",confirmations:CRO_CONFIRMATIONS,product:"Report tematico Gaia-Lumen",symbol:"CRO"};}
 async function ready(){const c=settings();key();if(!c.enabled)throw fail("Pagamenti CRO non attivi.",503);if(Date.now()>healthUntil){if(await rpc("eth_chainId")!=="0x19"||await rpc("eth_getCode",[c.receiver,"latest"])!=="0x")throw fail("Configurazione Cronos non verificabile: pagamenti sospesi.",503);healthUntil=Date.now()+30000;}return c;}
 async function authorize(body){const secret=key();try{if(!uuid.test(body.id||"")||typeof body.accessToken!=="string"||body.accessToken.length>12000)throw new Error();const parts=body.accessToken.split(".");if(parts.length!==4||parts[0]!=="v1")throw new Error();const iv=Buffer.from(parts[1],"base64url"),tag=Buffer.from(parts[2],"base64url");if(iv.length!==12||tag.length!==16)throw new Error();const decipher=createDecipheriv("aes-256-gcm",secret,iv);decipher.setAAD(Buffer.from("gaia-cro-invoice-v1"));decipher.setAuthTag(tag);const compressed=Buffer.concat([decipher.update(Buffer.from(parts[3],"base64url")),decipher.final()]);const o=JSON.parse(inflateRawSync(compressed,{maxOutputLength:24000}).toString("utf8"));if(o.id!==body.id||o.amount_wei!==CRO_PRICE_WEI||o.tx_data!==paymentReference(o.id)||!address.test(o.payer)||!address.test(o.receiver))throw new Error();return o;}catch{throw fail("Riferimento ordine non valido o modificato.",403);}}
 return {
  async config(){try{return {...await ready(),available:true};}catch{return {...settings(),available:false,reason:"Pagamento non disponibile: configurazione o rete da verificare."};}},
  async order(body){const c=await ready();if(!address.test(body.payer||"")||/^0x0{40}$/i.test(body.payer))throw fail("Indirizzo del portafoglio non valido.");const topics={tutti:"Tutti gli ambiti",spazio:"Spazio",salute:"Salute",geopolitica:"Relazioni internazionali",terra:"Terremoti"};if(!topics[body.topic])throw fail("Scegli un argomento valido.");const d=await getData();const items=d.items.filter(i=>(body.topic==="tutti"||i.category===body.topic)&&!d.sources.find(s=>s.id===i.source)?.stale).slice(0,30);if(!items.length)throw fail("Nessun bollettino aggiornato per questo argomento: nessun ordine creato.",503);
   const id=randomUUID(),txData=paymentReference(id);
   const report=["GAIA-LUMEN - REPORT TEMATICO",`Ordine: ${id}`,`Argomento: ${topics[body.topic]}`,`Compilato: ${d.generatedAt}`,"Servizio: selezione e compilazione automatica di informazioni gia' pubbliche; non analisi umana o consulenza.","Copertura limitata ai bollettini disponibili. Gli elementi non misurano il rischio reale. Nessuna previsione sanitaria, politica o astronomica.","",...items.map((i,n)=>`${n+1}. ${i.title}\nFonte: ${i.source} | Pubblicato: ${i.publishedAt}\n${i.url}`),"",...d.sources.map(s=>`${s.id}: ${s.stale?"non aggiornata, esclusa dal report":"disponibile"}; ricezione ${s.fetchedAt||"non disponibile"}`)].join("\n\n");
   const payload={id,payer:body.payer.toLowerCase(),receiver:c.receiver.toLowerCase(),amount_wei:CRO_PRICE_WEI,tx_data:txData,report:Buffer.from(report,"utf8").subarray(0,18000).toString("utf8"),topic:body.topic,created_at:new Date().toISOString()};
   const accessToken=seal(payload);
   return {id,accessToken,payer:body.payer,receiver:c.receiver,chainId:"0x19",priceCro:"5",value:"0x"+BigInt(CRO_PRICE_WEI).toString(16),data:txData,summary:`${topics[body.topic]}: ${items.length} bollettini, compilati il ${d.generatedAt}`,status:"pending"};
  },
  async verify(body){const o=await authorize(body);return verifyCroTransaction(o,body.txHash,rpc);},
  async resume(body){const o=await authorize(body);const result=hash.test(body.txHash||"")?await verifyCroTransaction(o,body.txHash,rpc):{status:"pending"};return {id:o.id,accessToken:body.accessToken,payer:o.payer,receiver:o.receiver,chainId:"0x19",priceCro:"5",value:"0x"+BigInt(o.amount_wei).toString(16),data:o.tx_data,status:result.status,txHash:body.txHash||null,summary:`Report ${o.topic}, ordine del ${new Date(o.created_at).toISOString()}`};},
  async report(body){const o=await authorize(body);if(!hash.test(body.txHash||"")||(await verifyCroTransaction(o,body.txHash,rpc)).status!=="paid")throw fail("Il report si sblocca dopo il pagamento verificato.",402);return {id:o.id,report:o.report,txHash:body.txHash};}
 };
}
