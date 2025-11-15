# 🎯 RAILWAY DEPLOYMENT CHECKLIST - JIOVANI GO

## 📋 CHECKLIST DE DESPLIEGUE PASO A PASO

### ✅ PASO 1: PREPARAR GITHUB (5 minutos)

**Requisitos:**
- [ ] Tienes cuenta GitHub (https://github.com/signup)
- [ ] Git está instalado en tu PC
- [ ] Estás en la carpeta raíz del proyecto

**Ejecutar:**
```powershell
# Navega a la carpeta del proyecto
cd "C:\Users\Vicente\Documents\RESPALDO PAGINA DEJO AROMAS\DA_Page - V2"

# Ejecutar script
.\push-to-github.ps1 -GitHubUser "tu_usuario_github"
```

**O ejecutar manualmente:**
```powershell
git init
git add .
git commit -m "Initial commit: JiovaniGo eCommerce con integración Transbank"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/jiovani-go-ecommerce.git
git push -u origin main
```

**Verificar:** https://github.com/TU_USUARIO/jiovani-go-ecommerce
- [ ] Código subido
- [ ] Backend visible
- [ ] Frontend visible

---

### ✅ PASO 2: CREAR PROYECTO EN RAILWAY (10 minutos)

1. [ ] Ve a https://railway.app/
2. [ ] Haz clic en **+ New Project**
3. [ ] Selecciona **Deploy from GitHub repo**
4. [ ] Busca: **jiovani-go-ecommerce**
5. [ ] Haz clic en **Deploy**
6. [ ] Espera 5-10 minutos (verás "Building...")

**Verificar en Railway:**
- [ ] Aparece "Build successful"
- [ ] Obtuviste URL: `https://xxxx-production.up.railway.app`

Anotalo aquí:
```
URL Backend Railway: ________________________
```

---

### ✅ PASO 3: CONFIGURAR VARIABLES DE ENTORNO (5 minutos)

En Railway:
1. [ ] Haz clic en tu proyecto
2. [ ] Ve a pestaña **Variables**
3. [ ] Haz clic en **Add Variable**
4. [ ] Agrega cada una de estas:

**Variables Obligatorias:**

| Variable | Valor | Notas |
|----------|-------|-------|
| `PORT` | `3000` | Requerido |
| `NODE_ENV` | `production` | Requerido |
| `TRANSBANK_ENV` | `TEST` | TEST para pruebas, PRODUCTION después |
| `FRONTEND_URL` | `https://TU_URL_RAILWAY` | Reemplazar TU_URL |
| `FRONTEND_URL_REAL` | `https://TU_URL_RAILWAY` | Misma URL |
| `JWT_SECRET` | `clave_ultra_secreta_super_larga_123` | Cambiar esto |
| `JWT_EXPIRE` | `30d` | Duración del token |

**Variables de Base de Datos:**

| Variable | Valor |
|----------|-------|
| `MONGODB_URI` | Ver sección MongoDB abajo |

**Variables de Email:**

| Variable | Valor | Notas |
|----------|-------|-------|
| `EMAIL_ENABLED` | `true` | Activar emails |
| `EMAIL_USER` | `tu_email@gmail.com` | Tu correo Gmail |
| `EMAIL_PASS` | `tu_app_password` | Ver instrucciones abajo |
| `SMTP_HOST` | `smtp.gmail.com` | No cambiar |
| `SMTP_PORT` | `587` | No cambiar |
| `FROM_EMAIL` | `tu_email@gmail.com` | Tu correo |
| `FROM_NAME` | `Dejo Aromas` | Nombre de la tienda |

**Checklist de Variables:**
- [ ] PORT = 3000
- [ ] NODE_ENV = production
- [ ] TRANSBANK_ENV = TEST
- [ ] FRONTEND_URL = (tu URL railway)
- [ ] MONGODB_URI = (ver abajo)
- [ ] JWT_SECRET = (algo largo)
- [ ] EMAIL_USER, EMAIL_PASS = (configurado)

---

### 🔧 CONFIGURACIÓN MONGODB ATLAS (5 minutos)

**Opción A: MongoDB Atlas (Recomendado - Gratis)**

1. [ ] Ve a https://www.mongodb.com/cloud/atlas
2. [ ] Crea cuenta gratis
3. [ ] Crea un cluster gratis
4. [ ] En **Security**, agrega tu IP (o 0.0.0.0 para cualquiera)
5. [ ] Crea database user: `dejoaromas` / `password123`
6. [ ] Obtén connection string:
   ```
   mongodb+srv://dejoaromas:password123@cluster0.xxxxx.mongodb.net/dejoaromas
   ```
7. [ ] Copia en Railway como variable `MONGODB_URI`

**Opción B: Railway + MongoDB**

1. [ ] En Railway, **+ New Service**
2. [ ] Selecciona **MongoDB**
3. [ ] Se conectan automáticamente

Connection string aparece automáticamente en variables.

---

### 🔑 CONFIGURACIÓN GMAIL PARA EMAILS (5 minutos)

1. [ ] Ve a https://myaccount.google.com/apppasswords
2. [ ] Selecciona: **Mail** y **Windows Computer**
3. [ ] Gmail te genera una contraseña de 16 caracteres
4. [ ] Copia esa contraseña
5. [ ] En Railway, variable `EMAIL_PASS` = esa contraseña

**Ejemplo:**
```
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

---

### ✅ PASO 4: ESPERAR BUILD EXITOSO (5-10 minutos)

En Railway:
1. [ ] Ve a pestaña **Deployments**
2. [ ] Busca build status
3. [ ] Aparece: ✓ **Build successful**
4. [ ] Verifica logs sin errores

**Si hay error:**
- [ ] Lee los logs completos
- [ ] Busca "Error" o "failed"
- [ ] Verifica variables están correctas
- [ ] Verifica MongoDB está accesible

---

### ✅ PASO 5: DESPLEGAR FRONTEND (10 minutos)

En Railway:
1. [ ] Haz clic en **+ New Service**
2. [ ] Selecciona **GitHub repo**
3. [ ] Selecciona **jiovani-go-ecommerce**
4. [ ] Railway te pide configuración:

**Build Command:**
```
cd frontend && npm run build
```

**Start Command:**
```
cd frontend && npm start
```

**Root Directory:**
```
frontend
```

5. [ ] Agrega variables:

```
REACT_APP_API_URL=https://TU_URL_BACKEND_RAILWAY/api
NODE_ENV=production
PORT=3001
```

6. [ ] Deploy automático

Anotalo aquí:
```
URL Frontend Railway: ________________________
```

---

### 🎬 PASO 6: PROBAR FLUJO DE PAGO (10 minutos)

**URL Para Acceder:**
```
https://TU_URL_FRONTEND_RAILWAY
```

**Proceso de Prueba:**

1. [ ] Accede a la URL del frontend
2. [ ] Haz login o crea cuenta
3. [ ] Agrega productos al carrito
4. [ ] Ve a checkout
5. [ ] Completa datos:
   - [ ] Nombre
   - [ ] Email
   - [ ] Dirección
   - [ ] Ciudad
   - [ ] Código postal

6. [ ] Haz clic en **Procesar Pago**

**⚠️ MOMENTO CRÍTICO:**

Debes ver esto:
```
✅ Formulario REAL de Transbank WebPay
✅ Con logo de Transbank
✅ SIN error 401
✅ SIN simulador de Dejo Aromas
```

---

### 🧪 PROBAR ESCENARIOS DE PAGO

**Prueba 1: ✅ PAGO EXITOSO**

Tarjeta de prueba:
```
Número: 4051 8856 0044 6623
CVV: 123
Vencimiento: 12/25
RUT: 11.111.111-1
Clave: 123
```

Resultado esperado:
- [ ] Transbank procesa el pago
- [ ] Redirige a página de éxito
- [ ] Muestra: "Pago procesado correctamente"
- [ ] Email de confirmación recibido
- [ ] Stock reducido

**Prueba 2: ❌ PAGO RECHAZADO**

Tarjeta de prueba:
```
Número: 4051 8842 3993 7763
CVV: 123
Vencimiento: 12/25
```

Resultado esperado:
- [ ] Transbank rechaza el pago
- [ ] Muestra mensaje de error
- [ ] Permite reintentar

**Prueba 3: 🚫 CANCELACIÓN DE USUARIO**

- [ ] En formulario Transbank, haz clic en **Cancelar**
- [ ] Vuelve a la tienda
- [ ] Muestra: "Pago cancelado por usuario"
- [ ] Stock NO se reduce

**Prueba 4: ⏱️ TIMEOUT**

- [ ] Inicia un pago
- [ ] Espera 10 minutos sin hacer nada
- [ ] Sesión expira
- [ ] Muestra: "Sesión expirada"

---

### 🐛 TROUBLESHOOTING

**Problema: No aparece formulario Transbank, solo simulador**

```
Causas posibles:
❌ MONGODB_URI incorrecto → Verifica Atlas
❌ FRONTEND_URL incorrecto → Debe ser URL de Railway
❌ TRANSBANK_ENV = PRODUCTION → Cambiar a TEST
❌ Node no se está ejecutando → Ver logs Railway
```

**Problema: Error 500**

```
Solución:
1. Ve a Railway → Deployments → Logs
2. Busca el mensaje de error
3. Verifica variables de entorno
4. Reinicia el servicio
```

**Problema: Email no se envía**

```
Verificar:
[ ] EMAIL_ENABLED = true
[ ] EMAIL_PASS es contraseña app de Gmail (16 caracteres)
[ ] EMAIL_USER = tu@gmail.com
[ ] Gmail ha autorizado a Railway
```

---

### 📸 DOCUMENTAR PARA ERS

Toma screenshots de:
- [ ] Inicio de sesión en la tienda
- [ ] Página de productos
- [ ] Carrito de compras
- [ ] Formulario de checkout
- [ ] **FORMULARIO REAL DE TRANSBANK** (lo más importante)
- [ ] Página de éxito/confirmación
- [ ] Email de confirmación recibido

---

### ✅ CHECKLIST FINAL

**Antes de dar por completado:**

- [ ] Código en GitHub
- [ ] Backend en Railway con URL pública
- [ ] Frontend en Railway con URL pública
- [ ] MongoDB configurado y funcionando
- [ ] Variables de entorno todas agregadas
- [ ] Pago exitoso probado
- [ ] Pago rechazado probado
- [ ] Cancelación probada
- [ ] Email recibido
- [ ] Logs sin errores
- [ ] Screenshots para documentación

---

## 🎉 ÉXITO

Cuando completes esta checklist:

✅ Tienes un sistema 100% funcional en la nube
✅ Transbank integrado y funcionando
✅ URLs públicas reales (sin localhost)
✅ Listo para producción
✅ Documentación lista para tu ERS
✅ **MÁXIMA CALIFICACIÓN GARANTIZADA**

---

## 📝 NOTAS DE IMPLEMENTACIÓN

### Diferencias: Desarrollo vs Producción

| Aspecto | Desarrollo | Producción (Railway) |
|---------|-----------|----------------------|
| Backend | localhost:5000 | https://xxxx-railway.app |
| Frontend | localhost:3000 | https://yyyy-railway.app |
| Base Datos | MongoDB local | MongoDB Atlas (nube) |
| Transbank | TEST + Simulador | TEST (seguro) |
| Tarjetas | De prueba | De prueba (TEST) |
| URLs Públicas | No | Sí, accesibles desde internet |
| HTTPS | No | Sí, Railway lo maneja |

### Por Qué Railway Funciona (Cuando ngrok Falló)

```
ngrok FREE:
❌ Tiene página de verificación "Verify you are human"
❌ Transbank no puede pasar CAPTCHA
❌ Retorna 401 Unauthorized
❌ Dispara simulador como fallback

Railway:
✅ URLs públicas reales sin verificación
✅ Transbank puede acceder directamente
✅ Sin intermediarios
✅ Formulario REAL visible
✅ Pago procesa correctamente
```

---

## 🚀 PRÓXIMOS PASOS DESPUÉS DE RAILWAY

1. **Cambiar a Transbank PRODUCCIÓN** (cuando esté listo)
   ```
   TRANSBANK_ENV = PRODUCTION
   Commerce Code = tu código real de Transbank
   ```

2. **Usar tarjetas REALES** (con PRODUCCIÓN habilitado)

3. **Implementar SSL/TLS** (Railway incluye HTTPS automáticamente)

4. **Escalar base de datos** si es necesario

5. **Agregar más funcionalidades** (admin panel, reportes, etc.)

---

**¿Necesitas ayuda?** Lee esta checklist de arriba a abajo, paso a paso.
**¿Listo?** Comienza con PASO 1: Preparar GitHub.
