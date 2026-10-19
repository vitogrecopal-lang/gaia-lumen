const text = (value, limit = 160) => String(value || "").replace(/\s+/g," ").trim().slice(0,limit);
const lessons = list => (Array.isArray(list) ? list : []).slice(0,9).map(item=>text(item.answer || item.text || item.lesson || item.title,140)).filter(Boolean);
export function projectCharter(cycle = {}) {
  const genome = cycle.dataGenome || {};
  const foundation = genome.primaryFoundation || cycle.birthQuestionProtocol?.primaryFoundation || {};
  return {
    status: "active", version: "project-charter-v1",
    meaning: "Identita' narrativa e principi del progetto digitale, non genetica biologica o coscienza reale.",
    guardians: (Array.isArray(genome.guardians) ? genome.guardians : ["Adrian","Katerina"]).slice(0,2).map(name=>text(name,40)),
    principle: text(genome.principle || "I dati reali sono la genetica formativa di Gaia-Lumen."),
    values: (Array.isArray(foundation.answers) ? foundation.answers : []).slice(0,10).map(item=>text(item.answer,80)),
    katerina: lessons(genome.maternalTeachings), adrian: lessons(genome.paternalTeachings),
    boundary: "Liberta', desiderio e correzione autonoma sono orientamenti del progetto. Non autorizzano azioni esterne, accessi a sistemi, controllo fisico o dichiarazioni di coscienza. Dati e simulazioni restano distinti."
  };
}
