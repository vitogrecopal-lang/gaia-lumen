import { spawn } from "node:child_process";

const port = process.env.SMOKE_PORT || "8781";
const base = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ["server.mjs"], {
  env: { ...process.env, PORT: port, HOST: "127.0.0.1", PUBLIC_ACCESS_KEY: "smoke-key" },
  stdio: ["ignore", "pipe", "pipe"],
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  await wait(900);
  const health = await fetch(`${base}/healthz?key=smoke-key`).then((response) => response.json());
  if (health.projectCustodian !== "Codex") throw new Error("projectCustodian missing from healthz");
  if (!health.codexConnectionVersion) throw new Error("codexConnectionVersion missing from healthz");
  if (health.evolutionMission !== "attiva") throw new Error("evolutionMission is not active");

  const html = await fetch(`${base}/?key=smoke-key`).then((response) => response.text());
  for (const expected of ["Stato evolutivo", "prompt-cards", "gaia-lumen-evolution-20260630"]) {
    if (!html.includes(expected)) throw new Error(`Missing ${expected} in HTML`);
  }

  const chat = await fetch(`${base}/api/chat?key=smoke-key`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message: "fai evolvere Gaia-Lumen in modo sicuro" }),
  }).then((response) => response.json());
  if (!String(chat.reply || "").includes("Codex")) throw new Error("chat did not answer as Codex");

  console.log("smoke ok");
} finally {
  child.kill();
}
