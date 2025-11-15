param(
    [string]$RepoName = "jiovani-go-ecommerce",
    [string]$GitHubUser = ""
)

if ([string]::IsNullOrEmpty($GitHubUser)) {
    Write-Host "Ingresa tu usuario de GitHub:"
    $GitHubUser = Read-Host "Usuario"
}

Write-Host "Iniciando push a GitHub..." -ForegroundColor Cyan
Write-Host "Repositorio: $RepoName" -ForegroundColor Green
Write-Host "Usuario: $GitHubUser" -ForegroundColor Green
Write-Host ""

# Inicializar git si no existe
if (-not (Test-Path ".git")) {
    Write-Host "Inicializando repositorio Git..." -ForegroundColor Yellow
    git init
}

# Agregar archivos
Write-Host "Agregando archivos..." -ForegroundColor Yellow
git add .

# Crear commit
Write-Host "Creando commit..." -ForegroundColor Yellow
git commit -m "Initial commit: JiovaniGo eCommerce con integracion Transbank WebPay Plus"

# Cambiar a main
Write-Host "Preparando rama..." -ForegroundColor Yellow
git branch -M main

# Agregar remoto
$remoteUrl = "https://github.com/$GitHubUser/$RepoName.git"

# Verificar si remoto ya existe
$remoteCheck = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Remoto ya existe, actualizando..." -ForegroundColor Yellow
    git remote remove origin
}

Write-Host "Agregando remoto..." -ForegroundColor Yellow
git remote add origin $remoteUrl

# Push
Write-Host "Haciendo push a GitHub..." -ForegroundColor Cyan
Write-Host "Si pide contraseña, usa tu PERSONAL ACCESS TOKEN (no contraseña normal)" -ForegroundColor Yellow
Write-Host ""

git push -u origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "EXITO - Codigo subido a GitHub" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "URL: https://github.com/$GitHubUser/$RepoName" -ForegroundColor Green
Write-Host ""
Write-Host "SIGUIENTE: Ir a railway.app" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
