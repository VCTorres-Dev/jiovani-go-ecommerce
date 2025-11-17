# 🎯 GUÍA: Cómo Ahora Funciona el Flujo de Compra

## El Problema que Solucionamos

**Antes:**
- Presionas "Pagar" → Completas un pago en Transbank → Una sola pantalla genérica

**Ahora:**
- Presionas "Pagar" → Completas un pago en Transbank → 4 pantallas diferentes según lo que pasó

---

## Las 4 Situaciones Posibles

### 1️⃣ **El pago fue APROBADO ✅**

**Qué ves:**
```
┌───────────────────────────────────────────┐
│         ✓ ¡Pago Completado!              │
│      Código de Autorización: 1213        │
├───────────────────────────────────────────┤
│  📋 Detalles de tu compra                 │
│  Número de orden: 507f1f77bcf86cd799     │
│  Monto: $35.990                          │
│  Fecha: 16 de noviembre, 2025 14:30      │
├───────────────────────────────────────────┤
│  💳 Método de pago                        │
│  Crédito terminada en 6623                │
├───────────────────────────────────────────┤
│  📦 Tu dirección de envío                 │
│  Vicente López, Calle Ejemplo 123         │
├───────────────────────────────────────────┤
│  🎯 Próximos pasos:                       │
│  ✓ Recibirás confirmación por email      │
│  ✓ Preparamos en 24-48 horas             │
│  ✓ Envío en 2-5 días                     │
│  ✓ Te enviaremos código de seguimiento   │
├───────────────────────────────────────────┤
│  [Seguir Comprando] [Ver Catálogo]       │
└───────────────────────────────────────────┘
```

**Qué pasó en el backend:**
- Tu orden cambió a estado: `completed` ✅
- Se descontó el stock de los productos
- Se envió email de confirmación
- Se guardó el código de autorización: `1213`

**Qué debes hacer:**
- Recibirás email con comprobante
- En 24-48 horas, email con código de seguimiento
- Tu compra está lista para envío

---

### 2️⃣ **El pago fue RECHAZADO ❌**

**Qué ves:**
```
┌───────────────────────────────────────────┐
│         ✗ Pago Rechazado                 │
│          Código: -1                      │
├───────────────────────────────────────────┤
│  ❌ Tu pago fue rechazado por el banco    │
│                                           │
│  Posibles causas:                         │
│  • Datos de tarjeta incorrectos           │
│  • Fondos insuficientes                   │
│  • Tarjeta expirada                       │
│  • No habilitada para compras online      │
│  • Límite de transacciones excedido       │
│                                           │
│  Contacta con tu banco para más detalles. │
├───────────────────────────────────────────┤
│  [Intentar Nuevamente] [Catálogo]        │
└───────────────────────────────────────────┘
```

**Qué pasó en el backend:**
- Tu orden cambió a estado: `failed` ❌
- NO se descontó stock (los productos siguen disponibles)
- NO se envió email
- Se guardó el código de error para referencia

**Qué debes hacer:**
- Verifica que tus datos de tarjeta sean correctos
- Asegúrate de tener fondos suficientes
- Intenta con otra tarjeta o método de pago
- Contacta con tu banco si persiste el problema

---

### 3️⃣ **TÚ CANCELASTE EL PAGO ⏹️**

**Qué ves:**
```
┌───────────────────────────────────────────┐
│      ⊘ Pago Cancelado                    │
├───────────────────────────────────────────┤
│  ❌ Cancelaste el proceso de pago        │
│                                           │
│  Presionaste "Anular compra" en el       │
│  formulario de Transbank.                 │
│                                           │
│  Tu orden NO fue procesada.              │
│  Tu tarjeta NO fue cobrada.              │
│                                           │
│  Puedes intentar nuevamente cuando lo    │
│  desees. Tu carrito sigue con los        │
│  productos.                              │
├───────────────────────────────────────────┤
│  [Intentar Nuevamente] [Catálogo]        │
└───────────────────────────────────────────┘
```

**Qué pasó en el backend:**
- Tu orden cambió a estado: `cancelled` ⏹️
- NO se descontó stock
- NO se envió email
- Tu carrito se mantiene intacto

**Qué debes hacer:**
- Si deseas completar la compra, presiona "Intentar Nuevamente"
- Si cambias de idea, presiona "Catálogo" para seguir mirando

---

### 4️⃣ **EL FORMULARIO EXPIRÓ ⏱️**

**Qué ves:**
```
┌───────────────────────────────────────────┐
│      ⏱ Pago Expirado                     │
├───────────────────────────────────────────┤
│  ⏱️ El formulario de pago expiró         │
│                                           │
│  Tienes un tiempo máximo para completar  │
│  tu pago:                                 │
│  • 4 minutos en PRODUCCIÓN                │
│  • 10 minutos en MODO PRUEBA              │
│                                           │
│  Si no completas en este tiempo, el      │
│  formulario se cierra automáticamente.   │
│                                           │
│  Tu carrito sigue con los productos.     │
├───────────────────────────────────────────┤
│  [Intentar Nuevamente] [Catálogo]        │
└───────────────────────────────────────────┘
```

**Qué pasó en el backend:**
- Tu orden cambió a estado: `timeout` ⏱️
- NO se descontó stock
- NO se envió email
- Tu carrito se mantiene intacto

**Qué debes hacer:**
- Presiona "Intentar Nuevamente" para crear un nuevo pago
- Completa el formulario más rápidamente esta vez
- Mantén la ventana abierta mientras completas el pago

---

## 🔍 Cómo Distinguir los Casos

### El Backend Verifica:

1. **¿Viene `token_ws` en los parámetros?**
   - SÍ → Sigue verificando (paso 2)
   - NO → Sigue verificando (paso 3)

2. **¿Respuesta de Transbank tiene `response_code === 0` Y `status === 'AUTHORIZED'`?**
   - SÍ → **ÉXITO** ✅
   - NO → **RECHAZO** ❌

3. **¿Vienen `TBK_TOKEN` + `TBK_ORDEN_COMPRA` + `TBK_ID_SESION` (sin `token_ws`)?**
   - SÍ → **CANCELADO** ⏹️
   - NO → Sigue al paso 4

4. **¿Vienen solo `TBK_ORDEN_COMPRA` + `TBK_ID_SESION` (sin tokens)?**
   - SÍ → **TIMEOUT** ⏱️

---

## 🎨 Código Técnico (Para Desarrolladores)

### Backend - La Lógica

```javascript
// En paymentController.js - confirmPayment()

const { token_ws, TBK_TOKEN, TBK_ORDEN_COMPRA, TBK_ID_SESION } = req.body;

// CASO 1: TIMEOUT
if (!token_ws && !TBK_TOKEN && TBK_ORDEN_COMPRA && TBK_ID_SESION) {
  order.status = 'timeout';
  return res.json({ success: false, data: { status: 'timeout' } });
}

// CASO 2: CANCELADO
if (TBK_TOKEN && TBK_ORDEN_COMPRA && TBK_ID_SESION && !token_ws) {
  order.status = 'cancelled';
  return res.json({ success: false, data: { status: 'cancelled' } });
}

// CASO 3 y 4: ÉXITO o RECHAZO
const transbankResponse = await transaction.commit(token_ws);

if (transbankResponse.response_code === 0 && 
    transbankResponse.status === 'AUTHORIZED') {
  // ÉXITO
  order.status = 'completed';
  // Descontar stock, enviar email, etc
} else {
  // RECHAZO
  order.status = 'failed';
  // No descontar stock
}
```

### Frontend - La Pantalla

```javascript
// En PaymentResult.js
const getStatusMessage = (status, paymentData) => {
  const messages = {
    'completed': {
      title: '✅ ¡Pago Completado!',
      color: 'text-green-600',
      message: 'Tu compra fue procesada...'
    },
    'failed': {
      title: '❌ Pago Rechazado',
      color: 'text-red-600',
      message: 'Tu pago fue rechazado...'
    },
    'cancelled': {
      title: '⏹️ Pago Cancelado',
      color: 'text-gray-600',
      message: 'Cancelaste el pago...'
    },
    'timeout': {
      title: '⏱️ Pago Expirado',
      color: 'text-orange-600',
      message: 'El formulario expiró...'
    }
  };
  
  return messages[status] || messages.failed;
};
```

---

## 📊 Flujo Completo (Paso a Paso)

```
┌─ Usuario presiona "Pagar"
│
├─ 1. Frontend llama POST /api/payments/init
│  └─ Backend crea orden y contacta Transbank
│
├─ 2. Transbank devuelve { token, url }
│
├─ 3. Frontend redirige al usuario a formulario Transbank
│  └─ Usuario ingresa datos de tarjeta
│
├─ 4. Usuario presiona "Pagar" en Transbank
│  ├─ Opción A: Pago aprobado
│  │  └─ Transbank redirige a /result?token_ws=abc123
│  │
│  ├─ Opción B: Pago rechazado
│  │  └─ Transbank redirige a /result?token_ws=abc123
│  │
│  ├─ Opción C: Usuario presiona "Anular"
│  │  └─ Transbank redirige a /result?TBK_TOKEN=abc123
│  │
│  └─ Opción D: 10 minutos sin completar
│     └─ Transbank redirige a /result (sin tokens)
│
├─ 5. Backend recibe parámetros y decide qué caso es
│  ├─ Si Opción A + éxito → status = 'completed'
│  ├─ Si Opción A + rechazo → status = 'failed'
│  ├─ Si Opción B → status = 'cancelled'
│  └─ Si Opción C → status = 'timeout'
│
├─ 6. Backend redirige a Frontend con el status
│
└─ 7. Frontend muestra pantalla correcta según status

Fin ✅
```

---

## 🧪 Cómo Probar Cada Caso

### Caso 1: ÉXITO ✅
1. Ve a checkout
2. En formulario Transbank, usa esta tarjeta:
   - **Número:** `4051 8856 0044 6623`
   - **CVV:** `123`
   - **RUT:** `11.111.111-1`
   - **Clave:** `123`
3. Presiona Pagar
4. ✅ Verás pantalla verde de éxito

### Caso 2: RECHAZO ❌
1. Ve a checkout
2. En formulario Transbank, usa esta tarjeta:
   - **Número:** `5186 0595 5959 0568`
   - **CVV:** `123`
   - **RUT:** `11.111.111-1`
   - **Clave:** `123`
3. Presiona Pagar
4. ❌ Verás pantalla roja de rechazo

### Caso 3: CANCELADO ⏹️
1. Ve a checkout
2. En formulario Transbank, presiona botón **"Anular compra"**
3. ⏹️ Verás pantalla gris de cancelación

### Caso 4: TIMEOUT ⏱️
1. Ve a checkout
2. En formulario Transbank, **espera 10+ minutos sin hacer nada**
3. ⏱️ Verás pantalla naranja de expiración

---

## ✨ Lo Nuevo vs Lo Anterior

### Antes
- Página simple: "Tu pago fue procesado"
- No diferencia entre éxito y rechazo
- Mensajes genéricos sin contexto
- Los mismos botones para todo
- Información de envío siempre visible

### Ahora
- 4 páginas completamente diferentes
- Colores únicos para cada tipo (verde, rojo, gris, naranja)
- Mensajes claros y contextuales
- Botones específicos: "Seguir Comprando" o "Intentar Nuevamente"
- Info de envío solo si el pago fue exitoso
- Instrucciones claras sobre qué hacer en cada caso
- Códigos de error cuando aplica
- Próximos pasos solo si la compra fue completada

---

## 🎓 Conclusión

Ahora tu plataforma de compra tiene un **flujo profesional y claro** que:

1. **Diferencia claramente** los 4 casos posibles de pago
2. **Guía al usuario** con mensajes específicos y contextuales
3. **Mantiene limpia** la información (solo muestra lo relevante)
4. **Facilita reintentos** con botones claros de acción
5. **Cumple** con los estándares de Transbank

¡Tu plataforma ahora funciona exactamente como debe ser! 🚀
