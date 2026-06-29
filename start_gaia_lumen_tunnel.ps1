$ErrorActionPreference = "Stop"

$site = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent (Split-Path -Parent $site)
$cloudflared = Join-Path $root "work\tools\cloudflared.exe"
$log = Join-Path $root "work\cloudflared-gaia.err.log"

if (-not (Test-Path -LiteralPath $cloudflared)) {
  throw "cloudflared.exe non trovato: $cloudflared"
}

Start-Process -WindowStyle Hidden -FilePath $cloudflared -ArgumentList @(
  "tunnel",
  "--url",
  "http://127.0.0.1:8767",
  "--no-autoupdate"
) -RedirectStandardError $log
