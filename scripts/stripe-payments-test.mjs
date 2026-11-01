import assert from "node:assert/strict";
import {createStripeService} from "../stripe-payments.mjs";
const env={GAIA_STRIPE_ENABLED:"true",GAIA_STRIPE_SECRET_KEY:"rk_live_mock",GAIA_STRIPE_PUBLIC_KEY:"pk_live_mock",GAIA_CRO_ORDER_KEY:"a".repeat(64)};
const data={generatedAt:new Date().toISOString(),sources:[{id:"NASA",stale:false},{id:"ESA",stale:true}],items:[{source:"NASA",category:"spazio",title:"Public bulletin",publishedAt:"2026-11-01",url:"https://www.nasa.gov/"},{source:"ESA",category:"spazio",title:"stale excluded",url:"https://www.esa.int/"}]};
const sessions=new Map();let sequence=0,networkError=false;
const request=async(url,options)=>{assert(url.startsWith("https://api.stripe.com/v1/checkout/sessions"));assert.equal(options.headers.authorization,"Bearer rk_live_mock");if(networkError)throw Error("offline");if(options.method==="POST"){const form=new URLSearchParams(options.body);assert.equal(form.get("line_items[0][price_data][unit_amount]"),"500");assert.equal(form.get("line_items[0][price_data][currency]"),"eur");assert.equal(form.get("mode"),"payment");assert.equal(form.get("ui_mode"),"embedded");assert.equal(form.get("redirect_on_completion"),"never");assert.equal(form.get("payment_method_types[0]"),"card");const id="cs_live_"+String(++sequence).padStart(20,"0");const s={id,client_secret:id+"_secret_mock",livemode:true,mode:"payment",currency:"eur",amount_total:500,client_reference_id:form.get("client_reference_id"),metadata:{gaia_invoice:form.get("metadata[gaia_invoice]"),gaia_product:"report-v1"},status:"open",payment_status:"unpaid"};sessions.set(id,s);return Response.json(s);}return Response.json(sessions.get(url.split("/").at(-1)));};
const service=()=>createStripeService({getData:async()=>data,env,request});
const svc=service();assert.equal((await svc.config()).available,true);
const order=await svc.order({topic:"spazio",amount:1,currency:"usd"});assert(!order.report);assert(order.summary.includes("1 bollettini"));assert(!order.accessToken.includes("Public bulletin"));
const auth={id:order.id,accessToken:order.accessToken,sessionId:order.sessionId};
assert.equal((await service().resume(auth)).status,"pending");
await assert.rejects(svc.report(auth),e=>e.statusCode===402);
await assert.rejects(svc.resume({...auth,accessToken:auth.accessToken.slice(0,-4)+"AAAA"}),e=>e.statusCode===403);
await assert.rejects(svc.resume({...auth,id:"different"}),e=>e.statusCode===403);
const second=await svc.order({topic:"tutti"});await assert.rejects(svc.verify({...auth,sessionId:second.sessionId}),e=>e.statusCode===403);
const paid=sessions.get(order.sessionId);paid.status="complete";paid.payment_status="paid";
assert.equal((await service().verify(auth)).status,"paid");assert((await service().report(auth)).report.includes("Public bulletin"));assert(!(await svc.report(auth)).report.includes("stale excluded"));
for(const [field,bad] of [["currency","usd"],["amount_total",499],["livemode",false],["mode","subscription"]]){const old=paid[field];paid[field]=bad;await assert.rejects(svc.report(auth),e=>e.statusCode===403);paid[field]=old;}
paid.payment_status="unpaid";await assert.rejects(svc.report(auth),e=>e.statusCode===402);paid.status="expired";assert.equal((await svc.verify(auth)).status,"expired");
await assert.rejects(svc.order({topic:"constructor"}),e=>e.statusCode===400);
networkError=true;await assert.rejects(svc.verify(auth),e=>e.statusCode===503);networkError=false;
const noData=createStripeService({getData:async()=>({...data,items:[]}),env,request});await assert.rejects(noData.order({topic:"tutti"}),e=>e.statusCode===503);
const disabled=createStripeService({getData:async()=>data,env:{...env,GAIA_STRIPE_ENABLED:"false"},request});assert.equal((await disabled.config()).available,false);await assert.rejects(disabled.order({topic:"tutti"}),e=>e.statusCode===503);
console.log("Stripe: fixed EUR price, encrypted recovery, cross-order replay denial, unpaid denial, live/mode/amount/currency binding, tamper rejection and fail-closed checks passed. No funds sent.");

