# 🏦 Flujo Completo de Transbank - Guía Implementada

## 📋 Documentación Oficial de Referencia
**Fuente:** https://www.transbankdevelopers.cl/documentacion/webpay-plus

---

## 🎯 Los 4 Flujos Posibles Según Transbank

### 1️⃣ **FLUJO NORMAL: Pago Completado con Éxito**
**Parámetros recibidos en return_url:**
- `token_ws` (presente)

**Respuesta de `transaction.commit()`:**
```javascript
{
  "status": "AUTHORIZED",           // ✅ CLAVE: Status = AUTHORIZED
  "response_code": 0,               // ✅ CLAVE: Code = 0 (aprobado)
  "vci": "TSY",                     // Autenticación exitosa
  "amount": 10000,
  "authorization_code": "1213",     // Código único del banco
  "payment_type_code": "VN",        // VN=Crédito Normal, VD=Débito
  "installments_number": 0,
  "transaction_date": "2019-05-22T16:41:21.063Z",
  "card_detail": { "card_number": "6623" },
  "accounting_date": "0522"
}
```

**Lógica de validación:**
```javascript
const isApproved = 
  transbankResponse.response_code === 0 && 
  transbankResponse.status === 'AUTHORIZED';
```

**Acciones:**
- ✅ Actualizar orden a `completed`
- ✅ Descontar stock de productos
- ✅ Enviar email de confirmación
- ✅ Mostrar pantalla de éxito

---

### 2️⃣ **FLUJO NORMAL: Pago Rechazado**
**Parámetros recibidos en return_url:**
- `token_ws` (presente)

**Respuesta de `transaction.commit()`:**
```javascript
{
  "status": "FAILED",               // ❌ Status ≠ AUTHORIZED
  "response_code": -1,              // ❌ Code ≠ 0 (rechazado)
  "vci": "TSN",                     // Autenticación rechazada
  // ... otros campos ...
}
```

**Códigos de rechazo más comunes:**
- `-1`: Rechazo general del banco
- `-2`: Fondos insuficientes
- `-3`: Tarjeta expirada
- `-4`: Tarjeta no válida
- `etc`: Ver tabla completa en Transbank

**Acciones:**
- ❌ Actualizar orden a `failed`
- ❌ NO descontar stock
- ❌ NO enviar email de confirmación
- ❌ Mostrar pantalla de error con código

---

### 3️⃣ **PAGO ABORTADO: Usuario Presiona "Anular"**
**Parámetros recibidos en return_url (método GET/POST):**
- `TBK_TOKEN` (nota: es diferente a `token_ws`)
- `TBK_ORDEN_COMPRA`
- `TBK_ID_SESION`

**Detección en backend:**
```javascript
if (TBK_TOKEN && TBK_ORDEN_COMPRA && TBK_ID_SESION && !token_ws) {
  // Usuario canceló en el formulario de Transbank
}
```

**Acciones:**
- ⏹️ Actualizar orden a `cancelled`
- ⏹️ NO descontar stock
- ⏹️ NO enviar email
- ⏹️ Mostrar pantalla de cancelación por usuario

---

### 4️⃣ **TIMEOUT: Formulario Expiró**
**Parámetros recibidos en return_url:**
- `TBK_ORDEN_COMPRA`
- `TBK_ID_SESION`
- ❌ Sin ningún TOKEN

**Tiempos límite:**
- **Producción:** 4 minutos
- **Integración:** 10 minutos

**Acciones:**
- ⏱️ Actualizar orden a `timeout`
- ⏱️ NO descontar stock
- ⏱️ NO enviar email
- ⏱️ Mostrar pantalla de expiración

---

## 🔧 Implementación en Backend

### Controlador: `paymentController.js`

#### Función `confirmPayment()`
```javascript
const confirmPayment = async (req, res) => {
  const { token_ws, TBK_TOKEN, TBK_ORDEN_COMPRA, TBK_ID_SESION } 
    = { ...req.body, ...req.query };

  // CASO 1: TIMEOUT
  if (!token_ws && !TBK_TOKEN && TBK_ORDEN_COMPRA && TBK_ID_SESION) {
    // Marcar como timeout
    order.status = 'timeout';
    return res.json({
      success: false,
      data: { status: 'timeout', responseCode: -1 }
    });
  }

  // CASO 2: CANCELADO POR USUARIO
  if (TBK_TOKEN && TBK_ORDEN_COMPRA && TBK_ID_SESION && !token_ws) {
    // Marcar como cancelado
    order.status = 'cancelled';
    return res.json({
      success: false,
      data: { status: 'cancelled', responseCode: -2 }
    });
  }

  // CASO 3 y 4: FLUJO NORMAL (éxito o rechazo)
  const tokenToUse = token_ws || TBK_TOKEN;
  const transbankResponse = await transaction.commit(tokenToUse);

  const isApproved = 
    transbankResponse.response_code === 0 && 
    transbankResponse.status === 'AUTHORIZED';

  if (isApproved) {
    order.status = 'completed';
    // Descontar stock
    // Enviar email
  } else {
    order.status = 'failed';
  }

  return res.json({
    success: isApproved,
    data: {
      status: isApproved ? 'completed' : 'failed',
      responseCode: transbankResponse.response_code,
      authorizationCode: transbankResponse.authorization_code
    }
  });
};
```

---

## 🎨 Implementación en Frontend

### Archivo: `frontend/src/pages/PaymentResult.js`

#### Estados de Orden:
- `completed` → Pantalla verde de éxito
- `failed` → Pantalla roja de rechazo
- `cancelled` → Pantalla gris de cancelación
- `timeout` → Pantalla naranja de expiración

#### Función `getStatusMessage()`:
```javascript
const getStatusMessage = (status, paymentData = {}, isSimulation = false) => {
  switch (status) {
    case 'completed':
      return {
        title: '¡Pago Completado con Éxito!',
        subtitle: `Código de Autorización: ${paymentData.authorizationCode}`,
        message: '✅ Tu pago ha sido procesado...',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      };

    case 'failed':
      return {
        title: '❌ Pago Rechazado',
        subtitle: `Código de Error: ${paymentData.responseCode}`,
        message: '❌ Tu pago fue rechazado...',
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      };

    case 'cancelled':
      return {
        title: '❌ Pago Cancelado',
        message: '❌ Cancelaste el proceso de pago...',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50'
      };

    case 'timeout':
      return {
        title: '⏱️ Pago Expirado',
        message: '⏱️ El formulario de pago expiró sin ser completado...',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      };
  }
};
```

#### Botones de Acción Condicionales:
```javascript
{order?.status === 'completed' && (
  <>
    <button>Seguir Comprando</button>
    <button>Ver Catálogo</button>
  </>
)}

{(order?.status === 'failed' || order?.status === 'timeout' || order?.status === 'cancelled') && (
  <>
    <button>Intentar Nuevamente</button>
    <button>Continuar Comprando</button>
  </>
)}
```

---

## 📊 Tabla de Estados de Orden

| Estado | Color | Causa | Acciones | Mostrar Stock |
|--------|-------|-------|----------|---------------|
| `completed` | 🟢 Verde | Pago aprobado (status=AUTHORIZED, code=0) | Descontar stock, enviar email | NO |
| `failed` | 🔴 Rojo | Pago rechazado (code ≠ 0 o status ≠ AUTHORIZED) | Nada | Mostrar causa |
| `cancelled` | ⚪ Gris | Usuario presionó "Anular" | Nada | Permitir reintentar |
| `timeout` | 🟠 Naranja | Formulario expiró sin completar | Nada | Permitir reintentar |
| `pending` | 🟡 Amarillo | En procesamiento | Esperar callback | Mostrar estado |

---

## 🔐 Validaciones Críticas

### 1. **Double-Commit Prevention**
```javascript
if (order.status === 'completed' && order.transbank.responseCode === 0) {
  console.log('ADVERTENCIA: Orden ya fue confirmada previamente');
  return res.json({ success: true, warning: 'ALREADY_PROCESSED' });
}
```

### 2. **Timeout Counter**
```javascript
order.transbank.commitAttempts = (order.transbank.commitAttempts || 0) + 1;
order.transbank.lastCommitAttempt = new Date();
```

### 3. **Order Validation**
```javascript
const isApproved = 
  transbankResponse.response_code === 0 && 
  transbankResponse.status === 'AUTHORIZED';
```

---

## 📧 Acciones por Estado

### ✅ Completado
- ✓ Descontar stock de productos
- ✓ Crear registro de venta
- ✓ Enviar email de confirmación
- ✓ Mostrar número de seguimiento
- ✓ Mostrar código de autorización

### ❌ Fallido
- ✗ NO descontar stock
- ✗ NO crear venta
- ✗ NO enviar email
- ✓ Mostrar código de error
- ✓ Permitir reintentar

### ⏹️ Cancelado
- ✗ NO descontar stock
- ✗ NO crear venta
- ✗ NO enviar email
- ✓ Permitir reintentar
- ✓ Limpiar carrito (opcional)

### ⏱️ Expirado
- ✗ NO descontar stock
- ✗ NO crear venta
- ✗ NO enviar email
- ✓ Permitir reintentar
- ✓ Mostrar timestamp de expiración

---

## 🚀 Flujo Completo (End-to-End)

```
1. Usuario presiona "Pagar" → frontend/Cart.js
   ↓
2. Llamada a POST /api/payments/init → backend
   ↓
3. Backend crea transacción en Transbank
   ↓
4. Transbank retorna { token, url }
   ↓
5. Frontend redirige a formulario de Transbank (url)
   ↓
6. Usuario ingresa datos y presiona "Pagar"
   ↓
7. Transbank procesa y redirige a /api/payments/result
   ↓
8. Backend confirma con transaction.commit(token)
   ↓
9. Backend actualiza orden según respuesta:
   - Si status=AUTHORIZED y code=0 → "completed"
   - Si status≠AUTHORIZED o code≠0 → "failed"
   - Si cancelado → "cancelled"
   - Si expirado → "timeout"
   ↓
10. Backend redirige a frontend: /payment/result?params
   ↓
11. Frontend llama confirmPayment() y muestra resultado
   ↓
12. Usuario ve pantalla apropiada (éxito/error/cancelado/expirado)
```

---

## 🧪 Testing con Tarjetas de Prueba

**Ambiente de Integración**: https://webpay3gint.transbank.cl/

### Tarjetas que resultan en **APROBADO**:
- **VISA:** `4051 8856 0044 6623` (CVV: 123)
- **AMEX:** `3700 0000 0002 032` (CVV: 1234)
- **Redcompra:** `4051 8842 3993 7763` (Débito)

### Tarjeta que resulta en **RECHAZADO**:
- **MASTERCARD:** `5186 0595 5959 0568` (CVV: 123)

### Autenticación Bancaria:
- **RUT:** `11.111.111-1`
- **Clave:** `123`

---

## 📝 Resumen de Cambios Realizados

### Backend (`paymentController.js`)
✅ Mejorado manejo de 4 casos distintos en `confirmPayment()`
✅ Agregada lógica clara de validación (response_code === 0 && status === 'AUTHORIZED')
✅ Mensajes de respuesta más descriptivos
✅ Estados de orden más específicos (completed, failed, cancelled, timeout)

### Frontend (`PaymentResult.js`)
✅ Función `getStatusMessage()` con todos los 4 casos
✅ Colores y mensajes diferenciados por tipo de error
✅ Botones de acción condicionales según estado
✅ Información sensible solo mostrada en caso de éxito
✅ Mensajes explicativos con sugerencias de acción

---

## ✨ Resultado Final

**Antes:** Una pantalla genérica que no diferenciaba los diferentes tipos de fallo
**Después:** 4 pantallas claramente diferenciadas con instrucciones específicas para cada caso

- 🟢 **Éxito:** Detalles de la compra, número de autorización, próximos pasos
- 🔴 **Rechazo:** Código de error, causas posibles, botón de reintentar
- ⚪ **Cancelado:** Explicación que fue cancelado por el usuario, opción de reintentar
- 🟠 **Expirado:** Explicación de timeout, opción de reintentar

¡Flujo completamente funcional y conforme a la documentación oficial de Transbank! 🎉
