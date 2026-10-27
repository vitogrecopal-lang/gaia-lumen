import assert from "node:assert/strict";
import {parseWorldFeed,getWorldDashboard} from "../world-feed.mjs";
const rss='<rss><channel><item><title><![CDATA[Space &amp; Earth]]></title><link>https://www.nasa.gov/example</link><pubDate>Tue, 27 Oct 2026 00:00:00 GMT</pubDate></item><item><title>Bad URL</title><link>javascript:alert(1)</link><pubDate>Tue, 27 Oct 2026 00:00:00 GMT</pubDate></item></channel></rss>';
assert.equal(parseWorldFeed(rss,{id:"NASA",category:"spazio",format:"rss"}).length,1);
assert.equal(parseWorldFeed(rss,{id:"NASA",category:"spazio",format:"rss"})[0].title,"Space & Earth");
assert.throws(()=>parseWorldFeed('<html>error</html>',{format:"rss"}));
const who=JSON.stringify({value:[{Id:"1",Title:"WHO update",PublicationDateAndTime:"2026-10-23T00:00:00Z",UrlName:"2026-DON622"}]});
assert.equal(parseWorldFeed(who,{format:"who"})[0].lon,null);
const geo=JSON.stringify({features:[{id:"1",properties:{time:1793050000000,mag:3,place:"Test",url:"https://earthquake.usgs.gov/example"},geometry:{coordinates:[13,38,10]}}]});
assert.equal(parseWorldFeed(geo,{format:"geojson"})[0].lat,38);
const realFetch=globalThis.fetch,realNow=Date.now;let time=realNow(),calls=0,fail=false;
Date.now=()=>time;
globalThis.fetch=async url=>{calls++;if(fail)throw new Error("offline");return new Response(url.includes("diseaseoutbreaknews")?who:url.includes("geojson")?geo:rss);};
try{
  const [a,b]=await Promise.all([getWorldDashboard(),getWorldDashboard()]);
  assert.equal(calls,5,"concurrent requests share source fetches");assert.equal(a.items.length,5);assert.equal(b.sources.length,5);
  await getWorldDashboard();assert.equal(calls,5,"fresh cache reused");
  time+=301000;fail=true;const stale=await getWorldDashboard();assert(stale.sources.every(s=>s.stale&&s.fetchedAt&&s.error));assert.equal(stale.items.length,5,"retain last good data on outage");
  await getWorldDashboard();assert.equal(calls,10,"failed sources retry with backoff");
}finally{globalThis.fetch=realFetch;Date.now=realNow;}
console.log("world feeds: parsing, URL safety, deduplication, cache and outage fallback ok");
