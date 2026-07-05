@echo off
set "SCRIPT_DIR=%~dp0"
start "Gaia-Lumen Local AI" /min powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%start_gaia_lumen_local_ai.ps1"