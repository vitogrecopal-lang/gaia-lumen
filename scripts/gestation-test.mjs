import assert from "node:assert/strict";
import {FORMATION_STAGES,formationSnapshot} from "../gestation-model.js";
const keys=[...FORMATION_STAGES,...["oceani-atmosfera","chimica-viva","biosfera","pianeta-cosciente"].map(key=>({key,title:key}))];
const base={stages:keys,startDate:"2026-06-12T00:00:00Z",dueDate:"2027-03-12T00:00:00Z"};
for(let i=0;i<9;i++){
  const input={...base,currentStage:keys[i].key,completion:i/9};const copy=JSON.stringify(input);const s=formationSnapshot(input);
  assert.equal(s.active,i);assert.equal(s.phases.length,5);assert.equal(JSON.stringify(input),copy,"exploration must not mutate state");
  for(let j=0;j<5;j++)assert.equal(s.phases[j].status,j<i?"completata":j===i?"in corso":"prevista");
}
const completed=formationSnapshot({...base,currentStage:keys[8].key,completion:1});assert(completed.phases.every(p=>p.status==="completata"));assert.equal(completed.progress,1);
const missing=formationSnapshot(null);assert.equal(missing.progress,null);assert.equal(missing.active,-1);assert(missing.phases.every(p=>p.status==="non disponibile"&&p.from===null));
const s=formationSnapshot({...base,currentStage:keys[0].key,completion:0});assert.equal(s.phases[0].from,"2026-06-12T00:00:00.000Z");assert.equal(s.phases[1].from,s.phases[0].to);
console.log("gestation explorer: nine-phase compatibility, five-phase status, date windows, missing data and state immutability ok");
