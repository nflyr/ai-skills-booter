@echo off
setlocal
set "SCRIPT_DIR=%~dp0"
node "%SCRIPT_DIR%install-skills.js" %*
exit /b %ERRORLEVEL%