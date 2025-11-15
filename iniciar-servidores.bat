@echo off
echo ================================================
echo  🚀 INICIANDO SERVIDORES DEJO AROMAS + TRANSBANK
echo ================================================
echo.

echo 📋 Verificando directorios...

if not exist "backend" (
    echo ❌ Error: No se encontró la carpeta backend
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Error: No se encontró la carpeta frontend
    pause
    exit /b 1
)

echo ✅ Directorios encontrados

echo.
echo 🔧 Terminando procesos existentes en puertos 3000 y 5000...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr :3000') do taskkill /PID %%p /F 2>nul
for /f "tokens=5" %%p in ('netstat -ano ^| findstr :5000') do taskkill /PID %%p /F 2>nul

echo.
echo 🚀 Iniciando servidor BACKEND (Puerto 5000)...
start "Backend Server" cmd /k "cd backend && npm start"

echo ⏳ Esperando 5 segundos para que cargue el backend...
timeout /t 5 /nobreak > nul

echo.
echo 🎨 Iniciando servidor FRONTEND (Puerto 3000)...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo ================================================
echo  ✅ SERVIDORES INICIÁNDOSE...
echo ================================================
echo.
echo 📍 Backend:  http://localhost:5000
echo 📍 Frontend: http://localhost:3000
echo.
echo 💡 Los servidores se abrirán en ventanas separadas
echo 💡 Para cerrarlos, cierra las ventanas o presiona Ctrl+C
echo.
echo ⏳ Esperando a que cargue el frontend...
echo    El navegador debería abrirse automáticamente en unos segundos
echo.
pause
