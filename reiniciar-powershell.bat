@echo off
REM Reiniciar PowerShell para recargar las variables de entorno
echo.
echo Reiniciando PowerShell para recargar Git...
echo.
timeout /t 2
powershell -NoExit -Command "cd 'C:\Users\Vicente\Documents\RESPALDO PAGINA DEJO AROMAS\DA_Page - V2'; git --version"
