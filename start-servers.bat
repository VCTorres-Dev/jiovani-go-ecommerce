@echo off
title Dejo Aromas - Iniciador de Servidores

echo ================================================
echo  🚀 INICIANDO SERVIDORES DEJO AROMAS + TRANSBANK
echo ================================================
echo.

echo 🔧 Terminando procesos existentes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo 🚀 Iniciando servidor BACKEND (Puerto 5000)...
start "Dejo Aromas - Backend Server" cmd /k "cd /d backend && npm start"

echo ⏳ Esperando 5 segundos...
timeout /t 5 /nobreak >nul

echo.
echo 🎨 Iniciando servidor FRONTEND (Puerto 3000)...
start "Dejo Aromas - Frontend Server" cmd /k "cd /d frontend && set PORT=3000 && npm start"

echo.
echo ================================================
echo  ✅ SERVIDORES INICIÁNDOSE...
echo ================================================
echo.
echo 📍 Backend:  http://localhost:5000
echo 📍 Frontend: http://localhost:3000
echo.
echo Los servidores se abrirán en ventanas separadas
echo Para probar la aplicación, espera unos segundos
echo y ve a: http://localhost:3000
echo.
echo Datos de prueba:
echo Email: test@test.com
echo Password: 123456
echo.
pause
