# 📧 Configuración de SendGrid para jiovaniGo Chile

## ¿Por qué SendGrid?

✅ **Compatible con Railway** - Usa API HTTP (no SMTP bloqueado)
✅ **100 emails/día GRATIS** - Suficiente para tu e-commerce
✅ **Alta deliverability** - Emails llegan a inbox, no spam
✅ **Profesional** - Usado por miles de empresas
✅ **Estadísticas** - Ve cuántos emails se abren/clickean

---

## Paso 1: Crear Cuenta en SendGrid

1. Ve a: **https://sendgrid.com/**
2. Click en **"Start for Free"** (esquina superior derecha)
3. Llena el formulario de registro:
   - Email: `jvcantorres@gmail.com` (o el que prefieras)
   - Contraseña segura
   - Click en **"Create Account"**
4. **Verifica tu email** - revisa tu bandeja de entrada
5. Click en el link de verificación

---

## Paso 2: Configurar Sender Identity (Identidad del Remitente)

**IMPORTANTE**: SendGrid requiere verificar el email desde el cual enviarás.

### Opción A: Single Sender Verification (MÁS RÁPIDO)

1. En el dashboard de SendGrid, ve a **Settings → Sender Authentication**
2. Click en **"Verify a Single Sender"**
3. Llena el formulario:
   - **From Name**: `jiovaniGo Chile`
   - **From Email Address**: `jvcantorres@gmail.com`
   - **Reply To**: `jvcantorres@gmail.com`
   - **Company Address**: (tu dirección real)
   - **City**: (tu ciudad)
   - **Country**: Chile
4. Click **"Create"**
5. **Revisa tu email** - SendGrid enviará un email de verificación
6. **Click en el link** del email - DEBE decir "Verified" ✅

### Opción B: Domain Authentication (PROFESIONAL - Requiere dominio)

Si tienes un dominio propio (ej: `dejoaromas.cl`):
1. Ve a **Settings → Sender Authentication**
2. Click en **"Authenticate Your Domain"**
3. Sigue las instrucciones para agregar registros DNS
4. Podrás enviar desde `noreply@tudominio.cl`

**Para empezar, usa Opción A** (Single Sender).

---

## Paso 3: Generar API Key

1. En el dashboard de SendGrid, ve a **Settings → API Keys**
2. Click en **"Create API Key"** (botón azul arriba a la derecha)
3. Configuración:
   - **API Key Name**: `jiovaniGo Production`
   - **API Key Permissions**: Selecciona **"Full Access"**
4. Click **"Create & View"**
5. **¡IMPORTANTE!** Copia la API key inmediatamente:
   ```
   SG.xxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
   ```
   - Guárdala en un lugar seguro
   - **NO la compartas con nadie**
   - **NO la podrás ver de nuevo**

---

## Paso 4: Configurar Variables en Railway

1. Ve a **Railway → Tu proyecto → Variables**
2. Elimina las variables antiguas de SMTP:
   - ❌ `EMAIL_ENABLED`
   - ❌ `SMTP_HOST`
   - ❌ `SMTP_PORT`
   - ❌ `EMAIL_USER`
   - ❌ `EMAIL_PASS`
3. Agrega las nuevas variables de SendGrid:

### Variables a Agregar:

```bash
SENDGRID_API_KEY
SG.xxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy

SENDGRID_FROM_EMAIL
jvcantorres@gmail.com

EMAIL_FROM
jvcantorres@gmail.com
```

**IMPORTANTE**:
- `SENDGRID_API_KEY`: La API key que copiaste en Paso 3
- `SENDGRID_FROM_EMAIL`: El email que verificaste en Paso 2
- `EMAIL_FROM`: El mismo email (para compatibilidad)

4. Click **"Add"** después de cada variable
5. Railway hará **redeploy automático** (~2 minutos)

---

## Paso 5: Verificar que Funciona

### En los logs de Railway deberías ver:

```
✅ SendGrid configurado exitosamente
📧 Email desde: jvcantorres@gmail.com
✅ SendGrid listo para enviar emails
```

### Si ves errores:

❌ **"SendGrid no configurado"**
→ Verifica que agregaste `SENDGRID_API_KEY` correctamente

❌ **"The from address does not match a verified Sender Identity"**
→ El email en `SENDGRID_FROM_EMAIL` NO está verificado en SendGrid
→ Ve a Paso 2 y verifica tu sender

❌ **"Invalid API Key"**
→ La API key está mal copiada o fue eliminada
→ Genera una nueva en Paso 3

---

## Paso 6: Probar con Compra Real

1. Ve a tu sitio: https://jiovani-go-ecommerce-production.up.railway.app
2. Agrega un producto al carrito
3. Completa el checkout con tu email
4. Simula el pago (tarjeta de prueba)
5. **Revisa tu bandeja de entrada** 📧

### Deberías recibir un email con:

- ✅ Asunto: "✅ Confirmación de Compra #ORD... - jiovaniGo Chile"
- ✅ Detalles de tu compra
- ✅ Productos comprados
- ✅ Total pagado
- ✅ Información de envío

---

## Límites del Plan Gratis

- **100 emails/día** - Renovables cada 24 horas
- **2,000 contactos** - Suficiente para empezar
- **Email Support** - Soporte por email
- **Estadísticas básicas** - Opens, clicks, bounces

**Para tu volumen actual, el plan gratis es MÁS que suficiente.**

---

## ¿Qué pasa si necesitas más emails?

Cuando crezcas y necesites más de 100 emails/día:

- **Plan Essentials**: $19.95/mes → 50,000 emails/mes
- **Plan Pro**: $89.95/mes → 100,000 emails/mes

Pero **empieza con gratis**, no pagas nada.

---

## Troubleshooting (Problemas Comunes)

### Email no llega

1. **Revisa spam/junk** - A veces llegan ahí al principio
2. **Verifica Sender Identity** - DEBE estar "Verified" ✅
3. **Revisa logs de Railway** - Busca errores de SendGrid
4. **Verifica el email** - ¿Está bien escrito en checkout?

### "The from address does not match a verified Sender Identity"

- Ve a **Settings → Sender Authentication**
- Verifica que el email esté "Verified" ✅
- Usa EXACTAMENTE el mismo email en `SENDGRID_FROM_EMAIL`

### "Forbidden" o "Unauthorized"

- API key incorrecta o sin permisos
- Genera nueva API key con "Full Access"
- Cópiala correctamente (sin espacios)

---

## Monitoreo de Emails

### Ver estadísticas en SendGrid:

1. Ve a **Activity** en el dashboard
2. Verás todos los emails enviados
3. Puedes filtrar por fecha, estado, etc.

### Estados posibles:

- ✅ **Delivered** - Email entregado exitosamente
- 📬 **Processed** - SendGrid lo recibió y está procesando
- ⚠️ **Bounce** - Email rebotó (dirección inválida)
- 🚫 **Dropped** - SendGrid no lo envió (spam protection)

---

## Resumen de Variables en Railway

```bash
# SendGrid (ÚNICO sistema de emails)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
SENDGRID_FROM_EMAIL=jvcantorres@gmail.com
EMAIL_FROM=jvcantorres@gmail.com
```

**Ya NO necesitas**:
- ~~EMAIL_ENABLED~~
- ~~SMTP_HOST~~
- ~~SMTP_PORT~~
- ~~EMAIL_USER~~
- ~~EMAIL_PASS~~

---

## ¿Necesitas Ayuda?

Si tienes problemas:
1. Revisa los logs de Railway
2. Verifica que Sender Identity esté "Verified" ✅
3. Confirma que la API key tiene "Full Access"
4. Asegúrate que las variables estén exactamente como arriba

---

## ✅ Checklist de Configuración

- [ ] Cuenta de SendGrid creada
- [ ] Email verificado en SendGrid
- [ ] Sender Identity verificado ✅
- [ ] API Key generada y copiada
- [ ] Variables agregadas en Railway
- [ ] Railway redeployado
- [ ] Logs muestran "✅ SendGrid configurado"
- [ ] Compra de prueba realizada
- [ ] Email de confirmación recibido

**Cuando todos tengan ✅, estás listo para producción!** 🚀
