@echo off
REM Auto Git Push Script
REM Se ejecuta todo automáticamente con token

setlocal enabledelayedexpansion

cd /d "C:\Users\Vicente\Documents\RESPALDO PAGINA DEJO AROMAS\DA_Page - V2"

echo.
echo ========================================
echo CONFIGURANDO GIT AUTOMATICAMENTE
echo ========================================
echo.

echo [1/4] Configurando nombre...
"C:\Program Files\Git\bin\git.exe" config --global user.name "VCTorres-Dev"
echo OK

echo.
echo [2/4] Configurando email...
"C:\Program Files\Git\bin\git.exe" config --global user.email "vctorres.dev@gmail.com"
echo OK

echo.
echo [3/4] Verificando estado de Git...
"C:\Program Files\Git\bin\git.exe" status

echo.
echo [4/4] Preparando push a GitHub...
"C:\Program Files\Git\bin\git.exe" remote remove origin 2>nul
"C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/VCTorres-Dev/jiovani-go-ecommerce.git

echo.
echo ========================================
echo HACIENDO PUSH A GITHUB
echo ========================================
echo.

REM Hacer push usando el token en la URL
set GIT_ASKPASS_OVERRIDE=true
"C:\Program Files\Git\bin\git.exe" push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo EXITO - CODIGO SUBIDO A GITHUB
    echo ========================================
    echo.
    echo Tu repositorio esta en:
    echo https://github.com/VCTorres-Dev/jiovani-go-ecommerce
    echo.
    echo SIGUIENTE: Ir a https://railway.app
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR DURANTE EL PUSH
    echo ========================================
    echo Verifica los mensajes arriba para detalles
    echo.
)

pause
