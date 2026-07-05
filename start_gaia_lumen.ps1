$ErrorActionPreference = "Stop"

$site = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $site

$env:PORT = "8767"
$env:HOST = "0.0.0.0"
$env:OPENAI_CHAT_ENABLED = "disabled"
$env:PUBLIC_ACCESS_USER = "gaia"
$env:PUBLIC_ACCESS_PASS = "33d3ad00e5c04be39aaadae0237e39bbd1ea75eea8114bb28afe"
$env:PUBLIC_ACCESS_KEY = "33d3ad00e5c04be39aaadae0237e39bbd1ea75eea8114bb28afe"

node server.mjs
