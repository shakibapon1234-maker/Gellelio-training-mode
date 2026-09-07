@echo off
setlocal
cd /d "%~dp0android"
call gradlew.bat assembleDebug
if errorlevel 1 exit /b 1
copy /Y app\build\outputs\apk\debug\app-debug.apk ..\Gellelio-Galileo-Training-debug.apk
echo APK created: Gellelio-Galileo-Training-debug.apk
