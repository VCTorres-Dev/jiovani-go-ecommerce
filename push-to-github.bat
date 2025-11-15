@echo off
REM Script para subir a GitHub
setlocal enabledelayedexpansion

cd /d "C:\Users\Vicente\Documents\RESPALDO PAGINA DEJO AROMAS\DA_Page - V2"

echo.
echo ========================================
echo Inicializando Git...
echo ========================================
"C:\Program Files\Git\bin\git.exe" init

echo.
echo Agregando archivos...
"C:\Program Files\Git\bin\git.exe" add .

echo.
echo Creando commit...
"C:\Program Files\Git\bin\git.exe" commit -m "Initial commit: JiovaniGo eCommerce con integracion Transbank"

echo.
echo Cambiando a rama main...
"C:\Program Files\Git\bin\git.exe" branch -M main

echo.
echo Agregando remoto de GitHub...
"C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/VCTorres-Dev/jiovani-go-ecommerce.git

echo.
echo ========================================
echo Haciendo push a GitHub...
echo ========================================
echo.
echo Si pide usuario/contraseña:
echo Usuario: VCTorres-Dev
echo Contraseña: Tu Personal Access Token (no contraseña normal)
echo.
echo Obtén uno en: https://github.com/settings/tokens
echo.

"C:\Program Files\Git\bin\git.exe" push -u origin main

echo.
echo ========================================
echo LISTO - Codigo subido a GitHub
echo ========================================
echo URL: https://github.com/VCTorres-Dev/jiovani-go-ecommerce
echo.
pause
