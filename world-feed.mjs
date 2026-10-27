const SOURCES = [
  {id:"NASA", category:"spazio", url:"https://www.nasa.gov/feed/", format:"rss"},
  {id:"ESA", category:"spazio", url:"https://www.esa.int/rssfeed/Our_Activities/Space_Science", format:"rss"},
  {id:"WHO", category:"salute", url:"https://www.who.int/api/news/diseaseoutbreaknews?%24orderby=PublicationDateAndTime%20desc&%24top=24&%24select=Id,Title,PublicationDateAndTime,UrlName", format:"who"},
  {id:"UN", category:"geopolitica", url:"https://news.un.org/feed/subscribe/en/news/all/rss.xml", format:"rss"},
  {id:"USGS", category:"terra", url:"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson", format:"geojson"}
];
const cache = new Map();
const TTL = 5 * 60 * 1000;
function clean(s) {
  return String(s).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,"$1").replace(/<[^>]*>/g, "").replace(/&#(x[0-9a-f]+|\d+);/gi, (_,c) => { const n=c[0].toLowerCase()==="x"?parseInt(c.slice(1),16):Number(c); return n>0&&n<=0x10ffff?String.fromCodePoint(n):""; }).replace(/&(amp|lt|gt|quot|apos);/g,(_,k)=>({amp:"&",lt:"<",gt:">",quot:'"',apos:"'"})[k]).trim();
}
function tag(s,n) { return clean(s.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)</${n}>`,"i"))?.[1]||""); }
function safeUrl(s) { try { const u=new URL(s); return u.protocol==="https:"?u.href:null; } catch { return null; } }
export function parseWorldFeed(text, source) {
  if(source.format==="who") {
    const data=JSON.parse(text);if(!Array.isArray(data.value))throw new Error("Formato WHO non valido");
    return data.value.slice(0,24).flatMap(i=>{
      const time=Date.parse(i.PublicationDateAndTime),title=clean(i.Title||"").slice(0,350);
      if(!title||!Number.isFinite(time)||!/^[-a-zA-Z0-9]+$/.test(i.UrlName||""))return [];
      return [{id:`WHO:${i.Id}`,source:"WHO",category:"salute",title,url:`https://www.who.int/emergencies/disease-outbreak-news/item/${i.UrlName}`,publishedAt:new Date(time).toISOString(),lon:null,lat:null}];
    });
  }
  if(source.format==="geojson") {
    const data=JSON.parse(text);
    if(!Array.isArray(data.features)) throw new Error("Formato non valido");
    return data.features.slice(0,100).flatMap(f=>{
      const p=f.properties||{}, c=f.geometry?.coordinates, time=Number(p.time), url=safeUrl(p.url);
      if(!url||!Number.isFinite(time)||!Array.isArray(c)||!Number.isFinite(c[0])||!Number.isFinite(c[1]))return [];
      return [{id:`USGS:${f.id}`,source:"USGS",category:"terra",title:`M ${p.mag ?? "?"} - ${String(p.place||"Localita' non indicata").slice(0,250)}`,url,publishedAt:new Date(time).toISOString(),lon:c[0],lat:c[1],magnitude:p.mag}];
    });
  }
  if(!/<rss[\s>]/i.test(text))throw new Error("Formato RSS non valido");
  return [...text.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].slice(0,24).flatMap((m,i)=>{
    const title=tag(m[1],"title").slice(0,350),url=safeUrl(tag(m[1],"link")),date=Date.parse(tag(m[1],"pubDate"));
    if(!title||!url||!Number.isFinite(date))return [];
    return [{id:`${source.id}:${i}:${date}`,source:source.id,category:source.category,title,url,publishedAt:new Date(date).toISOString(),lon:null,lat:null}];
  });
}
async function loadSource(source) {
  const prior=cache.get(source.id);
  if(prior?.next>Date.now())return prior.value;
  if(prior?.pending)return prior.pending;
  const entry=prior||{};
  const pending=(async()=>{
    const attemptedAt=new Date().toISOString();
    try {
      const r=await fetch(source.url,{signal:AbortSignal.timeout(10000),headers:{accept:"application/rss+xml, application/geo+json, application/json, application/xml"}});
      if(!r.ok)throw new Error("Fonte non disponibile");
      const reader=r.body.getReader(); let size=0; const chunks=[];
      try { for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>2000000)throw new Error("Feed troppo grande");chunks.push(value);} } finally { await reader.cancel().catch(()=>{}); }
      const bytes=new Uint8Array(size);let pos=0;for(const chunk of chunks){bytes.set(chunk,pos);pos+=chunk.length;}
      const items=parseWorldFeed(new TextDecoder().decode(bytes),source);
      if(!items.length)throw new Error("Nessun dato valido");
      entry.value={id:source.id,category:source.category,url:source.url,items,fetchedAt:attemptedAt,attemptedAt,latestPublishedAt:items.map(i=>i.publishedAt).sort().at(-1),stale:false,error:null};entry.next=Date.now()+TTL;
    }catch{
      entry.value={id:source.id,category:source.category,url:source.url,items:entry.value?.items||[],fetchedAt:entry.value?.fetchedAt||null,latestPublishedAt:entry.value?.latestPublishedAt||null,attemptedAt,stale:true,error:"Fonte temporaneamente non disponibile"};entry.next=Date.now()+60000;
    }
    return entry.value;
  })();
  entry.pending=pending;cache.set(source.id,entry);
  try{return await pending;}finally{entry.pending=null;}
}
export async function getWorldDashboard(){
  const sources=await Promise.all(SOURCES.map(loadSource));
  return {generatedAt:new Date().toISOString(),refreshSeconds:300,sources,items:sources.flatMap(s=>s.items).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)),notice:"Bollettini pubblici non esaustivi. Frequenza e copertura dipendono dalle fonti; conteggi di notizie non misurano il rischio reale."};
}
