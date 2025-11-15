@echo off
echo ========================================
echo  JIOVANI GO E-COMMERCE - NGROK STARTER
echo ========================================
echo.

REM Verificar que ngrok está instalado
where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] ngrok no esta instalado.
    echo Por favor ejecuta: npm install -g ngrok
    pause
    exit /b 1
)

echo [OK] ngrok encontrado
echo.

REM Verificar que existe el archivo de configuración
if not exist "ngrok-config.yml" (
    echo [ERROR] No se encuentra ngrok-config.yml
    echo Por favor asegurate de que el archivo exista en la raiz del proyecto.
    pause
    exit /b 1
)

echo [OK] Archivo de configuracion encontrado
echo.

REM Verificar que se ha configurado el authtoken
findstr /C:"YOUR_AUTHTOKEN_HERE" ngrok-config.yml >nul
if %errorlevel% equ 0 (
    echo [ADVERTENCIA] Debes configurar tu authtoken en ngrok-config.yml
    echo.
    echo Pasos:
    echo 1. Ve a: https://dashboard.ngrok.com/get-started/your-authtoken
    echo 2. Copia tu authtoken
    echo 3. Abre ngrok-config.yml
    echo 4. Reemplaza YOUR_AUTHTOKEN_HERE con tu token
    echo 5. Guarda el archivo
    echo 6. Ejecuta este script nuevamente
    echo.
    pause
    exit /b 1
)

echo [OK] Authtoken configurado
echo.
echo ========================================
echo  INICIANDO TUNELES NGROK...
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Una vez iniciado, veras las URLs publicas.
echo Copia esas URLs y actualiza el archivo .env
echo.
echo Presiona Ctrl+C para detener ngrok
echo.

ngrok start --all --config=ngrok-config.yml
