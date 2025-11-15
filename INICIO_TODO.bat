@echo off
REM Script para iniciar todo de forma correcta

cls
color 0A

echo ========================================
echo  INICIANDO NGROK + BACKEND + FRONTEND
echo ========================================
echo.

REM Verificar que estamos en la raiz
if not exist "ngrok-config.yml" (
    echo [ERROR] ngrok-config.yml no encontrado
    echo Asegúrate de estar en la raíz del proyecto
    pause
    exit /b 1
)

echo [1/3] Iniciando ngrok...
start "ngrok" cmd /k "ngrok start --all --config=ngrok-config.yml"

timeout /t 3

echo [2/3] Iniciando backend en puerto 5000...
start "backend" cmd /k "cd backend && npm start"

timeout /t 3

echo [3/3] Iniciando frontend en puerto 3000...
start "frontend" cmd /k "cd frontend && npm start"

timeout /t 3

echo.
echo ========================================
echo  TODO INICIADO
echo ========================================
echo.
echo Instrucciones:
echo 1. En la ventana de ngrok, copia la URL del FRONTEND (https://xxxxx.ngrok.io)
echo 2. Edita backend\.env
echo 3. Actualiza: FRONTEND_URL=https://xxxxx.ngrok.io
echo 4. Reinicia el backend (Ctrl+C en su ventana, luego npm start)
echo 5. Abre navegador en: https://xxxxx.ngrok.io
echo.
pause
