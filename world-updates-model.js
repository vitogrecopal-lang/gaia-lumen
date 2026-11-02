export const UPDATE_TOPICS = [
  {id:"spazio",label:"Spazio",icon:"Orbite"},
  {id:"clima",label:"Clima",icon:"Terra"},
  {id:"geopolitica",label:"Relazioni internazionali",icon:"Mondo"}
];
export function bulletinState(item,sources,now=Date.now(),offline=false) {
  const source=sources.find(s=>s.id===item.source);
  const received=Date.parse(source?.fetchedAt), published=Date.parse(item.publishedAt);
  if(offline||!source||source.stale||!Number.isFinite(received)||now-received>10*60000)return "Ricezione non aggiornata";
  if(!Number.isFinite(published)||published>now+5*60000)return "Data da verificare";
  return now-published<=86400000?"Pubblicato nelle ultime 24 ore":"Bollettino precedente";
}
export function topicBulletins(items,category) {
  const seen=new Set();
  return items.filter(i=>i.category===category).slice().sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).filter(i=>{if(seen.has(i.url))return false;seen.add(i.url);return true;}).slice(0,2);
}
export function newlyReceived(items,seen) {
  return [...new Set(items.map(i=>i.url))].filter(url=>!seen.has(url));
}
