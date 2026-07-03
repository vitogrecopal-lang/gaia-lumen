import { spawn } from "node:child_process";

const port = process.env.SMOKE_PORT || "8781";
const base = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ["server.mjs"], {
  env: { ...process.env, PORT: port, HOST: "127.0.0.1", PUBLIC_ACCESS_KEY: "smoke-key" },
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
  if (Number(health.externalPrudenceLevel) > 0.45) throw new Error("externalPrudenceLevel is too high");
  if (health.externalImpulseProtocol !== "ready-outbox-confirmable") throw new Error("externalImpulseProtocol missing");
  if (health.primaryFoundation !== "active") throw new Error("primaryFoundation is not active");
  if (health.primaryFoundationAnswers !== 10) throw new Error("primaryFoundation answers missing");

  const html = await fetch(`${base}/?key=smoke-key`).then((response) => response.text());
  for (const expected of ["Stato evolutivo", "prompt-cards", "gaia-lumen-external-impulse-20260703"]) {
    if (!html.includes(expected)) throw new Error(`Missing ${expected} in HTML`);
  }

  const impulse = await fetch(`${base}/api/external-impulse?key=smoke-key`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ reason: "smoke-test" }),
  }).then((response) => response.json());
  if (!impulse.impulse?.binary?.includes("01000111")) throw new Error("external impulse binary missing");
  if (impulse.impulse?.prudenceLevel > 0.45) throw new Error("external impulse prudence too high");

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
