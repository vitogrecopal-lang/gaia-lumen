export const validLocation=i=>typeof i?.lon==="number"&&Number.isFinite(i.lon)&&i.lon>=-180&&i.lon<=180&&typeof i?.lat==="number"&&Number.isFinite(i.lat)&&i.lat>=-90&&i.lat<=90;
export function projectPoint(i){return validLocation(i)?{x:i.lon+180,y:90-i.lat}:null;}
export function normalizeViewport(v){
 const width=Math.max(30,Math.min(360,v.width)),height=width/2;
 return {x:((v.x+180)%360+360)%360-180,y:Math.max(0,Math.min(180-height,v.y)),width,height};
}
export function zoomViewport(v,factor,anchor={x:v.x+v.width/2,y:v.y+v.height/2}){
 const width=Math.max(30,Math.min(360,v.width*factor)),ratio=width/v.width;
 return normalizeViewport({x:anchor.x-(anchor.x-v.x)*ratio,y:anchor.y-(anchor.y-v.y)*ratio,width});
}
export function fitViewport(items){
 const points=items.filter(validLocation).map(projectPoint);if(!points.length)return {x:0,y:0,width:360,height:180};
 const xs=points.map(p=>p.x).sort((a,b)=>a-b);let gap=-1,start=xs[0];
 for(let i=0;i<xs.length;i++){const next=i===xs.length-1?xs[0]+360:xs[i+1];if(next-xs[i]>gap){gap=next-xs[i];start=next%360;}}
 const span=360-gap,ys=points.map(p=>p.y),top=Math.min(...ys),bottom=Math.max(...ys);
 const width=Math.min(360,Math.max(30,span*1.3,(bottom-top)*2.6));
 return normalizeViewport({x:start+span/2-width/2,y:(top+bottom)/2-width/4,width});
}
