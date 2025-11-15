# 🔐 CÓMO OBTENER CREDENCIALES REALES DE TRANSBANK (Paso a Paso 2025)

## 📌 SITUACIÓN ACTUAL

**Lo que tienes ahora:**
- ✅ Backend en Railway funcional
- ✅ Endpoints MOCK funcionando (`/api/payments/init-mock`)
- ❌ Credenciales DEMO bloqueadas por Incapsula (Firewall de Transbank)

**Lo que necesitas:**
- Credenciales REALES de desarrollo (sin costo)
- Ver la página REAL de Transbank en desarrollo
- Luego pasar a producción

---

## 🎯 PASO 1: OBTENER CREDENCIALES DE INTEGRACIÓN (GRATIS)

Transbank proporciona credenciales **GRATUITAS** para desarrollo. **ESTOS YA ESTÁN PRECARGADOS en sus SDK:**

### Credenciales de INTEGRACIÓN (Ambiente TEST - Sin costo)

```
HOST: https://webpay3gint.transbank.cl

Webpay Plus:
  Commerce Code (Api-Key-Id): 597055555532
  API Key Secret (Api-Key-Secret): 579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
```

**¿Por qué el Firewall de Transbank las bloquea?**
- Las credenciales DEMO tienen una restricción de IP
- Railway está en una IP dinámica que NO está whitelisted
- La solución: Transbank espera que:
  1. Primero hagas pruebas en desarrollo LOCAL
  2. Luego solicites credenciales PRODUCTIVAS
  3. Con credenciales REALES, tendrás acceso desde Railway

---

## 🔴 VERDAD INCÓMODA

**Las credenciales DEMO (`597055555532`) NO funcionan desde Railway** porque:
- Son credenciales de prueba internas de Transbank
- Tienen firewall restrictivo
- Transbank espera que uses credenciales REALES para producción

**Pero hay buenas noticias:**
- Solicitar credenciales REALES es GRATIS
- Se hacen en 24-48 horas
- Tú como desarrollador CAN solicitar directamente

---

## ✅ PASO 2: SOLICITAR CREDENCIALES REALES DE DESARROLLO (Recomendado)

### Opción A: Como Desarrollador (MÁS RÁPIDO - 24h)

**Contacta directamente a Transbank:**
- 📧 Email: `integradores@transbank.cl`
- 🗨️ Slack: https://invitacion-slack.transbankdevelopers.cl/slack_community
- 💬 WhatsApp: +56 9 3649 6045 (soporte Transbank)

**Correo a enviar:**
```
Asunto: Solicitud de Credenciales de Integración - Proyecto Universitario

Hola equipo de Transbank,

Mi nombre es [Tu Nombre] y estoy desarrollando un proyecto académico 
que requiere integrar Webpay Plus.

Quisiera solicitar credenciales de integración (development/test) para:
- Webpay Plus
- Ambiente: INTEGRACIÓN (TEST)
- Propósito: Proyecto universitario
- Backend: Node.js/Express en Railway

Mi email: [Tu email]

¿Podría proporcionarme un Commerce Code y API Key Secret para testing?

Saludos,
[Tu Nombre]
```

**Respuesta esperada (24-48h):**
- Recibirás un Commerce Code y API Key Secret exclusivos
- Esto servirá en el ambiente TEST (https://webpay3gint.transbank.cl)
- Funcionará desde cualquier IP

---

### Opción B: Como Comercio (RECOMENDADO - Path oficial)

Si quieres ser "oficial", sigue este proceso:

#### **PASO 2.1: Hazte cliente en Transbank** (Gratis para estudiantes)
1. Ve a: https://publico.transbank.cl
2. Haz clic en **"Hazte cliente"** o **"Contratar WebPay Plus"**
3. Rellena formulario como:
   - **Tipo:** Comercio / Desarrollador
   - **Nombre:** Tu nombre o universidad
   - **Actividad:** E-commerce educativo / Proyecto académico
4. **Firma digitalmente** (solo tu cédula o pasaporte)
5. **Recibirás por email (24h):**
   - Commerce Code productivo
   - Acceso al portal privado

#### **PASO 2.2: Generar Credenciales de Integración**
1. Inicia sesión en: https://privado.transbank.cl/
2. Navega a: **"Administración" → "Seguridad" → "APIs"**
3. Genera nueva **Llave API**
4. Copia el Commerce Code y API Key Secret

**Esto te dará:**
- Credenciales REALES (no bloqueadas)
- Acceso desde cualquier IP
- Funciona en ambiente TEST

---

## 🚀 PASO 3: CONFIGURAR EN TU BACKEND (Railway)

Una vez obtengas las credenciales:

### Actualizar Environment Variables en Railway

```
TRANSBANK_COMMERCE_CODE=TU_CODE_AQUI
TRANSBANK_API_KEY=TU_API_KEY_AQUI
TRANSBANK_ENV=TEST
```

**Pasos:**
1. Ve a tu dashboard de Railway
2. Select el servicio "jiovani-go-ecommerce"
3. Variables → Add Variable
4. Pega las 3 variables arriba
5. El deploy se reinicia automáticamente

### Cambiar endpoint en frontend

**De:**
```javascript
const url = '/api/payments/init-mock';
```

**A:**
```javascript
const url = '/api/payments/init-test';  // Ahora usa credenciales REALES
```

---

## 🧪 PASO 4: TESTEAR CON TARJETAS REALES DE TRANSBANK

Transbank proporciona tarjetas de prueba GRATUITAS en ambiente TEST:

### Tarjetas de Prueba (Funcionan SOLO en TEST)

```
VISA (Aprobada):
  Número: 4051 8856 0044 6623
  CVV: 123
  Fecha: Cualquiera
  RUT: 11.111.111-1
  Clave: 123

MASTERCARD (Rechazada intencionalmente):
  Número: 5186 0595 5959 0568
  CVV: 123
  Fecha: Cualquiera
  RUT: 11.111.111-1
  Clave: 123

AMEX (Aprobada):
  Número: 3700 0000 0002 032
  CVV: 1234
  Fecha: Cualquiera
  RUT: 11.111.111-1
  Clave: 123
```

### Flujo de Testing:

1. **En tu app:** Haz clic en "Pagar"
2. **Sistema redirige a:** `https://webpay3gint.transbank.cl/...` (PÁGINA REAL)
3. **Ingresa tarjeta:** 4051 8856 0044 6623
4. **Ingresa RUT:** 11.111.111-1
5. **Ingresa Clave:** 123
6. **Resultado:** ✅ APROBADO (redirige a tu app)

---

## 📊 TIMELINE REALISTA

| Paso | Acción | Tiempo | Bloqueante |
|------|--------|--------|-----------|
| 1 | Solicitar credenciales a Transbank | 5 min email | ⏳ Espera 24-48h |
| 2 | Recibir credenciales | - | ⏳ 24-48h |
| 3 | Configurar en Railway | 5 min | ❌ No |
| 4 | Cambiar endpoint en frontend | 5 min | ❌ No |
| 5 | Testear con tarjetas DEMO | 20 min | ❌ No |
| **TOTAL** | | **35 min + espera** | |

---

## 🎓 PARA TU PRESENTACIÓN UNIVERSITARIA

### Opción 1: Usar MOCK (Ahora mismo)
- ✅ Demo funciona con `/api/payments/init-mock`
- ✅ Redirección simulada a Transbank
- ⚠️ No es página REAL de Transbank
- **Tiempo:** 2 horas

### Opción 2: Usar REAL (Recomendado)
- ✅ Página REAL de Transbank
- ✅ Tarjetas de prueba funcionales
- ✅ Flujo completo validado
- ⚠️ Espera 24-48h por credenciales
- **Tiempo:** 35 min + espera

### Mi recomendación
**Haz AMBAS cosas:**
1. **Hoy:** Deploy con `/api/payments/init-mock` (para presentación inmediata)
2. **En paralelo:** Solicita credenciales reales
3. **Mañana:** Actualiza a `/api/payments/init-test` (para que vea página REAL)

---

## 📞 CONTACTOS TRANSBANK

### Para developers (Lo más rápido)
- **Slack:** https://invitacion-slack.transbankdevelopers.cl/slack_community
- **Email:** integradores@transbank.cl
- **WhatsApp:** +56 9 3649 6045

### Para comercios
- **Web:** https://publico.transbank.cl
- **Centro de ayuda:** https://ayuda.transbank.cl
- **Contacto:** https://publico.transbank.cl/contactanos

---

## ✋ IMPORTANTE: NO USES SDK DIRECTO

**Por qué tu SDK falló:**
```javascript
const { WebpayPlus } = require("transbank-sdk");
```

- El SDK intenta compilar módulos nativos en Railway
- Falla porque requiere herramientas C/C++ en el contenedor
- **Solución:** Usa HTTPS REST directo (lo que hicimos)

Tu código actual (HTTPS REST) es **MÁS EFICIENTE** que el SDK.

---

## 🔒 SEGURIDAD

### Lo que NUNCA debes hacer:
- ❌ Poner API Key en el frontend
- ❌ Hacer requests de Transbank desde el navegador
- ❌ Guardar datos de tarjeta

### Lo que DEBES hacer (ya lo haces):
- ✅ Backend hace calls a Transbank
- ✅ Frontend solo recibe tokens
- ✅ API Key está en env variables de Railway

---

## ✅ RESUMEN: NEXT STEPS

**Opción RÁPIDA (Ahora):**
1. Usa `/api/payments/init-mock`
2. Deploy frontend
3. Presenta con MOCK

**Opción PROFESIONAL (Recomendado):**
1. Envía email a integradores@transbank.cl ahora mismo
2. Mientras esperas: Deploy con MOCK
3. Cuando llegan credenciales: Actualiza a `/api/payments/init-test`
4. Testea con tarjetas DEMO reales
5. Presenta con página REAL de Transbank

**¿Cuál prefieres?**

---

**Última actualización:** 15 de Noviembre de 2025
**Autor:** Sistema de Soporte de Transbank
**Fuente oficial:** https://www.transbankdevelopers.cl/documentacion/como_empezar
