#!/bin/bash
# Script para hacer push de los cambios al flujo de pagos

# Variables
PROYECTO_DIR="c:\Users\Vicente\Documents\RESPALDO PAGINA DEJO AROMAS\DA_Page - V2"

# Cambiar a directorio del proyecto
cd "$PROYECTO_DIR" || exit 1

# Ver estado actual
echo "===================================="
echo "📊 Estado de Git:"
echo "===================================="
git status

echo ""
echo "===================================="
echo "📝 Cambios a realizar:"
echo "===================================="

# Agregar archivos modificados
echo "✅ Agregando PaymentResult.js..."
git add frontend/src/pages/PaymentResult.js

echo "✅ Agregando paymentService.js..."
git add frontend/src/services/paymentService.js

echo "✅ Agregando DIAGNOSTICO_FLUJO_PAGOS.md..."
git add DIAGNOSTICO_FLUJO_PAGOS.md

echo ""
echo "===================================="
echo "📋 Commit:"
echo "===================================="

# Hacer commit
git commit -m "Fix: Soportar múltiples escenarios de retorno de Transbank

- PaymentResult.js: Captura token_ws, TBK_TOKEN, TBK_ORDEN_COMPRA, TBK_ID_SESION
- PaymentResult.js: Detecta automáticamente 4 casos (éxito, rechazo, cancelación, timeout)
- paymentService.js: confirmPayment() acepta payload completo (no solo string token)
- PaymentResult.js: Carga orden incluso si success=false (cancelled/timeout son válidos)
- Agregado: DIAGNOSTICO_FLUJO_PAGOS.md con guía completa de troubleshooting"

echo ""
echo "===================================="
echo "🚀 Push a GitHub:"
echo "===================================="

# Hacer push
git push origin main

echo ""
echo "===================================="
echo "✅ ¡Listo! Railway y Netlify van a redeploy automáticamente"
echo "===================================="
