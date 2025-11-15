#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script para subir el proyecto JiovaniGo a GitHub automáticamente
.DESCRIPTION
    Automatiza: git init, add, commit, remote add, branch rename, push
.PARAMETER RepoName
    Nombre del repositorio en GitHub (ej: jiovani-go-ecommerce)
.PARAMETER GitHubUser
    Usuario de GitHub (ej: tu_usuario)
.PARAMETER CommitMessage
    Mensaje del primer commit
#>

param(
    [string]$RepoName = "jiovani-go-ecommerce",
    [string]$GitHubUser = "",
    [string]$CommitMessage = "Initial commit: JiovaniGo eCommerce con integración Transbank WebPay Plus"
)

# Colores para output
$SuccessColor = "Green"
$ErrorColor = "Red"
$InfoColor = "Cyan"
$WarningColor = "Yellow"

function Write-Success {
    param([string]$Message)
    Write-Host "[OK] $Message" -ForegroundColor $SuccessColor
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $ErrorColor
}

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $InfoColor
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $WarningColor
}

# Verificar que estamos en el directorio correcto
Write-Info "Verificando directorio actual..."
$currentPath = Get-Location
Write-Host "📁 Ruta: $currentPath" -ForegroundColor $InfoColor

if (-not (Test-Path "backend" -PathType Container)) {
    Write-Error-Custom "No se encontró carpeta 'backend'. ¿Estás en la raíz del proyecto?"
    exit 1
}

Write-Success "Carpeta 'backend' encontrada"

# Pedir datos si no se proporcionan
if ([string]::IsNullOrEmpty($GitHubUser)) {
    Write-Info "¿Cuál es tu usuario de GitHub?"
    $GitHubUser = Read-Host "Usuario"
    
    if ([string]::IsNullOrEmpty($GitHubUser)) {
        Write-Error-Custom "Usuario de GitHub es requerido"
        exit 1
    }
}

Write-Success "Usuario GitHub: $GitHubUser"
Write-Success "Nombre repositorio: $RepoName"

# PASO 1: Verificar si git ya está inicializado
if (Test-Path ".git" -PathType Container) {
    Write-Warning-Custom "Git ya está inicializado en este directorio"
    $continue = Read-Host "¿Deseas continuar? (s/n)"
    if ($continue -ne "s") {
        Write-Info "Operación cancelada"
        exit 0
    }
} else {
    Write-Info "Inicializando repositorio Git..."
    git init
    Write-Success "Repositorio Git inicializado"
}

# PASO 2: Agregar archivos
Write-Info "Agregando archivos al staging..."
git add .
Write-Success "Archivos agregados"

# PASO 3: Crear commit
Write-Info "Creando primer commit..."
git commit -m $CommitMessage
if ($LASTEXITCODE -eq 0) {
    Write-Success "Commit creado: '$CommitMessage'"
} else {
    Write-Warning-Custom "El commit puede no haber sido creado (¿ya existe?)"
}

# PASO 4: Cambiar rama a main
Write-Info "Cambiando rama a 'main'..."
git branch -M main
Write-Success "Rama renombrada a 'main'"

# PASO 5: Agregar remoto
$remoteUrl = "https://github.com/$GitHubUser/$RepoName.git"
Write-Info "Agregando remoto: $remoteUrl"

# Verificar si remoto ya existe
$remoteExists = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Warning-Custom "Remoto 'origin' ya existe: $remoteExists"
    $update = Read-Host "¿Actualizarlo a la nueva URL? (s/n)"
    if ($update -eq "s") {
        git remote remove origin
        Write-Info "Remoto anterior eliminado"
    } else {
        Write-Info "Usando remoto existente"
        $remoteUrl = $remoteExists
    }
}

if (-not $remoteExists -or $update -eq "s") {
    git remote add origin $remoteUrl
    Write-Success "Remoto 'origin' agregado: $remoteUrl"
}

# PASO 6: Hacer push
Write-Info "Haciendo push a GitHub (esto puede tomar un tiempo)..."
Write-Warning-Custom "Si pide credenciales:"
Write-Host "  1. Usuario: $GitHubUser"
Write-Host "  2. Contraseña: Token de acceso personal (no tu contraseña normal)"
Write-Host "     Obtén uno en: https://github.com/settings/tokens"
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Success "¡Push completado exitosamente!"
    Write-Host ""
    Write-Info "Tu repositorio está en: https://github.com/$GitHubUser/$RepoName"
} else {
    Write-Error-Custom "Error durante el push. Verifica:"
    Write-Host "  1. ¿Existe el repositorio en GitHub?"
    Write-Host "  2. ¿Son correctas tus credenciales?"
    Write-Host "  3. ¿Tiene permisos de escritura?"
    exit 1
}

# Resumen final
Write-Host ""
Write-Host "========================================" -ForegroundColor $SuccessColor
Write-Host "OK - CODIGO SUBIDO A GITHUB CON EXITO" -ForegroundColor $SuccessColor
Write-Host "========================================" -ForegroundColor $SuccessColor
Write-Host "Repositorio: $RepoName" -ForegroundColor $SuccessColor
Write-Host "URL: https://github.com/$GitHubUser/$RepoName" -ForegroundColor $SuccessColor
Write-Host ""
Write-Host "SIGUIENTE: Crear proyecto en Railway.app" -ForegroundColor $SuccessColor
Write-Host "Instrucciones en: RAILWAY_DEPLOYMENT_GUIDE.md" -ForegroundColor $SuccessColor
Write-Host "========================================" -ForegroundColor $SuccessColor
