const targetUrl = process.env.SITE_GATEWAY_TARGET_URL || process.env.GAIA_SITE_URL || "http://127.0.0.1:8767";
const gatewayName = process.env.SITE_GATEWAY_NAME || "gaia-lumen-gateway";
const intervalMs = positiveIntEnv("SITE_GATEWAY_INTERVAL_MS", 60_000, 5_000, 3_600_000);
const timeoutMs = positiveIntEnv("SITE_GATEWAY_TIMEOUT_MS", 15_000, 1_000, 240_000);
const requireLlama = boolEnv("SITE_GATEWAY_REQUIRE_LLAMA", true);
const requireOpenaiDisabled = boolEnv("SITE_GATEWAY_REQUIRE_OPENAI_DISABLED", true);
const once = boolEnv("SITE_GATEWAY_ONCE", false);
const exitOnFail = boolEnv("SITE_GATEWAY_EXIT_ON_FAIL", false);

let stopping = false;
let exitCode = 0;

function positiveIntEnv(name, fallback, min, max) {
  const value = Number(process.env[name]);
  if (!Number.isFinite(value) || value < min) return fallback;
  return Math.min(Math.floor(value), max);
}

function boolEnv(name, fallback) {
  const value = String(process.env[name] || "").toLowerCase();
  if (["1", "on", "true", "enabled", "yes"].includes(value)) return true;
  if (["0", "off", "false", "disabled", "no"].includes(value)) return false;
  return fallback;
}

function accessKey() {
  return process.env.SITE_GATEWAY_ACCESS_KEY || process.env.PUBLIC_ACCESS_KEY || "";
}

function healthUrl() {
  const url = new URL("/healthz", targetUrl.endsWith("/") ? targetUrl : `${targetUrl}/`);
  const key = accessKey();
  if (key) url.searchParams.set("key", key);
  return url;
}

function targetLabel(url) {
  return `${url.protocol}//${url.host}${url.pathname}`;
}

function compactBridgeStatus(data) {
  const governance = data?.codexGovernance || {};
  const local = data?.localModelBridge || governance.localModelBridge || {};
  const openai = data?.openaiBridge || governance.openaiBridge || {};
  return {
    service: data?.service || null,
    chatBrain: data?.chatBrain || null,
    responseMode: governance.responseMode || null,
    openaiStatus: openai.status || null,
    localStatus: local.status || null,
    localReady: Boolean(local.ready),
    localModel: local.model || null,
    localRequired: Boolean(local.required),
    localLastError: local.lastError || null,
  };
}

function evaluate(data, responseOk) {
  const bridge = compactBridgeStatus(data);
  const issues = [];

  if (!responseOk || data?.ok !== true) issues.push("healthz-not-ok");
  if (requireLlama && bridge.chatBrain !== "llama-local") issues.push("chatBrain-not-llama-local");
  if (requireLlama && bridge.responseMode !== "llama-local") issues.push("responseMode-not-llama-local");
  if (requireLlama && bridge.localStatus !== "ready") issues.push("local-model-not-ready");
  if (requireLlama && !bridge.localReady) issues.push("local-model-ready-false");
  if (requireOpenaiDisabled && bridge.openaiStatus !== "disabled") issues.push("openai-not-disabled");

  return {
    healthy: issues.length === 0,
    issues,
    ...bridge,
  };
}

async function checkGateway() {
  const url = healthUrl();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { accept: "application/json" } });
    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      return {
        healthy: false,
        target: targetLabel(url),
        statusCode: response.status,
        error: "healthz-json-invalid",
        preview: text.slice(0, 180),
      };
    }
    return {
      target: targetLabel(url),
      statusCode: response.status,
      ...evaluate(data, response.ok),
    };
  } catch (error) {
    return {
      healthy: false,
      target: targetLabel(url),
      error: error.name === "AbortError" ? `timeout dopo ${timeoutMs} ms` : networkErrorDetail(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

function networkErrorDetail(error) {
  const parts = [];
  if (error?.message) parts.push(error.message);
  if (error?.cause?.code) parts.push(error.cause.code);
  if (error?.cause?.syscall) parts.push(error.cause.syscall);
  return [...new Set(parts)].join(": ") || "errore rete";
}

function log(event, payload) {
  console.log(JSON.stringify({
    time: new Date().toISOString(),
    gateway: gatewayName,
    event,
    ...payload,
  }));
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

process.on("SIGINT", () => { stopping = true; });
process.on("SIGTERM", () => { stopping = true; });

log("start", {
  target: targetLabel(healthUrl()),
  intervalMs,
  timeoutMs,
  requireLlama,
  requireOpenaiDisabled,
  once,
});

while (!stopping) {
  const result = await checkGateway();
  log("check", result);
  if (once) {
    exitCode = result.healthy ? 0 : 1;
    break;
  }
  if (exitOnFail && !result.healthy) {
    exitCode = 2;
    break;
  }
  await delay(intervalMs);
}

log("stop", { reason: stopping ? "signal" : "complete", exitCode });
process.exitCode = exitCode;