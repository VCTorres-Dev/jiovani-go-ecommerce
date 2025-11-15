# ========================================
#  JIOVANI GO E-COMMERCE - NGROK STARTER
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " JIOVANI GO E-COMMERCE - NGROK STARTER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que ngrok está instalado
$ngrokInstalled = Get-Command ngrok -ErrorAction SilentlyContinue
if (-not $ngrokInstalled) {
    Write-Host "[ERROR] ngrok no esta instalado." -ForegroundColor Red
    Write-Host "Por favor ejecuta: npm install -g ngrok" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "[OK] ngrok encontrado" -ForegroundColor Green
Write-Host ""

# Verificar que existe el archivo de configuración
if (-not (Test-Path "ngrok-config.yml")) {
    Write-Host "[ERROR] No se encuentra ngrok-config.yml" -ForegroundColor Red
    Write-Host "Por favor asegurate de que el archivo exista en la raiz del proyecto." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "[OK] Archivo de configuracion encontrado" -ForegroundColor Green
Write-Host ""

# Verificar que se ha configurado el authtoken
$configContent = Get-Content "ngrok-config.yml" -Raw
if ($configContent -match "YOUR_AUTHTOKEN_HERE") {
    Write-Host "[ADVERTENCIA] Debes configurar tu authtoken en ngrok-config.yml" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Pasos:" -ForegroundColor Cyan
    Write-Host "1. Ve a: https://dashboard.ngrok.com/get-started/your-authtoken" -ForegroundColor White
    Write-Host "2. Copia tu authtoken" -ForegroundColor White
    Write-Host "3. Abre ngrok-config.yml" -ForegroundColor White
    Write-Host "4. Reemplaza YOUR_AUTHTOKEN_HERE con tu token" -ForegroundColor White
    Write-Host "5. Guarda el archivo" -ForegroundColor White
    Write-Host "6. Ejecuta este script nuevamente" -ForegroundColor White
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "[OK] Authtoken configurado" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " INICIANDO TUNELES NGROK..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Una vez iniciado, veras las URLs publicas." -ForegroundColor Yellow
Write-Host "Copia esas URLs y actualiza el archivo .env" -ForegroundColor Yellow
Write-Host ""
Write-Host "Presiona Ctrl+C para detener ngrok" -ForegroundColor Gray
Write-Host ""

# Iniciar ngrok
ngrok start --all --config=ngrok-config.yml
