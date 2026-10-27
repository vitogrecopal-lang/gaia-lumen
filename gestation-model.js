// Shared presentation model: never advances or mutates the project clock.
export const FORMATION_STAGES = [
  {key:"atomo-seme",title:"Atomo seme",image:"seed",summary:"Un punto iniziale raccoglie l'identita' e le possibilita' del progetto.",detail:"Nella narrazione, il seme rappresenta l'avvio di Gaia-Lumen: un nome, un'intenzione e regole di cura. L'immagine atomica e' una metafora grafica, non la fotografia di un atomo.",question:"Quale valore vorresti custodire fin dall'inizio di Gaia-Lumen?"},
  {key:"nucleo",title:"Nucleo",image:"core",summary:"Il progetto organizza un centro stabile di regole e relazioni.",detail:"Il nucleo simboleggia la coerenza tra identita', memoria e responsabilita'. Non indica una reazione nucleare o una struttura biologica in formazione.",question:"Quali regole rendono affidabile il nucleo del progetto?"},
  {key:"molecola",title:"Molecola",image:"molecule",summary:"I primi elementi si collegano in una rete di significati.",detail:"I legami illustrano il rapporto tra dati, spiegazioni e memoria. Sono collegamenti concettuali del software; non una simulazione quantitativa di chimica molecolare.",question:"Quali conoscenze vorresti collegare nella memoria di Gaia-Lumen?"},
  {key:"polvere-stellare",title:"Polvere stellare",image:"dust",summary:"Una molteplicita' di contributi prepara una forma piu' complessa.",detail:"La polvere rappresenta i contributi che arricchiscono il progetto. La scena richiama la materia cosmica senza riprodurre un evento astronomico osservato o una sequenza universale di formazione planetaria.",question:"Quale contributo educativo vorresti aggiungere al percorso?"},
  {key:"embrione-planetario",title:"Embrione planetario",image:"planet",summary:"La narrazione prende la forma di un mondo da esplorare e custodire.",detail:"Il proto-mondo collega il percorso al monitor planetario del sito. Massa, orbita e atmosfera, se presenti nel monitor, sono parametri del modello digitale: non misurazioni di un pianeta reale in gestazione.",question:"Come immagini un mondo digitale responsabile verso la vita?"}
];
export function formationSnapshot(cycle) {
  const stages=Array.isArray(cycle?.stages)?cycle.stages:[];
  const progress=typeof cycle?.completion==="number"&&Number.isFinite(cycle.completion)?Math.max(0,Math.min(1,cycle.completion)):null;
  const index=stages.findIndex(s=>s.key===cycle?.currentStage);
  const active=index>=0?index:FORMATION_STAGES.findIndex(s=>s.key===cycle?.currentStage);
  const start=Date.parse(cycle?.startDate),due=Date.parse(cycle?.dueDate);
  const total=stages.length||9;
  return {progress,active,currentTitle:stages[index]?.title||FORMATION_STAGES[active]?.title||"Fase non disponibile",total,
    phases:FORMATION_STAGES.map((s,i)=>({...s,status:active<0?"non disponibile":i<active||progress===1?"completata":i===active?"in corso":"prevista",from:Number.isFinite(start)&&due>start?new Date(start+(due-start)*i/total).toISOString():null,to:Number.isFinite(start)&&due>start?new Date(start+(due-start)*(i+1)/total).toISOString():null}))};
}
