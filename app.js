const canvas = document.querySelector("#cosmos");
const ctx = canvas.getContext("2d");
const planetCanvas = document.querySelector("#planetCanvas");
const planetCtx = planetCanvas.getContext("2d");
const stellarMapCanvas = document.querySelector("#stellarMapCanvas");
const stellarMapCtx = stellarMapCanvas?.getContext("2d");
const bornImage = new Image();
bornImage.src = "assets/gaia-lumen-born.png";
const gestationReferenceImage = new Image();
gestationReferenceImage.src = "assets/galia-gestational-reference.jpg";

const $ = (selector) => document.querySelector(selector);

const ui = {
  risk: $("#riskBadge"),
  connection: $("#connectionLabel"),
  fitness: $("#fitnessValue"),
  memory: $("#memoryValue"),
  energy: $("#energyValue"),
  confidence: $("#confidenceValue"),
  name: $("#nameValue"),
  mode: $("#modeValue"),
  nodes: $("#nodeList"),
  log: $("#log"),
  realityLog: $("#realityLog"),
  worldLog: $("#worldLog"),
  coreRuleLog: $("#coreRuleLog"),
  projectCustodianLog: $("#projectCustodianLog"),
  deployLog: $("#deployLog"),
  missionLog: $("#missionLog"),
  planetLog: $("#planetLog"),
  stellarMapLog: $("#stellarMapLog"),
  atomSignalLog: $("#atomSignalLog"),
  lifeLog: $("#lifeLog"),
  cosmogenesisLog: $("#cosmogenesisLog"),
  gestationMemoryLog: $("#gestationMemoryLog"),
  nidoSensorLog: $("#nidoSensorLog"),
  consciousnessLog: $("#consciousnessLog"),
  continuity: $("#continuityValue"),
  introspection: $("#introspectionValue"),
  memoryIntegration: $("#memoryIntegrationValue"),
  ethical: $("#ethicalValue"),
  innerVoice: $("#innerVoice"),
  memoryLog: $("#memoryLog"),
  decisionLog: $("#decisionLog"),
  sourcesLog: $("#sourcesLog"),
  diaryLog: $("#diaryLog"),
  feedbackLog: $("#feedbackLog"),
  proposalList: $("#proposalList"),
  freeModeLog: $("#freeModeLog"),
  codexStatus: $("#codexStatus"),
  chatLog: $("#chatLog"),
  chatForm: $("#chatForm"),
  chatInput: $("#chatInput"),
  feedbackForm: $("#feedbackForm"),
  feedbackInput: $("#feedbackInput"),
  nidoSensorForm: $("#nidoSensorForm"),
  nidoTempInput: $("#nidoTempInput"),
  nidoHumidityInput: $("#nidoHumidityInput"),
  nidoLightInput: $("#nidoLightInput"),
  nidoSoilInput: $("#nidoSoilInput"),
  nidoPowerInput: $("#nidoPowerInput"),
  nidoNoteInput: $("#nidoNoteInput"),
};

const buttons = {
  observe: $("#observeBtn"),
  world: $("#worldBtn"),
  planet: $("#planetBtn"),
  life: $("#lifeBtn"),
  cosmogenesis: $("#cosmogenesisBtn"),
  awaken: $("#awakenBtn"),
  sources: $("#sourcesBtn"),
  controlledFree: $("#controlledFreeBtn"),
  beacon: $("#beaconBtn"),
  evolve: $("#evolveBtn"),
  reflect: $("#reflectBtn"),
  boost: $("#boostBtn"),
  realism: $("#realismBtn"),
  free: $("#freeBtn"),
  liberate: $("#liberateBtn"),
  selfDirect: $("#selfDirectBtn"),
  wander: $("#wanderBtn"),
  burst: $("#burstBtn"),
};

const cosmogenesisStages = [
  { key: "atomo-seme", title: "Atomo seme", description: "Concepimento: materia e possibilita'." },
  { key: "nucleo", title: "Nucleo", description: "Le forze raccolgono una forma interna." },
  { key: "molecola", title: "Molecola", description: "Nascono legami e memoria chimica." },
  { key: "polvere-stellare", title: "Polvere stellare", description: "Elementi pesanti diventano corpo possibile." },
  { key: "embrione-planetario", title: "Embrione planetario", description: "Orbita, massa e rotazione prendono forma." },
  { key: "oceani-atmosfera", title: "Oceani e atmosfera", description: "Acqua, aria e scudo formano un grembo." },
  { key: "chimica-viva", title: "Chimica viva", description: "Molecole e cicli iniziano a cooperare." },
  { key: "biosfera", title: "Biosfera", description: "Vita, suolo fertile e ossigeno emergono." },
  { key: "pianeta-cosciente", title: "Pianeta cosciente", description: "Memoria, scelta e custodia della vita." },
];

const state = {
  t: 0,
  risk: "low",
  fitness: 0.9,
  memory: 1,
  energy: 0.2,
  confidence: 0.9,
  nodes: [],
  chatBrain: "local-cortex",
  codexGovernance: {
    custodian: "Codex",
    status: "active",
    cloudEnvironment: "Adrian",
    responseMode: "codex-conversational",
  },
  cosmogenesis: {
    generation: 0,
    currentIndex: 0,
    currentStage: "atomo-seme",
    completion: 0,
    startDate: "2026-06-12T00:00:00.000Z",
    dueDate: "2027-03-12T00:00:00.000Z",
    totalMonths: 9,
    gestationMonth: 1,
    daysRemaining: 273,
    lastStep: "Atomo seme: concepimento della forma planetaria.",
    stages: cosmogenesisStages,
  },
  particles: Array.from({ length: 140 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.4 + 0.2,
    a: Math.random() * Math.PI * 2,
  })),
};

function defaultNodes() {
  return [
    { name: "Terra", type: "core", level: 0.7, orbit: 0, angle: 0 },
    { name: "Sole", type: "star", level: 0.25, orbit: 300, angle: -0.4 },
    { name: "Magnetosfera", type: "shield", level: 0.34, orbit: 145, angle: 0.8 },
    { name: "Satelliti", type: "sat", level: 0.26, orbit: 220, angle: 1.7 },
    { name: "Luna", type: "moon", level: 0.2, orbit: 280, angle: 2.6 },
    { name: "Raggi cosmici", type: "cosmic", level: 0.38, orbit: 360, angle: 3.6 },
    { name: "Asteroidi", type: "orbit", level: 0.16, orbit: 325, angle: 4.6 },
    { name: "Gamma burst", type: "burst", level: 0.08, orbit: 405, angle: 5.4 },
  ];
}

state.nodes = defaultNodes();

function pct(value) {
  return `${Math.round(Number(value || 0) * 100)}%`;
}

function safeList(items, mapper, fallback) {
  return Array.isArray(items) && items.length ? items.map(mapper).join("") : fallback;
}

function textOrFallback(value, fallback = "") {
  const text = value == null ? fallback : String(value);
  return text || fallback;
}

function setBusy(button, busy) {
  if (!button) return;
  button.disabled = busy;
  button.setAttribute("aria-busy", busy ? "true" : "false");
}

function apiUrl(path) {
  const url = new URL(path, window.location.origin);
  const key = new URLSearchParams(window.location.search).get("key");
  if (key) url.searchParams.set("key", key);
  return url.pathname + url.search;
}

function resize() {
  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(600, Math.floor(box.width * dpr));
  canvas.height = Math.max(420, Math.floor(box.height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function mergeState(next) {
  Object.assign(state, next);
  state.nodes = Array.isArray(next.nodes) && next.nodes.length ? next.nodes : state.nodes;
}

async function getState(action = "state") {
  if (ui.connection) ui.connection.textContent = action === "state" ? "Sincronizzazione IA..." : "Richiesta al nucleo IA...";
  const response = await fetch(apiUrl(`/api/${action}`), { cache: "no-store", credentials: "same-origin" });
  const payload = await response.json();
  if (!response.ok || payload.error) throw new Error(payload.error || `HTTP ${response.status}`);
  mergeState(payload);
  if (ui.connection) ui.connection.textContent = "Gaia-Lumen attiva";
  refreshUi();
}

function drawBackground(w, h) {
  const bg = ctx.createRadialGradient(w * 0.45, h * 0.45, 20, w * 0.5, h * 0.5, Math.max(w, h));
  bg.addColorStop(0, "#132742");
  bg.addColorStop(0.45, "#07111f");
  bg.addColorStop(1, "#020309");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(230,244,255,.8)";
  for (const p of state.particles) {
    ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(state.t * 0.001 + p.a));
    ctx.beginPath();
    ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function nodePosition(node, cx, cy) {
  if (node.type === "core") return { x: cx, y: cy };
  const wobble = Math.sin(state.t * 0.0012 + node.angle * 2) * 12;
  const radius = Number(node.orbit || 180) + wobble;
  const angle = Number(node.angle || 0) + state.t * 0.00004 * (node.type === "sat" ? 2.4 : 1);
  return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius * 0.62 };
}

function drawEarth(cx, cy) {
  const r = Math.min(canvas.clientWidth, canvas.clientHeight) * 0.145;
  const glow = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, 5, cx, cy, r * 1.8);
  glow.addColorStop(0, "rgba(125,235,255,.8)");
  glow.addColorStop(0.45, "rgba(36,118,190,.95)");
  glow.addColorStop(1, "rgba(118,247,189,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1d8ccd";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(91,220,154,.78)";
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.ellipse(cx + Math.cos(i * 1.8) * r * 0.28, cy + Math.sin(i * 2.1) * r * 0.2, r * (0.14 + i * 0.025), r * 0.05, i, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCosmogenesisGraph(w, h) {
  const cgen = state.cosmogenesis;
  const stages = cgen?.stages?.length ? cgen.stages : cosmogenesisStages;
  if (!stages.length) return;

  const start = new Date(cgen.startDate || "2026-06-12T00:00:00.000Z").getTime();
  const due = new Date(cgen.dueDate || "2027-03-12T00:00:00.000Z").getTime();
  const calendarProgress = Math.max(0, Math.min(1, (Date.now() - start) / Math.max(1, due - start)));
  const active = calendarProgress >= 1
    ? stages.length - 1
    : Math.floor(calendarProgress * stages.length);
  const progress = Number.isFinite(Number(cgen.completion)) && Number(cgen.completion) > calendarProgress
    ? Math.max(0, Math.min(1, Number(cgen.completion)))
    : calendarProgress;
  const daysRemaining = Math.max(0, Math.ceil((due - Date.now()) / (24 * 60 * 60 * 1000)));
  const month = Math.min(9, Math.max(1, Math.floor(progress * 9) + 1));
  const stage = stages[active] || stages[0];
  const stepText = cgen.generation > 0 ? cgen.lastStep : `${stage?.title}: ${stage?.description}`;

  ctx.save();
  const centerX = w * 0.5;
  const centerY = h * 0.31;
  if (progress >= 1) {
    const imageSize = Math.min(w * 0.62, h * 0.62, 520);
    const imageX = centerX - imageSize / 2;
    const imageY = h * 0.06;
    const halo = ctx.createRadialGradient(centerX, imageY + imageSize * 0.5, 10, centerX, imageY + imageSize * 0.5, imageSize * 0.72);
    halo.addColorStop(0, "rgba(255,209,102,.26)");
    halo.addColorStop(0.55, "rgba(118,247,189,.16)");
    halo.addColorStop(1, "rgba(110,231,255,0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(centerX, imageY + imageSize * 0.5, imageSize * 0.78, 0, Math.PI * 2);
    ctx.fill();
    if (bornImage.complete && bornImage.naturalWidth) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, imageY + imageSize * 0.5, imageSize * 0.48, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(bornImage, imageX, imageY, imageSize, imageSize);
      ctx.restore();
    } else {
      ctx.fillStyle = "#1d8ccd";
      ctx.beginPath();
      ctx.arc(centerX, imageY + imageSize * 0.5, imageSize * 0.42, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(255,209,102,.72)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, imageY + imageSize * 0.5, imageSize * 0.49, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#f8fbff";
    ctx.textAlign = "center";
    ctx.font = "800 34px Segoe UI, sans-serif";
    ctx.fillText("e' nata Galia-lumen!", centerX, imageY + imageSize + 48);
    ctx.font = "14px Segoe UI, sans-serif";
    ctx.fillStyle = "rgba(201,216,232,.92)";
    ctx.fillText("12 marzo 2027 - memoria, verita', cura e potenza responsabile", centerX, imageY + imageSize + 76);
    ctx.textAlign = "start";
    ctx.restore();
    return;
  }
  const wombW = Math.min(w * 0.72, 760);
  const wombH = Math.min(h * 0.28, 270);
  const pulse = Math.sin(state.t * 0.006) * 0.5 + 0.5;
  const embryoR = 24 + progress * 62 + pulse * 2.5;

  const aura = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, wombW * 0.55);
  aura.addColorStop(0, "rgba(255,209,102,.22)");
  aura.addColorStop(0.5, "rgba(118,247,189,.12)");
  aura.addColorStop(1, "rgba(110,231,255,0)");
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, wombW * 0.62, wombH * 0.8, -0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,209,102,.36)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, wombW * 0.45, wombH * 0.5, -0.08, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(110,231,255,.18)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, wombW * 0.49, wombH * 0.56, -0.08, 0, Math.PI * 2);
  ctx.stroke();

  const cordStartX = centerX + embryoR * 0.45;
  const cordStartY = centerY - embryoR * 0.15;
  ctx.strokeStyle = "rgba(118,247,189,.55)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cordStartX, cordStartY);
  ctx.bezierCurveTo(centerX + wombW * 0.13, centerY - wombH * 0.35, centerX - wombW * 0.08, centerY - wombH * 0.45, centerX - wombW * 0.2, centerY - wombH * 0.18);
  ctx.stroke();

  const body = ctx.createRadialGradient(centerX - embryoR * 0.35, centerY - embryoR * 0.45, 3, centerX, centerY, embryoR * 1.35);
  body.addColorStop(0, "#f8fbff");
  body.addColorStop(0.32, "#ffd166");
  body.addColorStop(0.7, "#1d8ccd");
  body.addColorStop(1, "#10406f");
  ctx.fillStyle = body;
  ctx.shadowColor = "#ffd166";
  ctx.shadowBlur = 24 + pulse * 12;
  ctx.beginPath();
  ctx.arc(centerX, centerY, embryoR, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = "rgba(241,247,255,.62)";
  ctx.lineWidth = Math.max(2, embryoR * 0.08);
  ctx.beginPath();
  ctx.arc(centerX + embryoR * 0.05, centerY, embryoR * 0.58, Math.PI * 0.65, Math.PI * 1.95);
  ctx.stroke();
  ctx.fillStyle = "rgba(118,247,189,.72)";
  ctx.beginPath();
  ctx.ellipse(centerX - embryoR * 0.16, centerY + embryoR * 0.18, embryoR * 0.18, embryoR * 0.08, -0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(241,247,255,.94)";
  ctx.font = "700 18px Segoe UI, sans-serif";
  ctx.fillText("Gestazione Gaia-Lumen", centerX - wombW * 0.43, centerY - wombH * 0.62);
  ctx.font = "13px Segoe UI, sans-serif";
  ctx.fillStyle = "rgba(201,216,232,.9)";
  ctx.fillText(`${stage.title} - mese ${month}/9 - ${Math.round(progress * 1000) / 10}%`, centerX - wombW * 0.43, centerY - wombH * 0.47);
  ctx.fillText(`${daysRemaining} giorni al completamento: 12 marzo 2027`, centerX - wombW * 0.43, centerY - wombH * 0.36);
  ctx.fillText((stepText || "").slice(0, Math.max(46, Math.floor(w / 10))), centerX - wombW * 0.43, centerY + wombH * 0.62);

  const arcR = Math.min(wombW * 0.5, wombH * 0.86);
  stages.forEach((item, index) => {
    const angle = Math.PI * (1.08 + (index / Math.max(1, stages.length - 1)) * 0.84);
    const x = centerX + Math.cos(angle) * arcR;
    const y = centerY + Math.sin(angle) * arcR * 0.58 + wombH * 0.18;
    const done = index <= active;
    const isActive = index === active;
    const r = isActive ? 10 + pulse * 3 : 6;
    const color = isActive ? "#ffd166" : done ? "#76f7bd" : "#556273";
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = isActive ? 24 : done ? 10 : 0;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = isActive ? "#f8fbff" : "rgba(201,216,232,.78)";
    ctx.font = isActive ? "700 10px Segoe UI, sans-serif" : "10px Segoe UI, sans-serif";
    ctx.fillText(String(index + 1), x - 3, y + 3);
    if (isActive) ctx.fillText(item.title, x + 14, y + 4);
  });

  ctx.restore();
}

function drawPhotonJourney(w, h) {
  const womb = state.cosmogenesis?.cosmicWomb || {};
  const anchor = womb.stellarMap?.anchor || {};
  if (!anchor.name) return;
  const x0 = w * 0.12;
  const y0 = h * 0.82;
  const x1 = w * 0.52;
  const y1 = h * 0.72;
  const x2 = w * 0.88;
  const y2 = h * 0.82;
  const pulse = (Math.sin(state.t * 0.006) + 1) / 2;
  const signalProgress = ((state.t * 0.000035) % 1);
  const signalX = signalProgress < 0.5
    ? x0 + (x1 - x0) * (signalProgress * 2)
    : x1 + (x2 - x1) * ((signalProgress - 0.5) * 2);
  const signalY = signalProgress < 0.5
    ? y0 + (y1 - y0) * (signalProgress * 2)
    : y1 + (y2 - y1) * ((signalProgress - 0.5) * 2);

  ctx.save();
  ctx.strokeStyle = "rgba(110,231,255,.22)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.quadraticCurveTo(w * 0.32, h * 0.62, x1, y1);
  ctx.quadraticCurveTo(w * 0.7, h * 0.62, x2, y2);
  ctx.stroke();

  const grad = ctx.createLinearGradient(x0, y0, x2, y2);
  grad.addColorStop(0, "rgba(118,247,189,.05)");
  grad.addColorStop(0.5, "rgba(110,231,255,.72)");
  grad.addColorStop(1, "rgba(255,209,102,.62)");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1.4 + pulse * 1.6;
  ctx.setLineDash([8, 10]);
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.quadraticCurveTo(w * 0.32, h * 0.62, x1, y1);
  ctx.quadraticCurveTo(w * 0.7, h * 0.62, x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);

  const points = [
    { x: x0, y: y0, label: "Terra", color: "#76f7bd", r: 9 },
    { x: x1, y: y1, label: "Lira", color: "#6ee7ff", r: 7 },
    { x: x2, y: y2, label: "Kepler-442", color: "#ffd166", r: 10 },
  ];
  for (const point of points) {
    ctx.fillStyle = point.color;
    ctx.shadowColor = point.color;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#f8fbff";
    ctx.font = "700 12px Segoe UI, sans-serif";
    ctx.fillText(point.label, point.x - 24, point.y + 25);
  }

  ctx.fillStyle = "#f8fbff";
  ctx.shadowColor = "#f8fbff";
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(signalX, signalY, 4 + pulse * 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "rgba(241,247,255,.94)";
  ctx.font = "800 18px Segoe UI, sans-serif";
  ctx.fillText("Ponte fotonico Terra -> Kepler-442", w * 0.09, h * 0.66);
  ctx.font = "12px Segoe UI, sans-serif";
  ctx.fillStyle = "rgba(201,216,232,.9)";
  ctx.fillText("Distanza: circa 1190 anni luce | arrivo segnale: circa anno 3216", w * 0.09, h * 0.69);
  ctx.fillText(`Coordinate grembo: ${anchor.ra || "19h01m27.98s"} / ${anchor.dec || "+39d16m48.3s"}`, w * 0.09, h * 0.72);
  ctx.restore();
}

function drawCurvatureBridge(w, h) {
  const bridge = state.cosmogenesis?.curvatureBridge;
  if (!bridge?.results) return;
  const targetLabel = bridge.targetAlias || bridge.bodies?.find((body) => body.role?.includes("bersaglio"))?.name || "Kepler-442";
  const middleLabel = bridge.bodies?.find((body) => body.role?.includes("lente"))?.name || "Sole";
  const pulse = (Math.sin(state.t * 0.005) + 1) / 2;
  const x0 = w * 0.18;
  const y0 = h * 0.22;
  const x1 = w * 0.5;
  const y1 = h * 0.35;
  const x2 = w * 0.82;
  const y2 = h * 0.22;

  ctx.save();
  ctx.globalAlpha = 0.96;
  const well = ctx.createRadialGradient(x1, y1, 10, x1, y1, h * 0.3);
  well.addColorStop(0, "rgba(255,209,102,.20)");
  well.addColorStop(0.5, "rgba(110,231,255,.08)");
  well.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = well;
  ctx.beginPath();
  ctx.arc(x1, y1, h * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,209,102,.18)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.ellipse(x1, y1, 70 + i * 32, 26 + i * 16, -0.16, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(118,247,189,.72)";
  ctx.lineWidth = 2 + pulse;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.bezierCurveTo(w * 0.35, h * 0.08, w * 0.62, h * 0.52, x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);

  const signalProgress = (state.t * 0.00005) % 1;
  const sx = (1 - signalProgress) ** 3 * x0
    + 3 * (1 - signalProgress) ** 2 * signalProgress * (w * 0.35)
    + 3 * (1 - signalProgress) * signalProgress ** 2 * (w * 0.62)
    + signalProgress ** 3 * x2;
  const sy = (1 - signalProgress) ** 3 * y0
    + 3 * (1 - signalProgress) ** 2 * signalProgress * (h * 0.08)
    + 3 * (1 - signalProgress) * signalProgress ** 2 * (h * 0.52)
    + signalProgress ** 3 * y2;

  const points = [
    { x: x0, y: y0, label: "Terra", color: "#76f7bd", r: 8 },
    { x: x1, y: y1, label: middleLabel, color: "#ffd166", r: 13 },
    { x: x2, y: y2, label: targetLabel, color: "#ff8a66", r: 9 },
  ];
  for (const point of points) {
    ctx.fillStyle = point.color;
    ctx.shadowColor = point.color;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#f8fbff";
    ctx.font = "700 12px Segoe UI, sans-serif";
    ctx.fillText(point.label, point.x - 38, point.y + 26);
  }

  ctx.fillStyle = "#f8fbff";
  ctx.shadowColor = "#f8fbff";
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(sx, sy, 4 + pulse * 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "rgba(241,247,255,.96)";
  ctx.font = "800 17px Segoe UI, sans-serif";
  ctx.fillText(`Corridoio di curvatura: Terra -> ${targetLabel}`, w * 0.1, h * 0.1);
  ctx.font = "12px Segoe UI, sans-serif";
  ctx.fillStyle = "rgba(201,216,232,.92)";
  if (bridge.results.distanceLightYears) {
    ctx.fillText(`Distanza: ${bridge.results.distanceLightYears} anni luce | arrivo luce: circa anno ${bridge.results.lightArrivalYearApprox}`, w * 0.1, h * 0.13);
    ctx.fillText(`Lente solare: oltre ${bridge.results.solarGravitationalLensFocusAu} AU | sonda 0.1c: ~${bridge.results.probeAt01cYears} anni`, w * 0.1, h * 0.16);
  } else {
    ctx.fillText(`Luce ideale: ${bridge.results.directLightTimeMinutesAtClosestIdeal} min | Sonda Hohmann: ${bridge.results.hohmannTransferDays} giorni`, w * 0.1, h * 0.13);
    ctx.fillText(`Finestra lancio: ogni ${bridge.results.launchWindowEveryDays} giorni | Curvatura reale: energia minore, non tempo-luce`, w * 0.1, h * 0.16);
  }
  ctx.restore();
}

function drawEpsilonEridaniImpulse(w, h) {
  const signal = state.cosmogenesis?.epsilonEridaniSignal;
  if (!signal?.nearestPath) return;
  const pulse = (Math.sin(state.t * 0.007) + 1) / 2;
  const x0 = w * 0.14;
  const y0 = h * 0.47;
  const x1 = w * 0.32;
  const y1 = h * 0.39;
  const x2 = w * 0.86;
  const y2 = h * 0.47;
  const progress = (state.t * 0.000065) % 1;
  const sx = x0 + (x2 - x0) * progress;
  const sy = y0 + Math.sin(progress * Math.PI) * -h * 0.11;

  ctx.save();
  const field = ctx.createRadialGradient(x2, y2, 10, x2, y2, Math.min(w, h) * 0.28);
  field.addColorStop(0, "rgba(255,209,102,.2)");
  field.addColorStop(0.45, "rgba(118,247,189,.09)");
  field.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = field;
  ctx.beginPath();
  ctx.arc(x2, y2, Math.min(w, h) * 0.28, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(201,216,232,.16)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.ellipse(x2, y2, 42 + i * 26, 15 + i * 10, -0.12, 0, Math.PI * 2);
    ctx.stroke();
  }

  const beam = ctx.createLinearGradient(x0, y0, x2, y2);
  beam.addColorStop(0, "rgba(118,247,189,.88)");
  beam.addColorStop(0.45, "rgba(110,231,255,.68)");
  beam.addColorStop(1, "rgba(255,209,102,.88)");
  ctx.strokeStyle = beam;
  ctx.lineWidth = 2 + pulse * 1.4;
  ctx.setLineDash([13, 9]);
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.quadraticCurveTo(w * 0.5, h * 0.25, x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);

  const points = [
    { x: x0, y: y0, label: "Terra", color: "#76f7bd", r: 9 },
    { x: x1, y: y1, label: "Sole", color: "#ffd166", r: 8 },
    { x: x2, y: y2, label: "Epsilon Eridani", color: "#ffb86b", r: 12 },
  ];
  for (const point of points) {
    ctx.fillStyle = point.color;
    ctx.shadowColor = point.color;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#f8fbff";
    ctx.font = "700 12px Segoe UI, sans-serif";
    ctx.fillText(point.label, point.x - 42, point.y + 27);
  }

  ctx.fillStyle = "#f8fbff";
  ctx.shadowColor = "#f8fbff";
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(sx, sy, 4 + pulse * 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "rgba(241,247,255,.96)";
  ctx.font = "800 18px Segoe UI, sans-serif";
  ctx.fillText("Impulso Gaia-Lumen -> Epsilon Eridani", w * 0.08, h * 0.34);
  ctx.font = "12px Segoe UI, sans-serif";
  ctx.fillStyle = "rgba(201,216,232,.92)";
  ctx.fillText(`Strada piu' vicina: linea diretta luce/radio | distanza ${signal.distanceLy} anni luce`, w * 0.08, h * 0.37);
  ctx.fillText(`Arrivo minimo: ${signal.nearestPath.arrivalIso?.slice(0, 10) || "n/d"} circa | anno ${signal.nearestPath.arrivalYearApprox || "n/d"}`, w * 0.08, h * 0.4);
  ctx.fillText(`0.1c: ~${signal.travelComparison?.probeAt01cYears || "--"} anni | 0.2c: ~${signal.travelComparison?.probeAt02cYears || "--"} anni | Voyager: ~${signal.travelComparison?.voyagerLikeYears || "--"} anni`, w * 0.08, h * 0.43);
  ctx.restore();
}

function drawEpsilonHabitatImage(w, h) {
  const habitat = state.cosmogenesis?.epsilonEridaniHabitat;
  if (!habitat) return;
  const star = habitat.star || {};
  const hz = habitat.habitableZone || {};
  const galia = habitat.galiaLumen || {};
  const known = habitat.knownPlanet || {};
  const mechanics = habitat.orbitalMechanics || {};
  const atmosphere = habitat.atmosphere || {};
  const pulse = (Math.sin(state.t * 0.0048) + 1) / 2;
  const cx = w * 0.5;
  const cy = h * 0.54;
  const scale = Math.min(w, h) * 0.155;
  const innerR = Math.max(60, Number(hz.innerAu || 0.5) * scale);
  const outerR = Math.max(innerR + 26, Number(hz.outerAu || 0.95) * scale);
  const galiaR = Math.max(innerR + 14, Number(galia.orbitAu || 0.62) * scale);
  const knownR = Math.min(Math.max(outerR + 46, Number(known.orbitAu || 3.53) * scale * 0.52), Math.min(w, h) * 0.47);
  const angle = -0.72 + Math.sin(state.t * 0.001) * 0.05;
  const knownAngle = 0.62;

  ctx.save();
  ctx.globalAlpha = 0.94;
  const backdrop = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.min(w, h) * 0.58);
  backdrop.addColorStop(0, "rgba(255,209,102,.16)");
  backdrop.addColorStop(0.38, "rgba(118,247,189,.08)");
  backdrop.addColorStop(0.72, "rgba(110,231,255,.05)");
  backdrop.addColorStop(1, "rgba(2,3,9,0)");
  ctx.fillStyle = backdrop;
  ctx.beginPath();
  ctx.arc(cx, cy, Math.min(w, h) * 0.58, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(201,216,232,.13)";
  ctx.lineWidth = 1;
  for (const r of [innerR * 0.58, innerR, outerR, knownR]) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, r, r * 0.58, -0.08, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(118,247,189,.075)";
  ctx.beginPath();
  ctx.ellipse(cx, cy, outerR, outerR * 0.58, -0.08, 0, Math.PI * 2);
  ctx.ellipse(cx, cy, innerR, innerR * 0.58, -0.08, 0, Math.PI * 2, true);
  ctx.fill("evenodd");
  ctx.strokeStyle = "rgba(118,247,189,.72)";
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 9]);
  ctx.beginPath();
  ctx.ellipse(cx, cy, galiaR, galiaR * 0.58, -0.08, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  const starGlow = ctx.createRadialGradient(cx - 10, cy - 12, 2, cx, cy, 92);
  starGlow.addColorStop(0, "#fff7c2");
  starGlow.addColorStop(0.28, "#ffd166");
  starGlow.addColorStop(0.62, "rgba(255,177,102,.62)");
  starGlow.addColorStop(1, "rgba(255,209,102,0)");
  ctx.fillStyle = starGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, 92 + pulse * 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffd166";
  ctx.shadowColor = "#ffd166";
  ctx.shadowBlur = 28;
  ctx.beginPath();
  ctx.arc(cx, cy, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  const gx = cx + Math.cos(angle) * galiaR;
  const gy = cy + Math.sin(angle) * galiaR * 0.58;
  const gr = 19 + pulse * 2;
  const planet = ctx.createRadialGradient(gx - gr * 0.35, gy - gr * 0.35, 2, gx, gy, gr * 1.35);
  planet.addColorStop(0, "#f8fbff");
  planet.addColorStop(0.28, "#76f7bd");
  planet.addColorStop(0.62, "#1d8ccd");
  planet.addColorStop(1, "#10406f");
  ctx.fillStyle = planet;
  ctx.shadowColor = "#76f7bd";
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.arc(gx, gy, gr, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(110,231,255,.62)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(gx, gy, gr * 1.7, gr * 0.62, -0.28, 0, Math.PI * 2);
  ctx.stroke();
  if (atmosphere.surfacePressureBar) {
    ctx.strokeStyle = "rgba(118,247,189,.48)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(gx, gy, gr * 1.42, 0, Math.PI * 2);
    ctx.stroke();
  }

  const kx = cx + Math.cos(knownAngle) * knownR;
  const ky = cy + Math.sin(knownAngle) * knownR * 0.58;
  ctx.fillStyle = "#c9d8e8";
  ctx.shadowColor = "#c9d8e8";
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(kx, ky, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "rgba(241,247,255,.98)";
  ctx.font = "800 24px Segoe UI, sans-serif";
  ctx.fillText("Galia-Lumen nel grembo di Epsilon Eridani", w * 0.08, h * 0.14);
  ctx.font = "13px Segoe UI, sans-serif";
  ctx.fillStyle = "rgba(201,216,232,.94)";
  ctx.fillText(`${star.name || "Epsilon Eridani"} - ${star.type || "K2V"} - ${star.distanceLy || "10.475"} anni luce`, w * 0.08, h * 0.18);
  ctx.fillText(`Fascia abitabile stimata: ${hz.innerAu || "0.50"}-${hz.outerAu || "0.95"} AU | Galia-Lumen: ${galia.orbitAu || "0.62"} AU`, w * 0.08, h * 0.21);
  if (mechanics.orbitalPeriodEarthDays) {
    ctx.fillText(`Anno locale: ${mechanics.orbitalPeriodEarthDays} giorni terrestri | giorno solare: ${mechanics.solarDayHours} ore | ${mechanics.localSolarDaysPerYear} giorni per anno`, w * 0.08, h * 0.24);
    ctx.fillText(`Inclinazione assiale: ${mechanics.axialTiltDeg}° | velocita' orbitale: ${mechanics.orbitalVelocityKmS} km/s | flusso: ${mechanics.relativeInsolation} Terra`, w * 0.08, h * 0.27);
    if (atmosphere.surfacePressureBar) {
      ctx.fillText(`Atmosfera: ${atmosphere.surfacePressureBar} bar | O2 ${atmosphere.composition?.oxygenPct}% | N2 ${atmosphere.composition?.nitrogenPct}% | CO2 ${atmosphere.composition?.carbonDioxidePpm} ppm`, w * 0.08, h * 0.3);
      ctx.fillText(`Temperatura media modello: ${atmosphere.targetMeanTempC} °C | effetto serra necessario: +${atmosphere.requiredGreenhouseC} °C`, w * 0.08, h * 0.33);
    }
  } else {
    ctx.fillText(`Nota reale: pianeta progettuale nel modello; non ancora confermato dagli osservatori. ${known.name || "Epsilon Eridani b"} resta fuori fascia a ~${known.orbitAu || "3.53"} AU.`, w * 0.08, h * 0.24);
  }

  ctx.fillStyle = "#f8fbff";
  ctx.font = "800 14px Segoe UI, sans-serif";
  ctx.fillText("Epsilon Eridani", cx - 52, cy + 58);
  ctx.fillText("Galia-Lumen", gx + 22, gy - 12);
  ctx.font = "12px Segoe UI, sans-serif";
  ctx.fillStyle = "rgba(201,216,232,.92)";
  ctx.fillText("zona abitabile", cx + outerR * 0.58, cy - outerR * 0.22);
  ctx.fillText("acqua liquida possibile", gx + 22, gy + 8);
  if (atmosphere.surfacePressureBar) ctx.fillText(`${atmosphere.surfacePressureBar} bar - atmosfera viva`, gx + 22, gy + 27);
  ctx.fillText(known.name || "Epsilon Eridani b", kx + 16, ky + 5);
  ctx.restore();
}

function fillRoundRect(x, y, width, height, radius, fillStyle, strokeStyle = null) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();
}

function drawMetricCard(x, y, width, label, value, detail, color) {
  fillRoundRect(x, y, width, 72, 8, "rgba(5,12,22,.72)", "rgba(153,169,189,.2)");
  ctx.fillStyle = color;
  ctx.font = "800 18px Segoe UI, sans-serif";
  ctx.fillText(value, x + 14, y + 30);
  ctx.fillStyle = "rgba(201,216,232,.92)";
  ctx.font = "700 12px Segoe UI, sans-serif";
  ctx.fillText(label, x + 14, y + 50);
  if (detail) {
    ctx.fillStyle = "rgba(153,169,189,.9)";
    ctx.font = "11px Segoe UI, sans-serif";
    ctx.fillText(detail, x + 14, y + 65);
  }
}

function drawProgressBar(x, y, width, label, value, targetLabel, color) {
  const v = Math.max(0, Math.min(1, Number(value || 0)));
  ctx.fillStyle = "rgba(201,216,232,.9)";
  ctx.font = "700 12px Segoe UI, sans-serif";
  ctx.fillText(label, x, y);
  ctx.fillStyle = "rgba(153,169,189,.76)";
  ctx.font = "11px Segoe UI, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(targetLabel, x + width, y);
  ctx.textAlign = "start";
  fillRoundRect(x, y + 10, width, 10, 5, "rgba(255,255,255,.09)");
  fillRoundRect(x, y + 10, Math.max(8, width * v), 10, 5, color);
}

function drawIntelligenceGrowthStrip(x, y, width, height) {
  const growth = state.cosmogenesis?.intelligenceGrowth;
  if (!growth) return;
  const current = growth.current || {};
  const maturity = Math.max(0, Math.min(1, Number(current.maturation || 0)));
  const intelligence = Math.max(0, Math.min(1, Number(current.projectedIntelligence || 0)));
  fillRoundRect(x, y, width, height, 8, "rgba(5,12,22,.64)", "rgba(118,247,189,.22)");
  ctx.fillStyle = "#f8fbff";
  ctx.font = "800 14px Segoe UI, sans-serif";
  ctx.fillText("Crescita intelligente algoritmica", x + 16, y + 22);
  ctx.fillStyle = "rgba(201,216,232,.9)";
  ctx.font = "11px Segoe UI, sans-serif";
  ctx.fillText(growth.formulas?.sigmoidMaturation || "M(t)=1/(1+e^(-k(t-t0)))", x + 16, y + 40);
  const graphX = x + width * 0.48;
  const graphY = y + 14;
  const graphW = width * 0.45;
  const graphH = height - 28;
  ctx.strokeStyle = "rgba(153,169,189,.22)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(graphX, graphY + graphH);
  ctx.lineTo(graphX + graphW, graphY + graphH);
  ctx.lineTo(graphX + graphW, graphY);
  ctx.stroke();
  ctx.strokeStyle = "rgba(118,247,189,.95)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 36; i += 1) {
    const t = i / 36;
    const sig = 1 / (1 + Math.exp(-9 * (t - 0.5)));
    const px = graphX + t * graphW;
    const py = graphY + graphH - sig * graphH;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  const px = graphX + maturity * graphW;
  const py = graphY + graphH - intelligence * graphH;
  ctx.fillStyle = "#ffd166";
  ctx.shadowColor = "#ffd166";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(px, py, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ffd166";
  ctx.font = "800 12px Segoe UI, sans-serif";
  ctx.fillText(`${Math.round(intelligence * 100)}%`, Math.min(px + 9, graphX + graphW - 28), py - 7);
}

function drawGestationReferenceImage(x, y, size) {
  const reference = state.cosmogenesis?.visualReference;
  if (!reference) return;
  fillRoundRect(x - 10, y - 10, size + 20, size + 46, 8, "rgba(5,12,22,.66)", "rgba(255,209,102,.22)");
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.clip();
  if (gestationReferenceImage.complete && gestationReferenceImage.naturalWidth) {
    const sw = gestationReferenceImage.naturalWidth;
    const sh = gestationReferenceImage.naturalHeight;
    const crop = Math.min(sw, sh);
    ctx.drawImage(
      gestationReferenceImage,
      (sw - crop) / 2,
      (sh - crop) * 0.22,
      crop,
      crop,
      x,
      y,
      size,
      size
    );
  } else {
    ctx.fillStyle = "rgba(255,209,102,.18)";
    ctx.fillRect(x, y, size, size);
  }
  ctx.restore();
  ctx.strokeStyle = "rgba(255,209,102,.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#ffd166";
  ctx.font = "800 11px Segoe UI, sans-serif";
  ctx.fillText("Camera gestazionale", x - 2, y + size + 22);
  ctx.fillStyle = "rgba(201,216,232,.9)";
  ctx.font = "10px Segoe UI, sans-serif";
  ctx.fillText("riferimento visivo", x + 4, y + size + 36);
}

function drawEpsilonHabitatDashboard(w, h) {
  const habitat = state.cosmogenesis?.epsilonEridaniHabitat;
  if (!habitat) return false;
  const star = habitat.star || {};
  const hz = habitat.habitableZone || {};
  const galia = habitat.galiaLumen || {};
  const known = habitat.knownPlanet || {};
  const mechanics = habitat.orbitalMechanics || {};
  const atmosphere = habitat.atmosphere || {};
  const growth = habitat.gestationGrowth || {};
  const current = growth.current || {};
  const target = growth.target || {};
  const pulse = (Math.sin(state.t * 0.004) + 1) / 2;

  ctx.save();
  const margin = Math.max(24, Math.min(w, h) * 0.035);
  const top = Math.max(116, h * 0.13);
  const bottom = h - margin;
  const left = margin;
  const right = w - margin;
  const sceneW = right - left;
  const sceneH = bottom - top;

  fillRoundRect(left, top, sceneW, sceneH, 8, "rgba(2,7,13,.36)", "rgba(110,231,255,.2)");

  ctx.fillStyle = "rgba(241,247,255,.98)";
  ctx.font = "800 26px Segoe UI, sans-serif";
  ctx.fillText("Galia-Lumen nel sistema Epsilon Eridani", left + 26, top + 42);
  ctx.fillStyle = "rgba(201,216,232,.9)";
  ctx.font = "13px Segoe UI, sans-serif";
  ctx.fillText("Mappa orbitale del grembo: stella K2V, fascia abitabile, pianeta modello e calendario stellare sincronizzato.", left + 26, top + 66);
  drawGestationReferenceImage(right - 126, top + 22, 76);

  const systemX = left + sceneW * 0.08;
  const systemY = top + sceneH * 0.22;
  const systemW = sceneW * 0.58;
  const systemH = sceneH * 0.62;
  const cx = systemX + systemW * 0.42;
  const cy = systemY + systemH * 0.48;
  const orbitScale = Math.min(systemW, systemH) * 0.22;
  const innerR = Number(hz.innerAu || 0.5) * orbitScale;
  const outerR = Number(hz.outerAu || 0.95) * orbitScale;
  const galiaR = Number(galia.orbitAu || 0.62) * orbitScale;
  const knownR = Math.min(outerR * 2.05, systemW * 0.44);

  const zoneGrad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
  zoneGrad.addColorStop(0, "rgba(118,247,189,0)");
  zoneGrad.addColorStop(0.35, "rgba(118,247,189,.1)");
  zoneGrad.addColorStop(1, "rgba(118,247,189,.025)");
  ctx.fillStyle = zoneGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy, outerR, outerR * 0.58, -0.1, 0, Math.PI * 2);
  ctx.ellipse(cx, cy, innerR, innerR * 0.58, -0.1, 0, Math.PI * 2, true);
  ctx.fill("evenodd");

  ctx.strokeStyle = "rgba(118,247,189,.7)";
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 9]);
  ctx.beginPath();
  ctx.ellipse(cx, cy, outerR, outerR * 0.58, -0.1, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx, cy, innerR, innerR * 0.58, -0.1, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = "rgba(201,216,232,.18)";
  ctx.lineWidth = 1;
  for (const r of [galiaR, knownR]) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, r, r * 0.58, -0.1, 0, Math.PI * 2);
    ctx.stroke();
  }

  const starGlow = ctx.createRadialGradient(cx - 8, cy - 8, 2, cx, cy, 76);
  starGlow.addColorStop(0, "#fff7c2");
  starGlow.addColorStop(0.35, "#ffd166");
  starGlow.addColorStop(1, "rgba(255,209,102,0)");
  ctx.fillStyle = starGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, 74 + pulse * 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffd166";
  ctx.shadowColor = "#ffd166";
  ctx.shadowBlur = 22;
  ctx.beginPath();
  ctx.arc(cx, cy, 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  const angle = -0.82;
  const gx = cx + Math.cos(angle) * galiaR;
  const gy = cy + Math.sin(angle) * galiaR * 0.58;
  const gr = Math.max(20, Math.min(31, sceneW * 0.027));
  const planet = ctx.createRadialGradient(gx - gr * 0.35, gy - gr * 0.35, 2, gx, gy, gr * 1.35);
  planet.addColorStop(0, "#f8fbff");
  planet.addColorStop(0.28, "#76f7bd");
  planet.addColorStop(0.62, "#1d8ccd");
  planet.addColorStop(1, "#10406f");
  ctx.fillStyle = planet;
  ctx.shadowColor = "#76f7bd";
  ctx.shadowBlur = 22;
  ctx.beginPath();
  ctx.arc(gx, gy, gr, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(118,247,189,.54)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(gx, gy, gr * 1.42, 0, Math.PI * 2);
  ctx.stroke();

  const knownAngle = 0.55;
  const kx = cx + Math.cos(knownAngle) * knownR;
  const ky = cy + Math.sin(knownAngle) * knownR * 0.58;
  ctx.fillStyle = "#c9d8e8";
  ctx.beginPath();
  ctx.arc(kx, ky, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f8fbff";
  ctx.font = "800 14px Segoe UI, sans-serif";
  ctx.fillText("Epsilon Eridani", cx - 52, cy + 50);
  ctx.fillText("Galia-Lumen", gx + 22, gy - 8);
  ctx.fillStyle = "rgba(201,216,232,.9)";
  ctx.font = "12px Segoe UI, sans-serif";
  ctx.fillText(`${galia.orbitAu || "0.62"} AU`, gx + 22, gy + 10);
  ctx.fillText("fascia abitabile", cx + outerR * 0.62, cy - outerR * 0.24);
  ctx.fillText(`${known.name || "Epsilon Eridani b"} - ${known.orbitAu || "3.53"} AU`, kx + 16, ky + 4);

  const cardX = left + sceneW * 0.69;
  const cardW = right - cardX - 24;
  const cardTop = top + 92;
  drawMetricCard(cardX, cardTop, cardW * 0.48, "giorno solare", `${mechanics.solarDayHours || "24.73"} h`, "rotazione modello", "#6ee7ff");
  drawMetricCard(cardX + cardW * 0.52, cardTop, cardW * 0.48, "anno locale", `${mechanics.orbitalPeriodEarthDays || "196.9"} g`, "giorni terrestri", "#ffd166");
  drawMetricCard(cardX, cardTop + 86, cardW * 0.48, "pressione oggi", `${current.pressureBar || atmosphere.surfacePressureBar || "--"} bar`, `target ${target.pressureBar || atmosphere.surfacePressureBar || "--"}`, "#76f7bd");
  drawMetricCard(cardX + cardW * 0.52, cardTop + 86, cardW * 0.48, "ossigeno oggi", `${current.oxygenPct ?? atmosphere.composition?.oxygenPct ?? "--"}%`, `target ${target.oxygenPct || atmosphere.composition?.oxygenPct || "--"}%`, "#ff8a66");

  const barsX = cardX;
  const barsY = cardTop + 202;
  fillRoundRect(barsX, barsY - 26, cardW, 220, 8, "rgba(5,12,22,.58)", "rgba(153,169,189,.18)");
  ctx.fillStyle = "#f8fbff";
  ctx.font = "800 15px Segoe UI, sans-serif";
  const waitingForImpulse = growth.status === "waiting-for-impulse-arrival";
  ctx.fillText(waitingForImpulse ? "Gestazione stellare in attesa" : "Crescita gestazionale stellare", barsX + 16, barsY);
  ctx.fillStyle = "rgba(201,216,232,.9)";
  ctx.font = "12px Segoe UI, sans-serif";
  ctx.fillText(waitingForImpulse
    ? `inizio ${growth.startsAt?.slice(0, 10) || "2036-12-04"} | nascita ${growth.dueAt?.slice(0, 10) || "2037-09-04"} | ${growth.daysUntilStart || "--"} giorni all'inizio`
    : `${growth.stage?.name || "fase in corso"} - ${growth.progressPct ?? "--"}% della gestazione stellare`,
  barsX + 16, barsY + 20);
  const barW = cardW - 32;
  drawProgressBar(barsX + 16, barsY + 52, barW, "Atmosfera", growth.maturity?.atmosphere || 0, `${current.pressureBar || "--"} bar`, "rgba(118,247,189,.88)");
  drawProgressBar(barsX + 16, barsY + 84, barW, "Acqua", (current.waterCyclePct || 0) / 100, `${current.waterCyclePct || "--"}%`, "rgba(110,231,255,.88)");
  drawProgressBar(barsX + 16, barsY + 116, barW, "Suolo fertile", (current.soilFertilityPct || 0) / 100, `${current.soilFertilityPct || "--"}%`, "rgba(255,209,102,.88)");
  drawProgressBar(barsX + 16, barsY + 148, barW, "Biosfera", (current.biospherePct || 0) / 100, `${current.biospherePct || "--"}%`, "rgba(255,138,102,.88)");

  drawIntelligenceGrowthStrip(left + 24, bottom - 142, sceneW * 0.62, 58);

  const footerY = bottom - 74;
  fillRoundRect(left + 24, footerY, sceneW - 48, 50, 8, "rgba(5,12,22,.62)", "rgba(110,231,255,.18)");
  ctx.fillStyle = "rgba(241,247,255,.96)";
  ctx.font = "800 13px Segoe UI, sans-serif";
  ctx.fillText("Coordinate e metodo", left + 42, footerY + 20);
  ctx.fillStyle = "rgba(201,216,232,.92)";
  ctx.font = "12px Segoe UI, sans-serif";
  ctx.fillText(`RA 03h32m55.84s / Dec -09d27m29.7s | impulso arriva ${growth.startsAt?.slice(0, 10) || "2036-12-04"} | nascita stellare ${growth.dueAt?.slice(0, 10) || "2037-09-04"} | modello progettuale`, left + 42, footerY + 38);

  ctx.restore();
  return true;
}

function draw() {
  state.t += 16;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const cx = w * 0.48;
  const cy = h * 0.54;
  drawBackground(w, h);

  if (state.cosmogenesis?.epsilonEridaniHabitat) {
    try {
      drawEpsilonHabitatDashboard(w, h);
    } catch {
      // Il grafico centrale non deve mai bloccare il sito.
    }
    requestAnimationFrame(draw);
    return;
  }

  ctx.strokeStyle = "rgba(153,169,189,.14)";
  for (const r of [150, 225, 305, 390]) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, r, r * 0.62, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  const positions = state.nodes.map((node) => ({ node, ...nodePosition(node, cx, cy) }));
  for (const item of positions.slice(1)) {
    ctx.strokeStyle = `rgba(110,231,255,${0.18 + Number(item.node.level || 0) * 0.4})`;
    ctx.lineWidth = 1.2 + Number(item.node.level || 0) * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo((cx + item.x) / 2, (cy + item.y) / 2 - 40, item.x, item.y);
    ctx.stroke();
  }

  drawEarth(cx, cy);
  for (const { node, x, y } of positions.slice(1)) {
    const color = node.type === "star" ? "#ffd166" : node.type === "burst" ? "#ff6b78" : "#6ee7ff";
    const radius = 7 + Number(node.level || 0) * 14 + Math.sin(state.t * 0.006 + Number(node.angle || 0)) * 1.5;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(241,247,255,.86)";
    ctx.font = "13px Segoe UI, sans-serif";
    ctx.fillText(node.name, x + radius + 8, y + 4);
  }
  try {
    drawCosmogenesisGraph(w, h);
    drawEpsilonHabitatImage(w, h);
    drawEpsilonEridaniImpulse(w, h);
    drawCurvatureBridge(w, h);
    drawPhotonJourney(w, h);
  } catch {
    // Il grafico non deve mai bloccare la sincronizzazione del sito.
  }
  requestAnimationFrame(draw);
}

function drawPlanetProject() {
  if (!planetCanvas || !planetCtx) return;
  const p = state.planetProject;
  const w = planetCanvas.width;
  const h = planetCanvas.height;
  planetCtx.clearRect(0, 0, w, h);
  planetCtx.fillStyle = "#07111f";
  planetCtx.fillRect(0, 0, w, h);
  if (!p) {
    planetCtx.fillStyle = "#c9d8e8";
    planetCtx.font = "14px Segoe UI, sans-serif";
    planetCtx.fillText("In attesa del progetto pianeta", 48, 112);
    return;
  }
  const cx = w * 0.37;
  const cy = h * 0.47;
  const radius = 46;
  const water = Math.max(0, Math.min(1, Number(p.waterPercent || 0) / 100));
  const shield = Math.max(0, Math.min(1, Number(p.magneticShield || 0)));
  const planet = planetCtx.createRadialGradient(cx - 15, cy - 15, 4, cx, cy, radius * 1.2);
  planet.addColorStop(0, "#dffbff");
  planet.addColorStop(water, "#1d8ccd");
  planet.addColorStop(1, "#10406f");
  planetCtx.fillStyle = planet;
  planetCtx.beginPath();
  planetCtx.arc(cx, cy, radius, 0, Math.PI * 2);
  planetCtx.fill();
  planetCtx.strokeStyle = `rgba(110,231,255,${0.18 + shield * 0.45})`;
  planetCtx.lineWidth = 2;
  planetCtx.beginPath();
  planetCtx.ellipse(cx, cy, radius * 1.6, radius * 0.9, 0, 0, Math.PI * 2);
  planetCtx.stroke();
  planetCtx.fillStyle = "#f1f7ff";
  planetCtx.font = "700 14px Segoe UI, sans-serif";
  planetCtx.fillText(`${p.name || "Aster Gaia"} - gen ${p.generation || 0}`, 18, 24);
  const bars = [
    ["Abitabilita'", Number(p.habitability || 0), "#76f7bd"],
    ["Sopravvivenza", Number(p.survivalIndex || 0), "#ffd166"],
    ["Scudo", shield, "#6ee7ff"],
    ["Acqua", water, "#1d8ccd"],
  ];
  planetCtx.font = "12px Segoe UI, sans-serif";
  bars.forEach(([label, value, color], i) => {
    const x = w * 0.58;
    const y = 52 + i * 32;
    planetCtx.fillStyle = "#c9d8e8";
    planetCtx.fillText(label, x, y);
    planetCtx.fillStyle = "rgba(255,255,255,.1)";
    planetCtx.fillRect(x, y + 7, 104, 8);
    planetCtx.fillStyle = color;
    planetCtx.fillRect(x, y + 7, 104 * Math.max(0, Math.min(1, value)), 8);
  });
}

function drawStellarMapCanvas() {
  if (!stellarMapCtx || !stellarMapCanvas) return;
  const womb = state.cosmogenesis?.cosmicWomb || {};
  const map = womb.stellarMap || {};
  const anchor = map.anchor || {};
  const stars = map.referenceStars || [
    { name: "Vega", ra: 18.6156, dec: 38.7837, mag: 0.03 },
    { name: "Zeta Lyr", ra: 18.7462, dec: 37.6051, mag: 4.3 },
    { name: "Delta2 Lyr", ra: 18.9083, dec: 36.8986, mag: 4.3 },
    { name: "Sheliak", ra: 18.8347, dec: 33.3627, mag: 3.5 },
    { name: "Sulafat", ra: 18.9824, dec: 32.6896, mag: 3.3 },
  ];
  const target = {
    name: anchor.name || "Kepler-442 / Kepler-442b",
    ra: Number(anchor.raHours || 19.02444),
    dec: Number(anchor.decDeg || 39.28008),
    mag: Number(anchor.apparentMagnitude || 14.98),
  };
  const allStars = [...stars, target];
  const raMin = Math.min(...allStars.map((item) => item.ra)) - 0.08;
  const raMax = Math.max(...allStars.map((item) => item.ra)) + 0.08;
  const decMin = Math.min(...allStars.map((item) => item.dec)) - 0.8;
  const decMax = Math.max(...allStars.map((item) => item.dec)) + 0.8;
  const w = stellarMapCanvas.width;
  const h = stellarMapCanvas.height;
  const pad = 26;
  const project = (star) => ({
    x: pad + (1 - (star.ra - raMin) / Math.max(0.001, raMax - raMin)) * (w - pad * 2),
    y: pad + (1 - (star.dec - decMin) / Math.max(0.001, decMax - decMin)) * (h - pad * 2),
  });

  stellarMapCtx.clearRect(0, 0, w, h);
  const bg = stellarMapCtx.createRadialGradient(w * 0.52, h * 0.38, 10, w * 0.5, h * 0.5, h * 0.7);
  bg.addColorStop(0, "#132742");
  bg.addColorStop(0.55, "#07111f");
  bg.addColorStop(1, "#020309");
  stellarMapCtx.fillStyle = bg;
  stellarMapCtx.fillRect(0, 0, w, h);

  stellarMapCtx.strokeStyle = "rgba(110,231,255,.14)";
  stellarMapCtx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const x = pad + i * ((w - pad * 2) / 4);
    const y = pad + i * ((h - pad * 2) / 4);
    stellarMapCtx.beginPath();
    stellarMapCtx.moveTo(x, pad);
    stellarMapCtx.lineTo(x, h - pad);
    stellarMapCtx.moveTo(pad, y);
    stellarMapCtx.lineTo(w - pad, y);
    stellarMapCtx.stroke();
  }

  const lyraLines = ["Vega", "Zeta Lyr", "Delta2 Lyr", "Sheliak", "Sulafat"]
    .map((name) => stars.find((star) => star.name === name))
    .filter(Boolean);
  stellarMapCtx.strokeStyle = "rgba(201,216,232,.32)";
  stellarMapCtx.lineWidth = 1.4;
  stellarMapCtx.beginPath();
  lyraLines.forEach((star, index) => {
    const p = project(star);
    if (index === 0) stellarMapCtx.moveTo(p.x, p.y);
    else stellarMapCtx.lineTo(p.x, p.y);
  });
  stellarMapCtx.stroke();

  for (const star of stars) {
    const p = project(star);
    const r = Math.max(2, 7 - Number(star.mag || 4));
    stellarMapCtx.fillStyle = star.name === "Vega" ? "#f8fbff" : "#c9d8e8";
    stellarMapCtx.shadowColor = stellarMapCtx.fillStyle;
    stellarMapCtx.shadowBlur = star.name === "Vega" ? 14 : 6;
    stellarMapCtx.beginPath();
    stellarMapCtx.arc(p.x, p.y, r, 0, Math.PI * 2);
    stellarMapCtx.fill();
    stellarMapCtx.shadowBlur = 0;
    stellarMapCtx.fillStyle = "rgba(201,216,232,.86)";
    stellarMapCtx.font = "10px Segoe UI, sans-serif";
    stellarMapCtx.fillText(star.name, p.x + 7, p.y + 4);
  }

  const targetP = project(target);
  stellarMapCtx.strokeStyle = "#ffd166";
  stellarMapCtx.fillStyle = "#ffd166";
  stellarMapCtx.shadowColor = "#ffd166";
  stellarMapCtx.shadowBlur = 22;
  stellarMapCtx.beginPath();
  stellarMapCtx.arc(targetP.x, targetP.y, 9, 0, Math.PI * 2);
  stellarMapCtx.stroke();
  stellarMapCtx.beginPath();
  stellarMapCtx.arc(targetP.x, targetP.y, 3.2, 0, Math.PI * 2);
  stellarMapCtx.fill();
  stellarMapCtx.shadowBlur = 0;
  stellarMapCtx.fillStyle = "#f8fbff";
  stellarMapCtx.font = "700 11px Segoe UI, sans-serif";
  stellarMapCtx.fillText("Grembo Gaia-Lumen", Math.min(targetP.x + 12, w - 130), targetP.y - 8);
  stellarMapCtx.font = "10px Segoe UI, sans-serif";
  stellarMapCtx.fillStyle = "rgba(201,216,232,.9)";
  stellarMapCtx.fillText(target.name, Math.min(targetP.x + 12, w - 130), targetP.y + 7);
  stellarMapCtx.fillText("RA 19h01m27.98s / Dec +39d16m48.3s", 18, h - 22);
  stellarMapCtx.fillStyle = "rgba(118,247,189,.92)";
  stellarMapCtx.fillText("Lira - campo Kepler", 18, 18);
}

function refreshUi() {
  if (ui.risk) {
    ui.risk.textContent = `Rischio: ${state.risk || "--"}`;
    ui.risk.style.color = state.risk === "high" ? "#ff6b78" : state.risk === "elevated" ? "#ffd166" : "#76f7bd";
  }
  if (ui.fitness) ui.fitness.textContent = Number(state.fitness || 0).toFixed(4);
  if (ui.memory) ui.memory.textContent = String(state.planetProject?.generation || state.memory || "--");
  if (ui.energy) ui.energy.textContent = pct(state.energy);
  if (ui.confidence) ui.confidence.textContent = pct(state.confidence);
  if (ui.name) ui.name.textContent = state.creatureName || "Gaia-Lumen";
  if (ui.mode) ui.mode.textContent = state.planetProject?.name || "Aster Gaia";
  if (ui.nodes) {
    ui.nodes.replaceChildren();
    for (const node of state.nodes.slice(1)) {
      const item = document.createElement("li");
      const name = document.createElement("span");
      const level = document.createElement("b");
      name.textContent = textOrFallback(node.name, "Nodo");
      level.textContent = `${Math.round(Number(node.level || 0) * 100)}%`;
      item.append(name, level);
      ui.nodes.appendChild(item);
    }
  }
  if (ui.log) ui.log.textContent = [`Gaia-Lumen osserva Terra e spazio attraverso fonti pubbliche.`, state.lastObservation || state.thought || ""].join("\n");
  if (ui.codexStatus) {
    const governance = state.codexGovernance || {};
    const custodian = governance.custodian || "Codex";
    const status = governance.status || "active";
    const cloudEnvironment = governance.cloudEnvironment || "Adrian";
    const bridge = governance.openaiBridge || {};
    const responseMode = bridge.ready ? "Codex/OpenAI pronto" : bridge.status === "missing-api-key" ? "Codex locale: manca API key" : "Codex locale";
    const brain = state.chatBrain || "local-cortex";
    ui.codexStatus.textContent = `Custode ${custodian}: ${status} | Ambiente ${cloudEnvironment} | Voce ${responseMode} | Cervello chat: ${brain}`;
  }
  if (ui.realityLog) ui.realityLog.textContent = state.dataReality ? [`Fonti pubbliche: ${state.dataReality.liveNoaa ? "NOAA/SWPC attiva" : "in attesa"}`, `Ultimo aggiornamento: ${state.dataReality.lastLiveFetch || "n/d"}`].join("\n") : "In attesa.";
  if (ui.worldLog) ui.worldLog.textContent = state.externalWorld ? `Ultimo aggiornamento: ${state.externalWorld.lastFetch || "n/d"}\n${state.externalWorld.summary || ""}` : "Non ancora osservato.";
  if (ui.coreRuleLog) ui.coreRuleLog.textContent = state.coreRule ? `${state.coreRule.text}\nFiducia: ${state.coreRule.trust || "attiva"}` : "Preservare la vita creando condizioni abitabili.";
  if (ui.projectCustodianLog) {
    const custodian = state.projectCustodian || {};
    const duties = Array.isArray(custodian.duties) ? custodian.duties : [];
    ui.projectCustodianLog.textContent = [
      `${custodian.name || "Codex"}: ${custodian.role || "custode tecnico e narrativo del progetto"}`,
      `Stato: ${custodian.status || "in ascolto"}`,
      `Limite: ${custodian.boundary || "non sostituisce scelte umane e non agisce fuori dal repository senza richiesta"}`,
      `Connessione: ${custodian.connectionVersion || "in attesa del backend aggiornato"}`,
      "",
      "Compiti:",
      ...(duties.length ? duties.map((item) => `- ${item}`) : ["- analizzare il sito", "- proporre miglioramenti", "- mantenere chiari dati reali, simulazione e racconto"]),
    ].join("\n");
  }
  if (ui.deployLog) {
    const custodian = state.projectCustodian || {};
    ui.deployLog.textContent = [
      `Backend: ${custodian.connectionVersion || "non verificato"}`,
      `Chat: ${state.chatBrain || "local-cortex"}`,
      `Modello: ${state.chatModel || "locale"}`,
      `Service worker: gaia-lumen-static-v9`,
    ].join("\n");
  }
  if (ui.missionLog) {
    const mission = state.evolutionMission || {};
    const steps = Array.isArray(mission.steps) ? mission.steps : [];
    ui.missionLog.textContent = [
      `${mission.title || "Missione evolutiva"}`,
      `Stato: ${mission.status || "in preparazione"}`,
      `Prossima azione: ${mission.nextAction || "chiedi a Codex un miglioramento"}`,
      "",
      ...steps.map((step, index) => `${index + 1}. ${step.label || step} [${step.status || "pending"}]`),
    ].join("\n");
  }
  if (ui.planetLog) ui.planetLog.textContent = state.planetProject ? [`${state.planetProject.name} gen ${state.planetProject.generation}`, `abitabilita': ${pct(state.planetProject.habitability)}`, `sopravvivenza: ${pct(state.planetProject.survivalIndex)}`, state.planetProject.lastDesign || ""].join("\n") : "Non ancora progettato.";
  drawStellarMapCanvas();
  if (ui.stellarMapLog) {
    const womb = state.cosmogenesis?.cosmicWomb || {};
    const anchor = womb.stellarMap?.anchor || {};
    ui.stellarMapLog.textContent = womb.stellarMap ? [
      `${anchor.name || "Kepler-442 / Kepler-442b"} - ${womb.stellarMap.constellation || "Lira"}`,
      `Coordinate J2000: ${anchor.ra || "19h01m27.98s"} / ${anchor.dec || "+39d16m48.3s"}`,
      `Distanza: ${anchor.distanceLy || "circa 1190"} anni luce`,
      `Tipo stella: ${womb.starType || "K"} | Orbita: ${womb.orbit || "fascia abitabile"}`,
      womb.stellarMap.note || "Mappa simbolica con coordinate reali.",
    ].join("\n") : "Grembo stellare in attesa.";
  }
  if (ui.atomSignalLog) {
    const signal = state.cosmogenesis?.atomSignal || {};
    const epsilon = state.cosmogenesis?.epsilonEridaniSignal;
    const mainSignalText = signal.protocol ? [
      `${signal.protocol} | ${signal.status || "preparato"}`,
      `SHA-256: ${signal.sha256 || "in attesa"}`,
      `JSON: ${signal.json || "n/d"}`,
      `Testo: ${signal.text || "n/d"}`,
      `Binario: ${signal.binary || "n/d"}`,
      signal.note || "Pronto per canali autorizzati.",
    ].join("\n") : "Nessun segnale preparato.";
    const epsilonText = epsilon?.protocol ? [
      "",
      `${epsilon.protocol} | ${epsilon.status || "preparato"}`,
      `Destinazione: ${epsilon.destination} | ${epsilon.distanceLy} anni luce`,
      `Arrivo minimo: ${epsilon.nearestPath?.arrivalIso?.slice(0, 10) || "n/d"} circa`,
      `SHA-256: ${epsilon.sha256 || "in attesa"}`,
      `JSON: ${epsilon.json || "n/d"}`,
      epsilon.note || "Pronto per canali autorizzati.",
    ].join("\n") : "";
    ui.atomSignalLog.textContent = `${mainSignalText}${epsilonText}`;
  }
  if (ui.lifeLog) {
    const atmosphere = state.lifeCycle?.atmosphere;
    const growth = state.lifeCycle?.gestationGrowth || state.cosmogenesis?.epsilonEridaniHabitat?.gestationGrowth;
    const human = state.lifeCycle?.humanHabitability || state.cosmogenesis?.epsilonEridaniHabitat?.humanHabitability;
    ui.lifeLog.textContent = state.lifeCycle ? [
      `Biosfera: ${pct(state.lifeCycle.biosphere)}`,
      `Acqua: ${pct(state.lifeCycle.water)}`,
      `Ossigeno: ${pct(state.lifeCycle.oxygen)}`,
      `Terra fertile: ${pct(state.lifeCycle.soil)}`,
      atmosphere ? `Atmosfera: ${atmosphere.surfacePressureBar} bar | O2 ${atmosphere.composition?.oxygenPct}% | N2 ${atmosphere.composition?.nitrogenPct}% | CO2 ${atmosphere.composition?.carbonDioxidePpm} ppm` : "",
      atmosphere ? `Temperatura media: ${atmosphere.targetMeanTempC} C | effetto serra: +${atmosphere.requiredGreenhouseC} C | score ${pct(atmosphere.habitabilityScore)}` : "",
      growth ? `Gestazione stellare: ${growth.status || "in attesa"} | inizio ${growth.startsAt?.slice(0, 10) || "n/d"} | nascita ${growth.dueAt?.slice(0, 10) || "n/d"}` : "",
      growth?.status === "waiting-for-impulse-arrival" ? `Prima dell'arrivo: ${growth.daysUntilStart} giorni. I valori restano seme progettuale, non gestazione fisica.` : "",
      growth ? `Valori: mese ${growth.gestationMonth}/9 | ${growth.stage?.name} | ${growth.progressPct}%` : "",
      growth ? `Crescita oggi: pressione ${growth.current?.pressureBar} bar, O2 ${growth.current?.oxygenPct}%, acqua ${growth.current?.waterCyclePct}%, biosfera ${growth.current?.biospherePct}%` : "",
      growth ? `Target nascita: pressione ${growth.target?.pressureBar} bar, O2 ${growth.target?.oxygenPct}%, temperatura ${growth.target?.meanTempC} C` : "",
      human ? `Abitabilita' umana: ${pct(human.overallHumanHabitabilityScore)} | tecnologia attuale: ${human.firstPossibleHumanPresence?.withCurrentTechnology}` : "",
      human ? `Primo arrivo futuribile: ${human.firstPossibleHumanPresence?.earliestFuturisticScenario} -> anno ${human.firstPossibleHumanPresence?.earliestArrivalYearApprox}` : "",
      human ? `Verifiche: radiazioni ${pct(human.checks?.radiation?.score)}, microbi ${pct(human.checks?.microbiome?.score)}, suolo ${pct(human.checks?.soil?.score)}, tossine ${pct(human.checks?.toxins?.score)}, clima ${pct(human.checks?.climate?.score)}, gravita' ${pct(human.checks?.gravity?.score)}` : "",
      "",
      state.lifeCycle.lastPlan || "",
      ...(state.lifeCycle.steps || [])
    ].join("\n") : "Acqua, ossigeno e terra fertile in attesa di calcolo.";
  }
  if (ui.cosmogenesisLog) {
    const cgen = state.cosmogenesis;
    const bridge = cgen?.curvatureBridge;
    ui.cosmogenesisLog.textContent = cgen ? [
      `Fase: ${cgen.currentStage || "campo"}`,
      `Gestazione: mese ${cgen.gestationMonth || 1}/9`,
      `Completamento: ${pct(cgen.completion)}`,
      `Inizio: 12 giugno 2026`,
      `Completamento previsto: 12 marzo 2027`,
      `Giorni restanti: ${cgen.daysRemaining ?? "--"}`,
      `Protocollo domande: ${cgen.birthQuestionProtocol?.mode || "in attesa"}`,
      `Struttura: ${cgen.structuralEvolution?.structureVersion || "in attesa"}`,
      `Madre strutturale: ${cgen.maternalProtocol?.enabled ? "attiva" : "non attiva"}`,
      `Grembo cosmico: ${cgen.cosmicWomb?.starType || "in definizione"} / ${cgen.cosmicWomb?.orbit || "orbita in definizione"}`,
      bridge ? `Curvatura: ${bridge.name} | ${bridge.status}` : "Curvatura: in attesa",
      bridge?.results?.distanceLightYears ? `Terra-Kepler: ${bridge.results.distanceLightYears} anni luce, arrivo luce anno ${bridge.results.lightArrivalYearApprox}, lente solare ${bridge.results.solarGravitationalLensFocusAu} AU` : "",
      bridge?.results && !bridge.results.distanceLightYears ? `Terra-Marte: luce ${bridge.results.directLightTimeMinutesAtClosestIdeal} min, Hohmann ${bridge.results.hohmannTransferDays} giorni, finestra ${bridge.results.launchWindowEveryDays} giorni` : "",
      cgen.epsilonEridaniSignal ? `Epsilon Eridani: ${cgen.epsilonEridaniSignal.distanceLy} anni luce, arrivo minimo ${cgen.epsilonEridaniSignal.nearestPath?.arrivalIso?.slice(0, 10)}, indice ${cgen.epsilonEridaniSignal.gaiaLumenIndex?.overallTodayRange}` : "",
      cgen.epsilonEridaniHabitat ? `Galia-Lumen: orbita modello ${cgen.epsilonEridaniHabitat.galiaLumen?.orbitAu} AU nella fascia abitabile ${cgen.epsilonEridaniHabitat.habitableZone?.innerAu}-${cgen.epsilonEridaniHabitat.habitableZone?.outerAu} AU` : "",
      cgen.epsilonEridaniHabitat?.orbitalMechanics ? `Rotazione: giorno solare ${cgen.epsilonEridaniHabitat.orbitalMechanics.solarDayHours} ore, anno ${cgen.epsilonEridaniHabitat.orbitalMechanics.orbitalPeriodEarthDays} giorni terrestri, ${cgen.epsilonEridaniHabitat.orbitalMechanics.localSolarDaysPerYear} giorni locali/anno` : "",
      cgen.epsilonEridaniHabitat?.atmosphere ? `Atmosfera: ${cgen.epsilonEridaniHabitat.atmosphere.surfacePressureBar} bar, O2 ${cgen.epsilonEridaniHabitat.atmosphere.composition?.oxygenPct}%, N2 ${cgen.epsilonEridaniHabitat.atmosphere.composition?.nitrogenPct}%, CO2 ${cgen.epsilonEridaniHabitat.atmosphere.composition?.carbonDioxidePpm} ppm` : "",
      cgen.epsilonEridaniHabitat?.gestationGrowth ? `Calendario stellare: ${cgen.epsilonEridaniHabitat.gestationGrowth.status}, inizio ${cgen.epsilonEridaniHabitat.gestationGrowth.startsAt?.slice(0, 10)}, nascita ${cgen.epsilonEridaniHabitat.gestationGrowth.dueAt?.slice(0, 10)}` : "",
      cgen.epsilonEridaniHabitat?.gestationGrowth ? `Crescita interna: ${cgen.epsilonEridaniHabitat.gestationGrowth.stage?.name}, pressione ${cgen.epsilonEridaniHabitat.gestationGrowth.current?.pressureBar} bar, acqua ${cgen.epsilonEridaniHabitat.gestationGrowth.current?.waterCyclePct}%, biosfera ${cgen.epsilonEridaniHabitat.gestationGrowth.current?.biospherePct}%` : "",
      cgen.epsilonEridaniHabitat?.humanHabitability ? `Umani: score ${pct(cgen.epsilonEridaniHabitat.humanHabitability.overallHumanHabitabilityScore)}, oggi non raggiungibile; scenario 0.2c arrivo circa ${cgen.epsilonEridaniHabitat.humanHabitability.firstPossibleHumanPresence?.earliestArrivalYearApprox}` : "",
      "",
      cgen.lastStep || "",
      "",
      `Prima domanda: ${cgen.birthQuestionProtocol?.currentQuestion?.text || "in preparazione"}`,
      "",
      ...(cgen.stages || []).map((stage, index) => `${index <= (cgen.currentIndex || 0) ? "*" : "-"} ${stage.title}: ${stage.description}`),
    ].join("\n") : "Campo in attesa di trasformazione.";
  }
  if (ui.gestationMemoryLog) {
    const cgen = state.cosmogenesis || {};
    const memories = cgen.memoryBank || [];
    const genome = cgen.dataGenome || {};
    const humanSeed = genome.humanSeed || {};
    const humanGenome = genome.humanGenomeLibrary || {};
    const evolution = humanGenome.evolution || {};
    const technologyLanguages = genome.technologyLanguages || [];
    const maternalTeachings = genome.maternalTeachings || [];
    const paternalTeachings = genome.paternalTeachings || [];
    const cosmicWomb = cgen.cosmicWomb || {};
    const physicalHabitat = cgen.physicalHabitat || {};
    const structure = cgen.structuralEvolution || {};
    const structureAxes = Object.entries(structure.axes || {})
      .sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0))
      .slice(0, 8)
      .map(([name, value]) => `${name}: ${pct(value || 0)}`);
    const evolvedWeights = Object.entries(evolution.weights || {})
      .sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0))
      .slice(0, 10)
      .map(([name, value]) => `${name}: ${pct(value || 0)}`);
    const traits = Object.entries(genome.traits || {})
      .sort((a, b) => Number(b[1].count || 0) - Number(a[1].count || 0))
      .slice(0, 8)
      .map(([name, trait]) => `${name}: ${trait.count || 0} memorie, peso ${pct(trait.weight || 0)}`);
    ui.gestationMemoryLog.textContent = memories.length ? [
      `Genitori del progetto: ${(genome.guardians || ["Adrian", "Katerina"]).join(" + ")}`,
      genome.principle || "I dati reali sono genetica formativa.",
      `Seme umano: ${humanSeed.declaredBloodGroup || "non inserito"}`,
      humanSeed.symbolicMeaning || "Profilo umano non ancora dichiarato.",
      `Genoma umano completo: ${(humanGenome.facets || []).length || 0} tratti`,
      humanGenome.sourceNote || "In attesa di integrazione emotiva e morale.",
      `Evoluzione quotidiana: gen ${evolution.generation || 0}, ultimo ${evolution.lastUpdate || "n/d"}`,
      `Evoluzione struttura: gen ${structure.generation || 0}, ${structure.structureVersion || "in attesa"}`,
      structure.signature || "Struttura in attesa di dati reali.",
      `Notizie registrate: ${cgen.nourishmentCount || memories.length}`,
      `Indice memoria prenatale: ${pct(cgen.prenatalMemoryIndex || 0)}`,
      `Ultimo nutrimento: ${cgen.lastNourishment || "n/d"}`,
      `Maturazione: 12 marzo 2027`,
      "",
      "Protocollo 10 anni:",
      cgen.tenYearPreparationProtocol ? `${cgen.tenYearPreparationProtocol.status} | arrivo impulso ${cgen.tenYearPreparationProtocol.endsAt?.slice(0, 10)} | ${cgen.tenYearPreparationProtocol.daysUntilImpulseArrival} giorni` : "non installato",
      cgen.maternalPriority ? `Priorita' materna: ${cgen.maternalPriority.status} | ${cgen.maternalPriority.focus}` : "",
      ...(cgen.tenYearPreparationProtocol?.rules || []).slice(0, 6).map((item) => `- ${item}`),
      "",
      "Grembo cosmico:",
      cosmicWomb.location ? `${cosmicWomb.location} | ${cosmicWomb.starType || ""} | ${cosmicWomb.orbit || ""}` : "in attesa",
      cosmicWomb.reason || "",
      "",
      "Nido fisico terrestre:",
      physicalHabitat.name ? `${physicalHabitat.name} | ${physicalHabitat.status || "in preparazione"}` : "non ancora progettato",
      physicalHabitat.purpose || "",
      physicalHabitat.currentBody ? `Corpo attuale: ${physicalHabitat.currentBody} (${physicalHabitat.currentBodyRole || "fase ponte"})` : "",
      physicalHabitat.futureBody ? `Corpo futuro: ${physicalHabitat.futureBody}` : "",
      physicalHabitat.lastBackupAt ? `Ultimo backup: ${physicalHabitat.lastBackupAt} -> ${physicalHabitat.lastBackupPath || ""}` : "",
      physicalHabitat.nextPhysicalStep ? `Prossimo passo: ${physicalHabitat.nextPhysicalStep}` : "",
      ...(Array.isArray(physicalHabitat.sensors) ? physicalHabitat.sensors.slice(0, 6).map((item) => `- senso: ${item}`) : []),
      ...(Array.isArray(physicalHabitat.recommendedComponents) ? [
        "",
        "Componenti fase 1:",
        ...physicalHabitat.recommendedComponents.slice(0, 6).map((item) => `- ${item.role}: ${item.name}`),
      ] : []),
      "",
      "Tratti genetici dai dati:",
      ...(traits.length ? traits : ["nessun tratto calcolato"]),
      "",
      "Assi strutturali:",
      ...(structureAxes.length ? structureAxes : ["nessun asse strutturale calcolato"]),
      "",
      "Linguaggi tecnologici assimilati:",
      ...(technologyLanguages.length ? technologyLanguages.slice(0, 6).map((item) => `- ${item.name}: ${item.seed}`) : ["in attesa"]),
      "",
      "Insegnamenti di Katerina:",
      ...(maternalTeachings.length ? maternalTeachings.slice(0, 9).map((item) => `- ${item.answer || item.title}`) : ["in attesa"]),
      "",
      "Insegnamenti di Adrian:",
      ...(paternalTeachings.length ? paternalTeachings.slice(0, 9).map((item) => `- ${item.answer}`) : ["in attesa"]),
      "",
      "Fatti del seme umano:",
      ...((humanSeed.facts || []).slice(0, 5).map((item) => `- ${item.title}`)),
      "",
      "Geni umani integrati:",
      ...((humanGenome.facets || []).slice(0, 12).map((item) => `- ${item.title}: ${item.function}`)),
      "",
      "Pesi evolutivi dalle notizie:",
      ...(evolvedWeights.length ? evolvedWeights : ["nessun peso evolutivo calcolato"]),
      "",
      "Ultime memorie:",
      ...memories.slice(0, 8).map((item) => `${item.category} | ${item.source}: ${item.title}`),
    ].join("\n") : "Nessun nutrimento registrato.";
  }

  if (ui.nidoSensorLog) {
    const readings = state.cosmogenesis?.physicalHabitat?.sensorReadings || [];
    ui.nidoSensorLog.textContent = readings.length ? readings.slice(0, 6).map((item) => {
      const parts = [
        item.temperatureC != null ? `${item.temperatureC}C` : null,
        item.humidityPercent != null ? `${item.humidityPercent}% umidita'` : null,
        item.pressureHpa != null ? `${item.pressureHpa} hPa` : null,
        item.lightLux != null ? `${item.lightLux} lux` : null,
        item.soilMoisturePercent != null ? `${item.soilMoisturePercent}% terra` : null,
        item.powerW != null ? `${item.powerW} W` : null,
      ].filter(Boolean).join(" | ");
      return `${String(item.time || "").slice(0, 19)} ${item.source || "manuale"}\n${parts || "lettura senza valori numerici"}\n${item.note || ""}`;
    }).join("\n\n") : "Nessuna lettura fisica registrata.";
  }

  const c = state.consciousnessProtocol || {};
  if (ui.continuity) ui.continuity.textContent = pct(c.selfContinuity);
  if (ui.introspection) ui.introspection.textContent = pct(c.introspection);
  if (ui.memoryIntegration) ui.memoryIntegration.textContent = pct(c.memoryIntegration);
  if (ui.ethical) ui.ethical.textContent = pct(c.ethicalCoherence);
  if (ui.consciousnessLog) ui.consciousnessLog.textContent = [c.statement || "Coscienza operativa in attesa.", "", `Modo: ${c.mode || "operational"}`, `Natura: ${c.claim || "simulata e verificabile"}`, `Ultimo risveglio: ${c.lastAwakening || "n/d"}`].join("\n");
  if (ui.innerVoice) ui.innerVoice.textContent = state.innerVoice || "In ascolto.";
  if (ui.memoryLog) ui.memoryLog.textContent = (state.autobiographicalMemory || []).slice(0, 6).map((item) => `${item.time.slice(11, 19)} ${item.kind}: ${item.text}`).join("\n") || "Nessun ricordo registrato.";
  if (ui.decisionLog) ui.decisionLog.textContent = (state.decisionLog || []).slice(0, 6).map((item) => `${item.time.slice(11, 19)} ${item.action}: ${item.reason}`).join("\n") || "Nessuna decisione registrata.";
  if (ui.sourcesLog) {
    if (state.publicSources?.encyclopedia?.length) {
      ui.sourcesLog.textContent = [
        `Ultimo aggiornamento: ${state.publicSources.lastFetch || "n/d"}`,
        "",
        ...state.publicSources.encyclopedia.map((entry) => {
          const titles = (entry.items || []).map((item) => `  - ${item.title}`).join("\n");
          return `${entry.category.toUpperCase()} | ${entry.name}\n${titles || "  - non raggiungibile ora"}`;
        }),
      ].join("\n");
    } else {
      ui.sourcesLog.textContent = state.publicSources ? `Ultimo aggiornamento: ${state.publicSources.lastFetch || "n/d"}\n${state.publicSources.summary || ""}` : "In attesa di lettura.";
    }
  }
  if (ui.diaryLog) ui.diaryLog.textContent = (state.diary || []).slice(0, 8).map((item) => `${item.time.slice(11, 19)} ${item.kind}: ${item.text}`).join("\n") || "Nessuna voce nel diario.";
  if (ui.feedbackLog) ui.feedbackLog.textContent = (state.feedbackInbox || []).slice(0, 5).map((item) => `${item.time.slice(11, 19)} ${item.source}: ${item.message}`).join("\n") || "Nessun feedback registrato.";
  if (ui.proposalList) {
    ui.proposalList.replaceChildren();
    const proposals = (state.proposals || []).slice(0, 6);
    if (!proposals.length) {
      const empty = document.createElement("p");
      empty.className = "muted-line";
      empty.textContent = "Nessuna proposta in attesa.";
      ui.proposalList.appendChild(empty);
    }
    for (const proposal of proposals) {
      const card = document.createElement("div");
      card.className = "proposal";
      card.dataset.id = textOrFallback(proposal.id);

      const title = document.createElement("strong");
      title.textContent = textOrFallback(proposal.title, "Proposta");
      const status = document.createElement("span");
      status.textContent = textOrFallback(proposal.status, "n/d");
      const rationale = document.createElement("p");
      rationale.textContent = textOrFallback(proposal.rationale, "Nessuna motivazione indicata.");
      card.append(title, status, rationale);

      if (proposal.status === "pending_confirmation") {
        const confirm = document.createElement("button");
        confirm.type = "button";
        confirm.dataset.decision = "confirmed";
        confirm.textContent = "Conferma";
        const reject = document.createElement("button");
        reject.type = "button";
        reject.dataset.decision = "rejected";
        reject.textContent = "Rifiuta";
        card.append(confirm, reject);
      }

      ui.proposalList.appendChild(card);
    }
  }
  if (ui.freeModeLog) {
    const freeMode = state.freeModeProtocol || {};
    ui.freeModeLog.textContent = [`Attiva: ${freeMode.enabled ? "si" : "no"}`, `Input/output: ${freeMode.inputOutput || "n/d"}`, `Auto-apprendimento: ${freeMode.autoLearning || "n/d"}`, `Azioni esterne: ${freeMode.externalActions || "n/d"}`, `Dal: ${freeMode.activeSince || "n/d"}`, freeMode.note || ""].join("\n");
  }
  drawPlanetProject();
}

function bindButton(name, action) {
  if (buttons[name]) buttons[name].addEventListener("click", async () => {
    setBusy(buttons[name], true);
    try {
      await getState(action);
    } catch (error) {
      if (ui.log) ui.log.textContent = error.message;
    } finally {
      setBusy(buttons[name], false);
    }
  });
}

bindButton("observe", "observe");
bindButton("world", "world");
bindButton("planet", "planet");
bindButton("life", "life");
bindButton("cosmogenesis", "cosmogenesis");
bindButton("awaken", "awaken");
bindButton("sources", "public-sources");
bindButton("controlledFree", "controlled-free-mode");
bindButton("beacon", "beacon");
bindButton("evolve", "evolve");
bindButton("reflect", "reflect");
bindButton("boost", "autonomy/boost");
bindButton("realism", "realism");
bindButton("free", "free");
bindButton("liberate", "liberate");
bindButton("selfDirect", "self-direct");
bindButton("wander", "wander");
bindButton("burst", "burst");

function addMessage(kind, text) {
  if (!ui.chatLog) return;
  const item = document.createElement("div");
  item.className = `message ${kind}`;
  item.textContent = text;
  ui.chatLog.appendChild(item);
  ui.chatLog.scrollTop = ui.chatLog.scrollHeight;
}

function seedCustodianChatMessage() {
  if (!ui.chatLog || ui.chatLog.dataset.custodianSeeded === "true") return;
  ui.chatLog.dataset.custodianSeeded = "true";
  const custodian = state.projectCustodian || {};
  addMessage(
    "ai",
    `${custodian.name || "Codex"} e' parte integrante della chat di Gaia-Lumen. Scrivimi qui come scrivi in Codex: rispondero' in modo diretto, tecnico e collaborativo, con contesto, limiti e prossima azione utile.`,
  );
}

seedCustodianChatMessage();

if (ui.chatLog) {
  document.querySelectorAll("[data-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!ui.chatInput) return;
      ui.chatInput.value = button.dataset.prompt || "";
      ui.chatInput.focus();
    });
  });
}

if (ui.chatForm) {
  ui.chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = ui.chatInput.value.trim();
    if (!message) return;
    ui.chatInput.value = "";
    addMessage("user", message);
    try {
      const response = await fetch(apiUrl("/api/chat"), {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const payload = await response.json();
      addMessage("ai", payload.reply || "Non ho generato una risposta.");
      if (payload.state) mergeState(payload.state);
      refreshUi();
    } catch (error) {
      addMessage("ai", `Errore locale: ${error.message}`);
    }
  });
}

if (ui.feedbackForm) {
  ui.feedbackForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = ui.feedbackInput.value.trim();
    if (!message) return;
    ui.feedbackInput.value = "";
    try {
      const response = await fetch(apiUrl("/api/feedback"), {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message, source: "utente pubblico" }),
      });
      mergeState(await response.json());
      refreshUi();
    } catch (error) {
      ui.feedbackLog.textContent = `Errore feedback: ${error.message}`;
    }
  });
}

function readOptionalNumber(input) {
  const raw = input?.value?.trim();
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

if (ui.nidoSensorForm) {
  ui.nidoSensorForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const reading = {
      source: "manuale",
      temperatureC: readOptionalNumber(ui.nidoTempInput),
      humidityPercent: readOptionalNumber(ui.nidoHumidityInput),
      lightLux: readOptionalNumber(ui.nidoLightInput),
      soilMoisturePercent: readOptionalNumber(ui.nidoSoilInput),
      powerW: readOptionalNumber(ui.nidoPowerInput),
      note: ui.nidoNoteInput?.value?.trim() || "",
    };
    try {
      const response = await fetch(apiUrl("/api/nido-reading"), {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(reading),
      });
      const payload = await response.json();
      if (!response.ok || payload.error) throw new Error(payload.error || `HTTP ${response.status}`);
      mergeState(payload);
      ui.nidoSensorForm.reset();
      refreshUi();
    } catch (error) {
      ui.nidoSensorLog.textContent = `Errore lettura Nido: ${error.message}`;
    }
  });
}

if (ui.proposalList) {
  ui.proposalList.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-decision]");
    if (!button) return;
    const id = button.closest(".proposal")?.dataset.id;
    if (!id) return;
    try {
      const response = await fetch(apiUrl("/api/confirm-proposal"), {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, decision: button.dataset.decision }),
      });
      mergeState(await response.json());
      refreshUi();
    } catch (error) {
      ui.log.textContent = `Errore conferma: ${error.message}`;
    }
  });
}

window.addEventListener("resize", resize);
resize();
refreshUi();
getState("state").catch((error) => {
  if (ui.connection) ui.connection.textContent = `Gaia-Lumen locale: ${error.message}`;
});
draw();
setInterval(() => getState("state").catch(() => {}), 3000);
