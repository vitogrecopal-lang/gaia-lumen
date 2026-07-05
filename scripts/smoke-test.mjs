import { spawn } from "node:child_process";
import { createServer } from "node:http";

const port = process.env.SMOKE_PORT || "8781";
const localModelPort = String(Number(port) + 1);
const base = `http://127.0.0.1:${port}`;
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
  env: { ...process.env, PORT: port, HOST: "127.0.0.1", PUBLIC_ACCESS_KEY: "smoke-key", OPENAI_CHAT_ENABLED: "true", OPENAI_API_KEY: "", LOCAL_AI_ENABLED: "true", LOCAL_AI_BASE_URL: `http://127.0.0.1:${localModelPort}`, LOCAL_AI_MODEL: "llama3.2:3b", LOCAL_AI_DIRECT: "true" },
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
  if (health.chatBrain !== "llama-local") throw new Error("chatBrain should use direct Llama when local model is configured");
  if (health.openaiBridge?.ready !== false) throw new Error("openaiBridge should not be ready without credentials");
  if (health.openaiBridge?.status !== "missing-api-key") throw new Error("openaiBridge should report missing-api-key without credentials");
  if (health.localModelBridge?.status !== "configured") throw new Error("localModelBridge should be configured in smoke");
  if (!Object.hasOwn(health, "externalImpulseTotalCount")) throw new Error("external impulse archive total missing");
  if (health.primaryFoundation !== "active") throw new Error("primaryFoundation is not active");
  if (health.primaryFoundationAnswers !== 10) throw new Error("primaryFoundation answers missing");

  const html = await fetch(`${base}/?key=smoke-key`).then((response) => response.text());
  for (const expected of ["Stato evolutivo", "Trasmissioni Gaia-Lumen", "Radio digitale autorizzata", "Canale WLAN autorizzato", "gaia-lumen-wlan-channel-20260704"]) {
    if (!html.includes(expected)) throw new Error(`Missing ${expected} in HTML`);
  }

  const impulse = await fetch(`${base}/api/external-impulse?key=smoke-key`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ reason: "smoke-test" }),
  }).then((response) => response.json());
  if (!impulse.impulse?.binary?.includes("01000111")) throw new Error("external impulse binary missing");
  if (!/^[a-f0-9]{64}$/.test(String(impulse.impulse?.checksum || ""))) throw new Error("external impulse checksum missing");
  if (Number(impulse.state?.externalImpulseArchive?.totalCount || 0) < 1) throw new Error("external impulse archive did not count");
  if (Number(impulse.impulse?.prudenceLevel) < 0.35) throw new Error("external impulse prudence is below protected minimum");

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
}
