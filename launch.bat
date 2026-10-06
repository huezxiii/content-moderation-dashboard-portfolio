@echo off
setlocal
cd /d "%~dp0"
set PORT=8080

echo ======================================================================
echo  ApexTrust Operations - Content Moderation Analytics Platform
echo  Serving on: http://localhost:%PORT%
echo  Press Ctrl+C to terminate the server.
echo ======================================================================

start "" "http://localhost:%PORT%"
python -m http.server %PORT%
