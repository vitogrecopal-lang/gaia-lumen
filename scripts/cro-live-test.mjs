import assert from "node:assert/strict";
// Integration checks only: no wallet, signature, funds or transaction submission.
const base="https://gaia-lumen-originale.vercel.app";
async function call(action,body){const r=await fetch(`${base}/api/cro/${action}`,{method:body?"POST":"GET",headers:body?{"content-type":"application/json"}:{},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(30000)});return {status:r.status,data:await r.json()};}
const config=await call("config");assert.equal(config.status,200);assert.equal(config.data.available,true,"checkout unavailable");assert.equal(config.data.chainId,"0x19");assert.equal(config.data.priceCro,"5");assert.equal(config.data.receiver.toLowerCase(),"0xf1aacef6ace385d960c0e1e567fad3b5509c2c53");
const order=await call("order",{payer:"0x2222222222222222222222222222222222222222",topic:"spazio"});assert.equal(order.status,200,order.data.error);assert.equal(order.data.report,undefined);assert(order.data.accessToken.startsWith("v1."));
const auth={id:order.data.id,accessToken:order.data.accessToken};assert(JSON.stringify(auth).length<16000);
const resumed=await call("resume",auth);assert.equal(resumed.status,200);assert.equal(resumed.data.id,auth.id);assert.equal(resumed.data.status,"pending");
assert.equal((await call("report",auth)).status,402,"unpaid report must remain locked");
assert.equal((await call("verify",{...auth,txHash:"invalid"})).status,400);
assert.equal((await call("resume",{...auth,accessToken:auth.accessToken.slice(0,-3)+"XYZ"})).status,403);
const html=await(await fetch(base)).text();assert(html.includes("croCheckout")&&html.includes("cro-v3"));
console.log(JSON.stringify({checkout:"available",network:config.data.network,priceCro:config.data.priceCro,encryptedInvoice:"created and recovered",unpaidReport:"denied",invalidTransaction:"rejected",tamperedInvoice:"rejected",fundsSent:false}));
