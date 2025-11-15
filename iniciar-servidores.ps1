# Script para iniciar servidores Backend y Frontend
Write-Host "================================================" -ForegroundColor Cyan
Write-Host " 🚀 INICIANDO SERVIDORES DEJO AROMAS + TRANSBANK" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar directorios
Write-Host "📋 Verificando directorios..." -ForegroundColor Yellow

if (-not (Test-Path "backend")) {
    Write-Host "❌ Error: No se encontró la carpeta backend" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

if (-not (Test-Path "frontend")) {
    Write-Host "❌ Error: No se encontró la carpeta frontend" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "✅ Directorios encontrados" -ForegroundColor Green
Write-Host ""

# Terminar procesos existentes
Write-Host "🔧 Terminando procesos existentes en puertos 3000 y 5000..." -ForegroundColor Yellow

try {
    $processes3000 = netstat -ano | Select-String ":3000" | ForEach-Object { ($_ -split '\s+')[-1] }
    $processes5000 = netstat -ano | Select-String ":5000" | ForEach-Object { ($_ -split '\s+')[-1] }
    
    foreach ($pid in $processes3000) {
        if ($pid -and $pid -ne "0") {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
    
    foreach ($pid in $processes5000) {
        if ($pid -and $pid -ne "0") {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
} catch {
    # Ignorar errores
}

Write-Host ""

# Iniciar Backend
Write-Host "🚀 Iniciando servidor BACKEND (Puerto 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start" -WindowStyle Normal

Write-Host "⏳ Esperando 5 segundos para que cargue el backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Iniciar Frontend
Write-Host ""
Write-Host "🎨 Iniciando servidor FRONTEND (Puerto 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start" -WindowStyle Normal

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host " ✅ SERVIDORES INICIÁNDOSE..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "📍 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "💡 Los servidores se abrirán en ventanas separadas" -ForegroundColor Yellow
Write-Host "💡 Para cerrarlos, cierra las ventanas o presiona Ctrl+C" -ForegroundColor Yellow
Write-Host ""
Write-Host "⏳ Esperando a que cargue el frontend..." -ForegroundColor Yellow
Write-Host "   El navegador debería abrirse automáticamente en unos segundos" -ForegroundColor Gray
Write-Host ""

Read-Host "Presiona Enter para continuar"
