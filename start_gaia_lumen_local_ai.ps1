$ErrorActionPreference = "Stop"

$site = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $site

$runtimeDir = Join-Path $site ".local-runtime"
$backupsDir = Join-Path $runtimeDir "backups"
New-Item -ItemType Directory -Force -Path $runtimeDir, $backupsDir | Out-Null

if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
  throw "Ollama non trovato. Installa Ollama e scarica un modello, per esempio: ollama pull llama3.2:3b"
}

$env:PORT = if ($env:PORT) { $env:PORT } else { "8767" }
$env:HOST = if ($env:HOST) { $env:HOST } else { "127.0.0.1" }
$env:STATE_PATH = if ($env:STATE_PATH) { $env:STATE_PATH } else { Join-Path $runtimeDir "neural_state.json" }
$env:BACKUPS_DIR = if ($env:BACKUPS_DIR) { $env:BACKUPS_DIR } else { $backupsDir }
$env:OPENAI_CHAT_ENABLED = "disabled"
$env:LOCAL_AI_ENABLED = "true"
$env:LOCAL_AI_BASE_URL = if ($env:LOCAL_AI_BASE_URL) { $env:LOCAL_AI_BASE_URL } else { "http://127.0.0.1:11434" }
$env:LOCAL_AI_MODEL = if ($env:LOCAL_AI_MODEL) { $env:LOCAL_AI_MODEL } else { "llama3.2:3b" }
$env:LOCAL_AI_CHAT_PATH = if ($env:LOCAL_AI_CHAT_PATH) { $env:LOCAL_AI_CHAT_PATH } else { "/api/chat" }
$env:LOCAL_AI_TIMEOUT_MS = if ($env:LOCAL_AI_TIMEOUT_MS) { $env:LOCAL_AI_TIMEOUT_MS } else { "120000" }
$env:LOCAL_AI_MAX_OUTPUT_TOKENS = if ($env:LOCAL_AI_MAX_OUTPUT_TOKENS) { $env:LOCAL_AI_MAX_OUTPUT_TOKENS } else { "700" }
$env:LOCAL_AI_CONTEXT_CHARS = if ($env:LOCAL_AI_CONTEXT_CHARS) { $env:LOCAL_AI_CONTEXT_CHARS } else { "6000" }

Write-Host "Gaia-Lumen local AI: http://127.0.0.1:$($env:PORT)/"
Write-Host "Modello locale: $($env:LOCAL_AI_MODEL) via $($env:LOCAL_AI_BASE_URL)$($env:LOCAL_AI_CHAT_PATH)"
node server.mjs