$ErrorActionPreference = "Stop"

$site = Split-Path -Parent $MyInvocation.MyCommand.Path
$script = Join-Path $site "start_gaia_lumen.ps1"
$taskName = "Gaia-Lumen-Nido"
$action = "powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$script`""

schtasks /Create /SC ONLOGON /TN $taskName /TR $action /F
schtasks /Query /TN $taskName
