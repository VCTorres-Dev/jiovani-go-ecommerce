@echo off
REM Script para configurar Git y hacer push a GitHub

cd /d "C:\Users\Vicente\Documents\RESPALDO PAGINA DEJO AROMAS\DA_Page - V2"

echo.
echo ========================================
echo Configurando Git...
echo ========================================

REM Configurar nombre y email (global)
"C:\Program Files\Git\bin\git.exe" config --global user.name "VCTorres-Dev"
"C:\Program Files\Git\bin\git.exe" config --global user.email "tu_email@gmail.com"

echo Nombre configurado: VCTorres-Dev
echo.

REM Verificar si el remoto ya existe
"C:\Program Files\Git\bin\git.exe" remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo Agregando remoto origin...
    "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/VCTorres-Dev/jiovani-go-ecommerce.git
) else (
    echo Remoto origin ya existe
)

echo.
echo ========================================
echo Haciendo push a GitHub...
echo ========================================
echo.
echo IMPORTANTE:
echo - Si pide contraseña, USA TU PERSONAL ACCESS TOKEN
echo - NO uses tu contraseña normal de GitHub
echo - Obtén token en: https://github.com/settings/tokens
echo.
echo Genera un token con permisos: repo (full control)
echo.

"C:\Program Files\Git\bin\git.exe" push -u origin main

echo.
if errorlevel 0 (
    echo ========================================
    echo EXITO - Codigo subido a GitHub
    echo ========================================
    echo URL: https://github.com/VCTorres-Dev/jiovani-go-ecommerce
) else (
    echo ========================================
    echo ERROR - No se pudo hacer push
    echo ========================================
    echo Por favor verifica:
    echo 1. Tienes token personal access (no contraseña)
    echo 2. El repositorio existe en GitHub
    echo 3. Tienes permisos de escritura
)

echo.
pause
