# 🔍 DIAGNÓSTICO COMPLETO: Flujo de Pagos Transbank

## Error Encontrado y Arreglado

### ❌ Problema Original
**Frontend solo capturaba `token_ws` de los parámetros de Transbank**

Cuando Transbank retorna al navegador, envía parámetros en GET a:
```
https://backend/api/payments/result?token_ws=xxx&TBK_ORDEN_COMPRA=yyy&TBK_ID_SESION=zzz
```

Pero había 4 escenarios posibles:
- **Escenario 1 (Éxito):** `token_ws=xxx`
- **Escenario 2 (Rechazo):** `token_ws=xxx` (mismo token, pero response_code ≠ 0)
- **Escenario 3 (Usuario canceló):** `TBK_TOKEN=xxx&TBK_ORDEN_COMPRA=yyy&TBK_ID_SESION=zzz` (NO hay token_ws)
- **Escenario 4 (Timeout):** `TBK_ORDEN_COMPRA=yyy&TBK_ID_SESION=zzz` (NO hay ningún token)

**El frontend solo buscaba `token_ws` → Si no estaba (casos 3 y 4), fallaba con "Token es requerido"**

---

## ✅ Solución Implementada

### Cambio 1: PaymentResult.js - Capturar todos los parámetros

**Antes:**
```javascript
const token = urlParams.get('token_ws');

if (!token) {
  setError('Token de transacción no encontrado en la URL');
  return;
}
```

**Ahora:**
```javascript
const token_ws = urlParams.get('token_ws');
const TBK_TOKEN = urlParams.get('TBK_TOKEN');
const TBK_ORDEN_COMPRA = urlParams.get('TBK_ORDEN_COMPRA');
const TBK_ID_SESION = urlParams.get('TBK_ID_SESION');

// Determinar escenario
if (token_ws) {
  confirmPayload = { token_ws };  // Escenario 1-2
} else if (TBK_TOKEN && TBK_ORDEN_COMPRA && TBK_ID_SESION) {
  confirmPayload = { TBK_TOKEN, TBK_ORDEN_COMPRA, TBK_ID_SESION };  // Escenario 3
} else if (TBK_ORDEN_COMPRA && TBK_ID_SESION) {
  confirmPayload = { TBK_ORDEN_COMPRA, TBK_ID_SESION };  // Escenario 4
}
```

### Cambio 2: paymentService.js - Aceptar múltiples formatos

**Antes:**
```javascript
export const confirmPayment = async (token) => {
  const response = await axios.post(`${PAYMENTS_API_URL}/confirm`, {
    token_ws: token  // Solo aceptaba token string
  });
}
```

**Ahora:**
```javascript
export const confirmPayment = async (tokenOrPayload, additionalParams = {}) => {
  let payload = {};
  
  if (typeof tokenOrPayload === 'string') {
    payload.token_ws = tokenOrPayload;
  } else if (typeof tokenOrPayload === 'object') {
    payload = tokenOrPayload;  // Acepta { token_ws, TBK_TOKEN, etc }
  }
  
  const response = await axios.post(`${PAYMENTS_API_URL}/confirm`, payload);
}
```

### Cambio 3: PaymentResult.js - Procesar correctamente todos los estados

**Antes:**
```javascript
if (confirmResult.success && confirmResult.data.orderId) {
  // Cargar orden
} else {
  setError(...);  // PROBLEMA: Trataba cancelled/timeout como error
}
```

**Ahora:**
```javascript
if (confirmResult.data?.orderId) {
  // Cargar orden SIEMPRE (éxito, rechazo, cancelación, timeout)
  // Todos son estados válidos, solo algunos tienen success: true
  const orderDetails = await getOrderStatus(confirmResult.data.orderId);
  setOrder(orderDetails);
} else {
  // Solo marcar error si NO hay orderId
  setError(...);
}
```

---

## 📊 Flujo Correcto Completo

### Paso 1: Usuario inicia compra
```
Frontend: POST /api/payments/init
Body: { orderItems, totalAmount, shippingInfo, userEmail }
↓
Backend: Crea orden, contacta Transbank, devuelve token
Response: { success: true, data: { token, url } }
↓
Frontend: Redirige a https://webpay.transbank.cl/api/webpay/plus/transactions/{token}
```

### Paso 2: Usuario completa/rechaza/cancela en Transbank
```
Transbank: Usuario ingresa datos o presiona "Anular"
↓
Transbank: Redirige el navegador a:
  https://backend/api/payments/result?token_ws=XXX&TBK_ORDEN_COMPRA=YYY
  O
  https://backend/api/payments/result?TBK_TOKEN=XXX&TBK_ORDEN_COMPRA=YYY&TBK_ID_SESION=ZZZ
  O
  https://backend/api/payments/result?TBK_ORDEN_COMPRA=YYY&TBK_ID_SESION=ZZZ
```

### Paso 3: Backend redirige al frontend
```
Backend: Recibe GET en /api/payments/result
↓
Backend: Extrae todos los query params
↓
Backend: Redirige a frontend:
  https://frontend/payment/result?token_ws=XXX&TBK_ORDEN_COMPRA=YYY
```

### Paso 4: Frontend procesa resultado
```
Frontend PaymentResult: Captura TODOS los parámetros
↓
Frontend: Determina escenario:
  - ¿token_ws? → Flujo normal (éxito o rechazo)
  - ¿TBK_TOKEN + TBK_ORDEN_COMPRA? → Usuario canceló
  - ¿TBK_ORDEN_COMPRA sin tokens? → Timeout
↓
Frontend: Llama confirmPayment(payload)
↓
paymentService: POST /api/payments/confirm con payload completo
```

### Paso 5: Backend confirma transacción
```
Backend confirmPayment:
↓
Extrae: { token_ws, TBK_TOKEN, TBK_ORDEN_COMPRA, TBK_ID_SESION }
↓
Detecta escenario:
  - NO token_ws + NO TBK_TOKEN + TBK_ORDEN_COMPRA → TIMEOUT
  - TBK_TOKEN + TBK_ORDEN_COMPRA → CANCELLED
  - token_ws → Consulta Transbank
    - response_code === 0 && status === 'AUTHORIZED' → APPROVED
    - response_code !== 0 → REJECTED
↓
Response: { success: boolean, data: { orderId, status, responseCode } }
```

### Paso 6: Frontend muestra resultado
```
Frontend PaymentResult:
↓
Carga orden con getOrderStatus(orderId)
↓
Llama getStatusMessage(order.status)
↓
Renderiza una de 4 pantallas:
  - completed (verde) ✅
  - failed (rojo) ❌
  - cancelled (gris) ⏹️
  - timeout (naranja) ⏱️
```

---

## 🧪 Casos de Prueba

### Test 1: Usuario completa pago (ÉXITO)
```
1. Carrito: $50.000
2. Click "Comprar"
3. Se abre formulario Transbank
4. Ingresa: VISA 4051885600446623, CVV 123, RUT 11.111.111-1, Clave 123
5. Click "Pagar"
6. Transbank redirige con: token_ws=xxx&TBK_ORDEN_COMPRA=yyy
7. Frontend captura ambos parámetros ✅
8. Backend confirma con Transbank ✅
9. response_code = 0, status = 'AUTHORIZED' ✅
10. Pantalla VERDE: "¡Pago Completado!"
11. Stock descontado ✅
12. Email enviado ✅
```

### Test 2: Banco rechaza pago (RECHAZO)
```
1. Carrito: $50.000
2. Click "Comprar"
3. Se abre formulario Transbank
4. Ingresa: MC 5186059559590568, CVV 123, RUT 11.111.111-1, Clave 123
5. Click "Pagar"
6. Transbank redirige con: token_ws=xxx&TBK_ORDEN_COMPRA=yyy
7. Frontend captura ambos parámetros ✅
8. Backend confirma con Transbank ✅
9. response_code ≠ 0 o status ≠ 'AUTHORIZED' ✅
10. Pantalla ROJA: "Pago Rechazado (Código: -1)"
11. Stock NO descontado ✅
12. Email NO enviado ✅
```

### Test 3: Usuario presiona "Anular" (CANCELACIÓN)
```
1. Carrito: $50.000
2. Click "Comprar"
3. Se abre formulario Transbank
4. Usuario presiona botón "Anular compra"
5. Transbank redirige con: TBK_TOKEN=xxx&TBK_ORDEN_COMPRA=yyy&TBK_ID_SESION=zzz
   (NOTA: NO hay token_ws)
6. Frontend captura los 3 parámetros ✅
7. Backend detecta patrón: TBK_TOKEN + TBK_ORDEN_COMPRA ✅
8. Pantalla GRIS: "Cancelaste el pago"
9. Stock NO descontado ✅
10. Email NO enviado ✅
```

### Test 4: Usuario no completa en 10 min (TIMEOUT)
```
1. Carrito: $50.000
2. Click "Comprar"
3. Se abre formulario Transbank
4. Usuario cierra la ventana o espera 10+ minutos
5. Después de timeout, Transbank redirige con: 
   TBK_ORDEN_COMPRA=yyy&TBK_ID_SESION=zzz
   (NO hay token_ws, NO hay TBK_TOKEN)
6. Frontend captura los 2 parámetros ✅
7. Backend detecta patrón: Sin tokens ✅
8. Pantalla NARANJA: "Pago Expirado"
9. Stock NO descontado ✅
10. Email NO enviado ✅
```

---

## 📋 Checklist de Verificación

Después de hacer los cambios, verifica:

- [ ] Frontend captura `token_ws`, `TBK_TOKEN`, `TBK_ORDEN_COMPRA`, `TBK_ID_SESION`
- [ ] PaymentResult.js detecta correctamente los 4 escenarios
- [ ] confirmPayment() acepta object payload, no solo string
- [ ] Backend `/confirm` recibe todos los parámetros
- [ ] Backend determina correctamente: timeout, cancelled, success, failure
- [ ] Frontend carga orden incluso si `success: false`
- [ ] Orden muestra estado correcto: completed, failed, cancelled, timeout
- [ ] Se renderiza pantalla correcta según status
- [ ] Stock se descuenta SOLO si completed
- [ ] Email se envía SOLO si completed
- [ ] Botones de acción son contextuales

---

## 🚀 Próximos Pasos

1. **Hacer push del código actualizado:**
   ```bash
   git add frontend/src/pages/PaymentResult.js
   git add frontend/src/services/paymentService.js
   git commit -m "Fix: Soportar 4 escenarios de resultado de pago desde Transbank"
   git push origin main
   ```

2. **Esperar a que Netlify redeploy (~2-3 min)**

3. **Probar los 4 casos en staging:**
   - Test ÉXITO con VISA 4051885600446623
   - Test RECHAZO con MC 5186059559590568
   - Test CANCELACIÓN presionando "Anular"
   - Test TIMEOUT esperando 10+ minutos

4. **Revisar logs:**
   - Frontend: DevTools → Console
   - Backend: Terminal o Railway dashboard
   - Verificar que todos los parámetros se capturen

---

## 📞 Debugging

Si sigue fallando:

```javascript
// Agregá logs en console del navegador:
console.log('URL completa:', window.location.href);
console.log('Query params recibidos:', {
  token_ws: urlParams.get('token_ws'),
  TBK_TOKEN: urlParams.get('TBK_TOKEN'),
  TBK_ORDEN_COMPRA: urlParams.get('TBK_ORDEN_COMPRA'),
  TBK_ID_SESION: urlParams.get('TBK_ID_SESION')
});
console.log('Payload a enviar:', confirmPayload);
```

```bash
# En backend, revisa los logs:
# Busca: "[RESULT] Query params:"
# Debe mostrar todos los parámetros de Transbank
```

---

*Actualizado: 17 de noviembre de 2025*
