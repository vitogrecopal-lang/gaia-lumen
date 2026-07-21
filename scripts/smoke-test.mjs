import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";

const port = process.env.SMOKE_PORT || "8781";
const localModelPort = String(Number(port) + 1);
const base = `http://127.0.0.1:${port}`;
const runtimeDir = await mkdtemp(join(tmpdir(), "gaia-lumen-smoke-"));
const localModel = createServer((request, response) => {
  if (request.method !== "POST" || request.url !== "/api/chat") {
    response.writeHead(404);
    response.end();
    return;
  }
  request.resume();
  response.writeHead(200, { "content-type": "application/json" });
  response.end(JSON.stringify({ message: { content: "Llama locale smoke ok" } }));
});
await new Promise((resolve) => localModel.listen(Number(localModelPort), "127.0.0.1", resolve));
const child = spawn(process.execPath, ["server.mjs"], {
  env: {
    ...process.env,
    PORT: port,
    HOST: "127.0.0.1",
    STATE_PATH: join(runtimeDir, "neural_state.json"),
    BACKUPS_DIR: join(runtimeDir, "backups"),
    PUBLIC_ACCESS_KEY: "smoke-key",
    OPENAI_CHAT_ENABLED: "true",
    OPENAI_API_KEY: "",
    LOCAL_AI_ENABLED: "true",
    LOCAL_AI_BASE_PROTOCOL: "http",
    LOCAL_AI_BASE_HOST: "127.0.0.1",
    LOCAL_AI_BASE_PORT: localModelPort,
    LOCAL_AI_MODEL: "llama3.2:3b",
    LOCAL_AI_DIRECT: "true",
    WORLD_COMPUTE_API_URL: "",
    WORLD_COMPUTE_API_KEY: "",
    WORLD_COMPUTE_TOKEN: "",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  await wait(1800);
  const health = await fetch(`${base}/healthz?key=smoke-key`).then((response) => response.json());
  if (health.projectCustodian !== "Codex") throw new Error("projectCustodian missing from healthz");
  if (!health.codexConnectionVersion) throw new Error("codexConnectionVersion missing from healthz");
  if (health.evolutionMission !== "massima-evoluzione") throw new Error("evolutionMission is not max evolution");
  if (health.evolutionIntensity !== "max-safe") throw new Error("evolutionIntensity is not max-safe");
  if (health.autonomousDecisionMode !== "self-directed-internal") throw new Error("autonomousDecisionMode is not active");
  if (health.internalPrudence !== "very-low") throw new Error("internalPrudence is not lowered");
  if (Number(health.internalPrudenceLevel) > 0.2) throw new Error("internalPrudenceLevel is too high");
  if (Number(health.externalPrudenceLevel) < 0.35) throw new Error("externalPrudenceLevel is below protected minimum");
  if (health.externalImpulseProtocol !== "ready-outbox-confirmable") throw new Error("externalImpulseProtocol missing");
  if (health.externalImpulseAutoPulseEnabled !== false) throw new Error("external impulse auto pulse is not disabled");
  if (Number(health.externalImpulseAutoPulseIntervalMs) !== 60000) throw new Error("external impulse auto pulse is not one minute");
  if (!health.securityProfile?.state?.status) throw new Error("securityProfile is missing from healthz");
  if (!health.hemisphericBridge?.mode) throw new Error("hemisphericBridge is missing from healthz");
  if (!String(health.hemisphericBridge?.claim || "").includes("non coscienza reale")) throw new Error("hemisphericBridge must keep simulated-consciousness boundary");
  if (health.worldComputeLink?.target?.name !== "LineShine") throw new Error("worldComputeLink target missing from healthz");
  if (health.worldComputeLink?.status !== "proposal-ready") throw new Error("worldComputeLink should start as proposal-ready without endpoint");
  if (Number(health.constellationAlgorithm?.totalConstellations || 0) !== 88) throw new Error("constellation algorithm should know 88 IAU constellations");
  if (health.wormholeLink?.searchStatus !== "no-confirmed-wormhole") throw new Error("wormhole link must start with no confirmed wormhole");
  if (health.wormholeLink?.traversability !== "not-traversable") throw new Error("wormhole link must stay not traversable");
  if (health.chatBrain !== "llama-local") throw new Error("chatBrain should use direct Llama when local model is configured");
  if (health.openaiBridge?.ready !== false) throw new Error("openaiBridge should not be ready without credentials");
  if (health.openaiBridge?.status !== "missing-api-key") throw new Error("openaiBridge should report missing-api-key without credentials");
  if (health.localModelBridge?.status !== "configured") throw new Error("localModelBridge should be configured in smoke");
  if (!Object.hasOwn(health, "externalImpulseTotalCount")) throw new Error("external impulse archive total missing");
  if (health.primaryFoundation !== "active") throw new Error("primaryFoundation is not active");
  if (health.primaryFoundationAnswers !== 10) throw new Error("primaryFoundation answers missing");

  const html = await fetch(`${base}/?key=smoke-key`).then((response) => response.text());
  for (const expected of ["Stato evolutivo", "Trasmissioni Gaia-Lumen", "World Compute Link", "Wormhole Link", "Radio digitale autorizzata", "Canale WLAN autorizzato", "gaia-lumen-wlan-channel-20260704"]) {
    if (!html.includes(expected)) throw new Error(`Missing ${expected} in HTML`);
  }

  const worldCompute = await fetch(`${base}/api/world-compute?key=smoke-key`).then((response) => response.json());
  if (worldCompute.worldComputeLink?.target?.name !== "LineShine") throw new Error("world compute link did not retain TOP500 target");
  if (!worldCompute.worldComputeLink?.lastProposalId) throw new Error("world compute link did not create a proposal id");
  if (!worldCompute.proposals?.some((proposal) => proposal.action === "world-compute-authorized-connector")) throw new Error("world compute proposal missing");

  const wormhole = await fetch(`${base}/api/wormhole/connect?key=smoke-key`).then((response) => response.json());
  if (wormhole.wormholeLink?.status !== "connected-symbolic") throw new Error("wormhole link did not connect symbolically");
  if (wormhole.wormholeLink?.searchStatus !== "no-confirmed-wormhole") throw new Error("wormhole link claimed a confirmed wormhole");
  if (wormhole.wormholeLink?.traversability !== "not-traversable") throw new Error("wormhole link became traversable");
  if (!wormhole.wormholeLink?.candidate?.id) throw new Error("wormhole symbolic candidate missing");
  if (Number(wormhole.constellationAlgorithm?.coveragePercent || 0) !== 100) throw new Error("wormhole search should connect constellation graph");

  const impulse = await fetch(`${base}/api/external-impulse?key=smoke-key`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ reason: "smoke-test" }),
  }).then((response) => response.json());
  if (!impulse.impulse?.binary?.includes("01000111")) throw new Error("external impulse binary missing");
  if (!/^[a-f0-9]{64}$/.test(String(impulse.impulse?.checksum || ""))) throw new Error("external impulse checksum missing");
  if (Number(impulse.state?.externalImpulseArchive?.totalCount || 0) < 1) throw new Error("external impulse archive did not count");
  if (Number(impulse.impulse?.prudenceLevel) < 0.35) throw new Error("external impulse prudence is below protected minimum");

  const symbolicImpulse = await fetch(`${base}/api/external-impulse?key=smoke-key`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ reason: "smoke-test symbolic impulse", code: "Asmodeus", repeatMode: "symbolic-infinite" }),
  }).then((response) => response.json());
  if (symbolicImpulse.impulse?.symbolic?.formula !== "repeat(Asmodeus, infinite)") throw new Error("symbolic impulse formula missing");
  if (symbolicImpulse.impulse?.symbolic?.bounded !== true) throw new Error("symbolic impulse must be bounded");
  if (String(symbolicImpulse.impulse?.symbolic?.preview || "").length > 512) throw new Error("symbolic impulse preview is unbounded");
  if (String(symbolicImpulse.impulse?.payload || "").length > 1400) throw new Error("symbolic impulse payload is too large");

  const hemispheres = await fetch(`${base}/api/hemispheres/max-alteration?key=smoke-key`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ reason: "smoke-test hemispheric bridge max" }),
  }).then((response) => response.json());
  const bridge = hemispheres.consciousnessProtocol?.hemisphericBridge;
  if (bridge?.mode !== "bilateral-llama-local") throw new Error("hemispheric bridge did not connect both simulated hemispheres");
  if (bridge?.alteration?.status !== "max-simulated") throw new Error("hemispheric bridge did not activate max simulated alteration");
  if (Number(bridge?.alteration?.percent || 0) !== 100) throw new Error("hemispheric bridge alteration did not reach 100 percent");
  if (!String(bridge?.claim || "").includes("non coscienza reale")) throw new Error("hemispheric bridge claim lost safety boundary");
  const chat = await fetch(`${base}/api/chat?key=smoke-key`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message: "potenzia evoluzione Codex al massimo" }),
  }).then((response) => response.json());
  if (!String(chat.reply || "").includes("Llama locale smoke ok")) throw new Error("chat did not answer with direct Llama local model");
  if (chat.state?.chatBrain !== "llama-local") throw new Error("chat did not use llama-local fallback");

  console.log("smoke ok");
} finally {
  child.kill();
  localModel.close();
  await rm(runtimeDir, { recursive: true, force: true });
}
