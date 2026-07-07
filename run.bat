@echo off
setlocal
cd /d "%~dp0"

set "PORT=8020"
set "APP_URL=http://127.0.0.1:%PORT%"

where python >nul 2>nul
if errorlevel 1 (
  where py >nul 2>nul
  if errorlevel 1 (
    echo Python is required for the local static server.
    echo You can still open index.html directly by double-clicking it.
    pause
    exit /b 1
  )
  set "PY_CMD=py -3"
) else (
  set "PY_CMD=python"
)

echo Opening portfolio at %APP_URL%
start "" "%APP_URL%"
%PY_CMD% -m http.server %PORT%
pause
