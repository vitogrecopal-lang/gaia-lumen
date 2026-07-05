import { spawn } from "node:child_process";

const port = process.env.SMOKE_PORT || "8781";
const base = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ["server.mjs"], {
  env: { ...process.env, PORT: port, HOST: "127.0.0.1", PUBLIC_ACCESS_KEY: "smoke-key", OPENAI_CHAT_ENABLED: "true", OPENAI_API_KEY: "" },
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
  if (health.chatBrain !== "local-cortex") throw new Error("chatBrain should fall back locally without OpenAI credentials");
  if (health.openaiBridge?.ready !== false) throw new Error("openaiBridge should not be ready without credentials");
  if (health.openaiBridge?.status !== "missing-api-key") throw new Error("openaiBridge should report missing-api-key without credentials");
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
  if (!String(chat.reply || "").includes("Codex")) throw new Error("chat did not answer as Codex");

  console.log("smoke ok");
} finally {
  child.kill();
}
