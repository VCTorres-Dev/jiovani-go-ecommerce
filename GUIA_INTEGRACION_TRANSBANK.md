# 🏦 GUÍA COMPLETA: Integración Transbank WebPay Plus

## 📌 SITUACIÓN ACTUAL (15 Nov 2025)

**Backend en Railway:** ✅ Funcionando
- URL: `https://jiovani-go-ecommerce-production.up.railway.app`
- Endpoints MOCK: ✅ Listos para testing
- Endpoints REALES: ⏳ Esperando credenciales de Transbank

**Frontend:** ❌ No existe aún
**Base de datos:** ⚠️ MongoDB conectado pero sin datos

---

## 🎯 PLAN PARA TERMINAR (REALISTA)

### **FASE 1: Validar Flujo MOCK Completo** (30 min)
**Objetivo:** Probar que el backend responde correctamente sin credenciales reales

#### Paso 1: POST a `/api/payments/init-mock`
```bash
POST https://jiovani-go-ecommerce-production.up.railway.app/api/payments/init-mock
Content-Type: application/json

{
  "amount": 10000,
  "buyOrder": "pedido-001",
  "sessionId": "sesion-001",
  "returnUrl": "https://tudominio.com/pago-exitoso",
  "userEmail": "cliente@example.com"
}
```

**Respuesta esperada (200 OK):**
```json
{
  "success": true,
  "message": "Transacción iniciada correctamente (MOCK - sin credenciales reales)",
  "data": {
    "url": "https://webpay3gint.transbank.cl/webpay/v1.3/TOKEN_AQUI",
    "token": "TOKEN_AQUI",
    "transactionId": "pedido-001",
    "userEmail": "cliente@example.com",
    "amount": 10000,
    "environment": "mock-integration"
  }
}
```

#### Paso 2: POST a `/api/payments/confirm-mock` con el token recibido
```bash
POST https://jiovani-go-ecommerce-production.up.railway.app/api/payments/confirm-mock
Content-Type: application/json

{
  "token": "TOKEN_DEL_PASO_1"
}
```

**Respuesta esperada (200 OK):**
```json
{
  "success": true,
  "message": "Pago confirmado exitosamente (MOCK)",
  "data": {
    "accountingDate": "2025-11-15",
    "transactionDate": "2025-11-15T...",
    "status": "AUTHORIZED",
    "amount": 10000,
    "cardNumber": "****6623"
  }
}
```

**Si ambos pasos funcionan → ✅ Backend listo**

---

### **FASE 2: Crear Frontend React** (2-3 horas)
**Objetivo:** UI que conecte con el backend

#### Estructura mínima del formulario de pago:
```javascript
// frontend/src/pages/Checkout.jsx

import React, { useState } from 'react';

export default function Checkout() {
  const [formData, setFormData] = useState({
    amount: 10000,
    buyOrder: 'pedido-' + Date.now(),
    sessionId: 'sesion-' + Date.now(),
    returnUrl: window.location.origin + '/pago-exitoso',
    userEmail: 'cliente@example.com'
  });
  
  const handleInitPayment = async () => {
    try {
      // CAMBIAR A: /api/payments/init-mock PARA TESTING
      // CAMBIAR A: /api/payments/init-test PARA PRODUCCIÓN CON CREDENCIALES REALES
      const response = await fetch(
        'https://jiovani-go-ecommerce-production.up.railway.app/api/payments/init-mock',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        }
      );
      
      const result = await response.json();
      
      if (result.success) {
        // Redirigir a Transbank
        window.location.href = result.data.url;
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Error iniciando pago: ' + error.message);
    }
  };
  
  const handleConfirmPayment = async (token) => {
    try {
      const response = await fetch(
        'https://jiovani-go-ecommerce-production.up.railway.app/api/payments/confirm-mock',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        }
      );
      
      const result = await response.json();
      
      if (result.success) {
        alert('¡Pago confirmado! ' + result.data.status);
      }
    } catch (error) {
      alert('Error confirmando: ' + error.message);
    }
  };
  
  return (
    <div>
      <h1>Checkout - Pago con Transbank</h1>
      <button onClick={handleInitPayment}>
        Iniciar Pago: ${formData.amount}
      </button>
    </div>
  );
}
```

---

### **FASE 3: Deploy Frontend en Railway** (30 min)
1. Crear nuevo servicio en Railway
2. Conectar repo GitHub
3. Set root directory: `frontend/`
4. Build: `npm run build`
5. Start: `npm start`
6. Configure env var: `REACT_APP_API_URL=https://jiovani-go-ecommerce-production.up.railway.app`

---

### **FASE 4: Transición a Credenciales REALES** (Paralelo, 24-48h de espera)

#### Paso 1: Solicitar afiliación en Transbank
1. Ve a: https://publico.transbank.cl
2. Rellena formulario como "Integrador de Comercio"
3. Elige: WebPay Plus
4. Completa datos de tu universidad/institución

#### Paso 2: Espera aprobación (24-48 horas)
Transbank te enviará por email:
- **Commerce Code:** número de 12 dígitos
- **API Key Secret:** cadena larga (similar a la DEMO)

#### Paso 3: Actualizar credenciales en Railway
En Railway dashboard → Environment Variables:
```
TRANSBANK_COMMERCE_CODE=TU_CODE_REAL
TRANSBANK_API_KEY=TU_KEY_REAL
TRANSBANK_ENV=TEST  (mantener en TEST hasta validación)
```

#### Paso 4: Cambiar endpoint en frontend
```javascript
// Cambiar de:
const url = '/api/payments/init-mock';
// a:
const url = '/api/payments/init-test';
```

#### Paso 5: Testing con tarjetas DEMO de Transbank
```
VISA APROBADA:
- Número: 4051 8856 0044 6623
- RUT: 11.111.111-1
- Clave: 123

VISA RECHAZADA:
- Número: 5186 0595 5959 0568
- RUT: 11.111.111-1
- Clave: 123
```

#### Paso 6: Validación formal ante Transbank
Cuando todo funcione:
1. Ve a: https://form.typeform.com/to/ibXdg6Av
2. Reporta que la integración funciona
3. Proporciona URL de tu app
4. Transbank valida y aprueba para PRODUCCIÓN

---

## 📊 ENDPOINTS DISPONIBLES

### **PARA TESTING (MOCK - SIN CREDENCIALES)**
```
POST /api/payments/init-mock
→ Devuelve URL y token simulados

POST /api/payments/confirm-mock
→ Confirma pago simulado
```

### **PARA PRODUCCIÓN (REALES - CON CREDENCIALES)**
```
POST /api/payments/init-test
→ Crea transacción en Transbank (requiere Commerce Code + API Key)

POST /api/payments/confirm
→ Confirma transacción real en Transbank
```

---

## ⚠️ CONSIDERACIONES IMPORTANTES

### **1. CORS**
Si el frontend corre en diferente dominio:
- ✅ Ya configurado en backend
- Solo asegura que `FRONTEND_URL` esté en env vars

### **2. MongoDB**
- Actualmente no conecta (IP whitelist issue)
- **Para university project NO es crítico** si solo testeas pagos
- Si necesitas guardar pedidos: Configurar IP whitelist en MongoDB Atlas

### **3. Seguridad**
⚠️ **IMPORTANTE:** El API Key SECRET nunca debe estar en el frontend:
- ✅ Backend es quien hace el call a Transbank (CORRECTO)
- Frontend solo recibe token
- Token se devuelve a Transbank para confirmar

### **4. Producción Real**
Cuando pases a PRODUCCIÓN (no MOCK):
1. Transbank cambia host a: `webpay3g.transbank.cl` (automático con env var)
2. Credenciales deben ser reales (no las DEMO)
3. Tarjetas DEMO no funcionan (solo tarjetas reales)

---

## 🚀 TIMELINE REALISTA

| Fase | Tarea | Tiempo | Bloqueante |
|------|-------|--------|-----------|
| 1 | Validar MOCK en Postman | 30 min | ❌ No |
| 2 | Crear frontend React | 2-3h | ⚠️ Sí |
| 3 | Deploy frontend | 30 min | ⚠️ Sí |
| 4 | Solicitar credenciales | 5 min | ⏳ Espera 24-48h |
| 5 | Testing con credenciales | 1h | ⏳ Después paso 4 |
| 6 | Validación Transbank | 5 min | ⏳ Espera 24h |
| **TOTAL** | | **5-7h + espera** | |

---

## ✅ CHECKLIST FINAL

### Antes de entregar a la universidad:
- [ ] POST a `/api/payments/init-mock` devuelve 200 OK
- [ ] POST a `/api/payments/confirm-mock` devuelve 200 OK
- [ ] Frontend existe y conecta al backend
- [ ] Frontend redirige a Transbank (MOCK)
- [ ] Retorno de Transbank se procesa correctamente
- [ ] Código está en GitHub y funciona en Railway
- [ ] Documentación incluida en README

### Extras (si tiempo):
- [ ] Credenciales reales solicitadas a Transbank
- [ ] Testing con tarjetas DEMO reales
- [ ] Validación formal ante Transbank completada
- [ ] Base de datos guarda transacciones

---

## 📞 SOPORTE TRANSBANK

- **Chat en vivo:** https://publico.transbank.cl (esquina inferior derecha)
- **Email:** integradores@transbank.cl
- **Documentación SDK:** https://github.com/TransbankDevelopers/transbank-sdk-nodejs

---

**Última actualización:** 15 de Noviembre de 2025
**Estado Backend:** ✅ LISTO
**Siguiente paso:** Crear Frontend React
