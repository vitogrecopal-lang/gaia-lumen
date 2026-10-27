import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {projectPoint,validLocation,fitViewport,zoomViewport,normalizeViewport} from "../world-map-model.js";
assert.deepEqual(projectPoint({lon:0,lat:0}),{x:180,y:90});
assert.deepEqual(projectPoint({lon:13.3615,lat:38.1157}),{x:193.3615,y:51.8843});
for(const p of [{lon:null,lat:null},{lon:"12",lat:38},{lon:181,lat:0},{lon:0,lat:91},{lon:NaN,lat:0}]){assert.equal(validLocation(p),false);assert.equal(projectPoint(p),null);}
const crossing=[{lon:179,lat:10},{lon:-179,lat:12}],fit=fitViewport(crossing);
assert.equal(fit.width,30,"events across the dateline fit a regional view");
function inside(v,p){const point=projectPoint(p);return [-360,0,360].some(offset=>point.x+offset>=v.x&&point.x+offset<=v.x+v.width)&&point.y>=v.y&&point.y<=v.y+v.height;}
for(const points of [crossing,[{lon:-170,lat:-70},{lon:175,lat:80}],[{lon:13,lat:38}],[{lon:180,lat:90}]]){const v=fitViewport(points);for(const p of points)assert(inside(v,p),`event outside fitted viewport: ${JSON.stringify({v,p})}`);}
let v={x:0,y:0,width:360,height:180};for(let i=0;i<30;i++)v=zoomViewport(v,.65);assert.equal(v.width,30);for(let i=0;i<30;i++)v=zoomViewport(v,1/.65);assert.equal(v.width,360);
assert.deepEqual(fitViewport([]),{x:0,y:0,width:360,height:180});assert.equal(normalizeViewport({x:750,y:-10,width:60}).y,0);
const svg=await readFile(new URL("../assets/world-natural-earth.svg",import.meta.url),"utf8"),meta=JSON.parse(await readFile(new URL("../assets/world-natural-earth-source.json",import.meta.url),"utf8"));
assert.equal(meta.features,242);assert(svg.includes("Italy")&&svg.includes("Antarctica"));assert.equal((svg.match(/<path /g)||[]).length,meta.features);assert(!svg.includes("NaN"));
console.log("world map: projection, invalid positions, dateline fitting, poles, zoom bounds and bundled geography ok");
