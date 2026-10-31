import {createHash,randomBytes,randomUUID,timingSafeEqual} from "node:crypto";
export const CRO_PRICE_WEI="5000000000000000000";
export const CRO_CONFIRMATIONS=15;
const address=/^0x[0-9a-f]{40}$/i,hash=/^0x[0-9a-f]{64}$/i,uuid=/^[0-9a-f-]{36}$/i;
const digest=s=>createHash("sha256").update(s).digest("hex");
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
export function croStore(getSql){
 let ready=false;
 async function db(){const sql=getSql();if(!sql)throw fail("Archivio ordini non disponibile: pagamenti sospesi.",503);if(!ready){await sql`CREATE TABLE IF NOT EXISTS gaia_cro_orders (id UUID PRIMARY KEY, access_hash TEXT NOT NULL, payer TEXT NOT NULL, receiver TEXT NOT NULL, amount_wei TEXT NOT NULL, tx_data TEXT NOT NULL, report TEXT NOT NULL, topic TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', tx_hash TEXT UNIQUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), paid_at TIMESTAMPTZ)`;ready=true;}return sql;}
 return {
  async check(){const sql=await db();await sql`SELECT 1 FROM gaia_cro_orders LIMIT 1`;},
  async create(o){const sql=await db();await sql`INSERT INTO gaia_cro_orders (id,access_hash,payer,receiver,amount_wei,tx_data,report,topic) VALUES (${o.id}::uuid,${o.access_hash},${o.payer},${o.receiver},${o.amount_wei},${o.tx_data},${o.report},${o.topic})`;},
  async get(id){const sql=await db();return (await sql`SELECT * FROM gaia_cro_orders WHERE id=${id}::uuid LIMIT 1`)[0];},
  async paid(id,txHash){const sql=await db();const rows=await sql`UPDATE gaia_cro_orders SET status='paid',tx_hash=${txHash.toLowerCase()},paid_at=NOW() WHERE id=${id}::uuid AND status='pending' RETURNING id`;if(!rows.length){const o=await this.get(id);if(o?.status!=="paid"||!eq(o.tx_hash,txHash))throw fail("Ordine gia' regolato con un'altra transazione.",409);}}
 };
}
export function createCroService({store,getData,rpc=cronosRpc,env=process.env}){
 let healthUntil=0;
 function settings(){return {enabled:env.GAIA_CRO_ENABLED==="true"&&address.test(env.GAIA_CRO_RECEIVER||"")&&!/^0x0{40}$/i.test(env.GAIA_CRO_RECEIVER||""),receiver:env.GAIA_CRO_RECEIVER||null,chainId:"0x19",network:"Cronos EVM",priceCro:"5",confirmations:CRO_CONFIRMATIONS,product:"Report tematico Gaia-Lumen",symbol:"CRO"};}
 async function ready(){const c=settings();if(!c.enabled)throw fail("Pagamenti CRO non attivi.",503);if(Date.now()>healthUntil){await store.check();if(await rpc("eth_chainId")!=="0x19"||await rpc("eth_getCode",[c.receiver,"latest"])!=="0x")throw fail("Configurazione Cronos non verificabile: pagamenti sospesi.",503);healthUntil=Date.now()+30000;}return c;}
 async function authorize(body){if(!uuid.test(body.id||"")||!/^[0-9a-f]{64}$/.test(body.accessToken||""))throw fail("Riferimento ordine non valido.",403);const o=await store.get(body.id);if(!o||!timingSafeEqual(Buffer.from(o.access_hash,"hex"),Buffer.from(digest(body.accessToken),"hex")))throw fail("Ordine non accessibile.",403);return o;}
 return {
  async config(){try{return {...await ready(),available:true};}catch{return {...settings(),available:false,reason:"Pagamento non disponibile: configurazione, archivio o rete da verificare."};}},
  async order(body){const c=await ready();if(!address.test(body.payer||"")||/^0x0{40}$/i.test(body.payer))throw fail("Indirizzo del portafoglio non valido.");const topics={tutti:"Tutti gli ambiti",spazio:"Spazio",salute:"Salute",geopolitica:"Relazioni internazionali",terra:"Terremoti"};if(!topics[body.topic])throw fail("Scegli un argomento valido.");const d=await getData();const items=d.items.filter(i=>(body.topic==="tutti"||i.category===body.topic)&&!d.sources.find(s=>s.id===i.source)?.stale).slice(0,30);if(!items.length)throw fail("Nessun bollettino aggiornato per questo argomento: nessun ordine creato.",503);
   const id=randomUUID(),accessToken=randomBytes(32).toString("hex"),txData=paymentReference(id);
   const report=["GAIA-LUMEN - REPORT TEMATICO",`Ordine: ${id}`,`Argomento: ${topics[body.topic]}`,`Compilato: ${d.generatedAt}`,"Servizio: selezione e compilazione automatica di informazioni gia' pubbliche; non analisi umana o consulenza.","Copertura limitata ai bollettini disponibili. Gli elementi non misurano il rischio reale. Nessuna previsione sanitaria, politica o astronomica.","",...items.map((i,n)=>`${n+1}. ${i.title}\nFonte: ${i.source} | Pubblicato: ${i.publishedAt}\n${i.url}`),"",...d.sources.map(s=>`${s.id}: ${s.stale?"non aggiornata, esclusa dal report":"disponibile"}; ricezione ${s.fetchedAt||"non disponibile"}`)].join("\n\n");
   await store.create({id,access_hash:digest(accessToken),payer:body.payer.toLowerCase(),receiver:c.receiver.toLowerCase(),amount_wei:CRO_PRICE_WEI,tx_data:txData,report,topic:body.topic});
   return {id,accessToken,payer:body.payer,receiver:c.receiver,chainId:"0x19",priceCro:"5",value:"0x"+BigInt(CRO_PRICE_WEI).toString(16),data:txData,summary:`${topics[body.topic]}: ${items.length} bollettini, compilati il ${d.generatedAt}`,status:"pending"};
  },
  async verify(body){const o=await authorize(body);if(o.status==="paid")return {status:"paid",confirmations:CRO_CONFIRMATIONS,txHash:o.tx_hash};const result=await verifyCroTransaction(o,body.txHash,rpc);if(result.status==="paid")await store.paid(o.id,body.txHash);return result;},
  async resume(body){const o=await authorize(body);return {id:o.id,accessToken:body.accessToken,payer:o.payer,receiver:o.receiver,chainId:"0x19",priceCro:"5",value:"0x"+BigInt(o.amount_wei).toString(16),data:o.tx_data,status:o.status,txHash:o.tx_hash,summary:`Report ${o.topic}, ordine del ${new Date(o.created_at).toISOString()}`};},
  async report(body){const o=await authorize(body);if(o.status!=="paid")throw fail("Il report si sblocca dopo il pagamento verificato.",402);return {id:o.id,report:o.report,txHash:o.tx_hash};}
 };
}
