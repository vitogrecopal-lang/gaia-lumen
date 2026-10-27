import {writeFile} from "node:fs/promises";
import {createHash} from "node:crypto";
// Reproducible public-domain cartography; no remote service is used at runtime.
const revision="ca96624a56bd078437bca8184e78163e5039ad19";
const source=`https://raw.githubusercontent.com/nvkelso/natural-earth-vector/${revision}/geojson/ne_50m_admin_0_countries.geojson`;
const response=await fetch(source,{signal:AbortSignal.timeout(30000)});
if(!response.ok)throw new Error(`Natural Earth: HTTP ${response.status}`);
const raw=await response.text(),data=JSON.parse(raw);
if(data.type!=="FeatureCollection"||data.features.length<200)throw new Error("Invalid cartographic dataset");
const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"})[c]);
const coord=([x,y])=>`${+(x+180).toFixed(3)},${+(90-y).toFixed(3)}`;
function polygon(rings){return rings.map(r=>"M"+r.map(coord).join("L")+"Z").join("");}
const paths=data.features.map(f=>{
 const polygons=f.geometry.type==="Polygon"?[f.geometry.coordinates]:f.geometry.type==="MultiPolygon"?f.geometry.coordinates:[];
 return `<path d="${polygons.map(polygon).join("")}"><title>${escape(f.properties.ADMIN)}</title></path>`;
});
const labels=data.features.filter(f=>Number(f.properties.LABELRANK)<=5&&Number.isFinite(f.properties.LABEL_X)&&Number.isFinite(f.properties.LABEL_Y)).map(f=>`<text x="${+(f.properties.LABEL_X+180).toFixed(3)}" y="${+(90-f.properties.LABEL_Y).toFixed(3)}">${escape(f.properties.NAME_IT||f.properties.NAME)}</text>`);
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 180"><title>Natural Earth: coste e confini a scala 1:50 milioni</title><desc>Public domain. WGS84, proiezione equirettangolare. Fonte: ${source}</desc><symbol id="land" viewBox="0 0 360 180"><g fill="#345f67" stroke="#8aadb0" stroke-width=".12" fill-rule="evenodd" stroke-linejoin="round">${paths.join("")}</g></symbol><symbol id="labels" viewBox="0 0 360 180"><g fill="#e2efed" font-family="sans-serif" font-size="1.3" text-anchor="middle" paint-order="stroke" stroke="#163744" stroke-width=".3">${labels.join("")}</g></symbol></svg>`;
await writeFile(new URL("../assets/world-natural-earth.svg",import.meta.url),svg);
await writeFile(new URL("../assets/world-natural-earth-source.json",import.meta.url),JSON.stringify({provider:"Natural Earth",scale:"1:50 million",revision,source,license:"Public domain",licenseUrl:"https://www.naturalearthdata.com/about/terms-of-use/",sourceSha256:createHash("sha256").update(raw).digest("hex"),features:data.features.length,projection:"Equirectangular WGS84",precisionDegrees:0.001},null,2)+"\n");
console.log(`Generated ${data.features.length} geographic features, ${labels.length} labels, ${svg.length} bytes`);
