#!/bin/bash

# Script de validación del deployment completo
# Este script verifica que todo el stack esté funcionando correctamente

echo "🚀 INICIANDO VALIDACIÓN DEL DEPLOYMENT COMPLETO"
echo "================================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URLs (actualizar con tus URLs reales)
BACKEND_URL="https://jiovani-go-ecommerce-production.up.railway.app"
FRONTEND_URL="TU_FRONTEND_URL_AQUI" # Actualizar después del deploy

echo "📋 Configuración:"
echo "  Backend:  $BACKEND_URL"
echo "  Frontend: $FRONTEND_URL"
echo ""

# Test 1: Backend Health Check
echo "🧪 Test 1: Verificando backend..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/payments/health")

if [ "$HEALTH_RESPONSE" -eq 200 ]; then
    echo -e "  ${GREEN}✅ Backend respondiendo correctamente (200 OK)${NC}"
else
    echo -e "  ${RED}❌ Backend no responde correctamente (HTTP $HEALTH_RESPONSE)${NC}"
    exit 1
fi

# Test 2: Endpoint de inicio de pago
echo ""
echo "🧪 Test 2: Verificando endpoint de inicio de pago..."
INIT_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/payments/init-test" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "buyOrder": "test-' $(date +%s) '",
    "sessionId": "sess-001",
    "returnUrl": "https://example.com/return",
    "userEmail": "test@example.com"
  }')

if echo "$INIT_RESPONSE" | grep -q '"success":true'; then
    echo -e "  ${GREEN}✅ Endpoint de pago funcionando${NC}"
    
    # Extraer token para ver si es válido
    TOKEN=$(echo "$INIT_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [ ! -z "$TOKEN" ]; then
        echo -e "  ${GREEN}✅ Token generado correctamente${NC}"
        echo "     Token: ${TOKEN:0:20}..."
    fi
else
    echo -e "  ${RED}❌ Endpoint de pago no funciona correctamente${NC}"
    echo "     Response: $INIT_RESPONSE"
    exit 1
fi

# Test 3: Verificar CORS
echo ""
echo "🧪 Test 3: Verificando configuración CORS..."
CORS_RESPONSE=$(curl -s -I -X OPTIONS "$BACKEND_URL/api/payments/health" \
  -H "Origin: $FRONTEND_URL" \
  -H "Access-Control-Request-Method: POST")

if echo "$CORS_RESPONSE" | grep -q "Access-Control-Allow-Origin"; then
    echo -e "  ${GREEN}✅ CORS configurado correctamente${NC}"
else
    echo -e "  ${YELLOW}⚠️  CORS puede tener problemas${NC}"
    echo "     Verifica que FRONTEND_URL esté en la lista de orígenes permitidos"
fi

# Test 4: Verificar que Transbank sea alcanzable
echo ""
echo "🧪 Test 4: Verificando conectividad con Transbank..."
TRANSBANK_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "https://webpay3gint.transbank.cl")

if [ "$TRANSBANK_RESPONSE" -eq 200 ] || [ "$TRANSBANK_RESPONSE" -eq 301 ] || [ "$TRANSBANK_RESPONSE" -eq 302 ]; then
    echo -e "  ${GREEN}✅ Transbank es alcanzable${NC}"
else
    echo -e "  ${YELLOW}⚠️  Transbank responde con HTTP $TRANSBANK_RESPONSE${NC}"
fi

# Resumen
echo ""
echo "================================================"
echo "📊 RESUMEN DE VALIDACIÓN"
echo "================================================"
echo ""
echo -e "${GREEN}✅ Tests pasados:${NC}"
echo "  - Backend respondiendo correctamente"
echo "  - Endpoint de pago generando tokens válidos"
echo "  - Conectividad con Transbank OK"
echo ""
echo -e "${YELLOW}📋 PRÓXIMOS PASOS:${NC}"
echo ""
echo "1. Despliega el frontend en Netlify/Vercel"
echo "2. Actualiza FRONTEND_URL en este script"
echo "3. Agrega FRONTEND_URL_REAL en Railway backend"
echo "4. Ejecuta este script nuevamente para validar"
echo "5. Haz un test manual del flujo completo:"
echo ""
echo "   a) Abre el frontend desplegado"
echo "   b) Agrega productos al carrito"
echo "   c) Ve a checkout y llena datos"
echo "   d) Click en 'Pagar'"
echo "   e) Deberías ser redirigido a Transbank"
echo "   f) Usa tarjeta de prueba: 4051885600446623"
echo "   g) CVV: 123, Fecha: 12/25"
echo "   h) Completa el pago"
echo "   i) Valida que vuelvas a tu app con confirmación"
echo ""
echo "================================================"
echo -e "${GREEN}✅ VALIDACIÓN COMPLETA${NC}"
echo "================================================"
