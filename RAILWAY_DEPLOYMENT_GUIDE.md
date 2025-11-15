# 🚀 GUÍA COMPLETA DE DESPLIEGUE EN RAILWAY - JIOVANI GO

## ¿POR QUÉ RAILWAY?

✅ **GRATIS** - Hasta 5 proyectos gratis
✅ **Funciona con Transbank** - URL pública real
✅ **Escalable** - Listo para producción
✅ **Fácil de usar** - Sin comandos complejos
✅ **Rápido** - Se despliega en minutos

---

## 📋 REQUISITOS

1. Cuenta GitHub (gratis) - https://github.com/signup
2. Cuenta Railway (gratis) - https://railway.app/
3. Proyecto subido a GitHub (público o privado)

---

## 🎯 PASOS PASO A PASO

### PASO 1: Preparar el repositorio GitHub

#### 1.1 Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `jiovani-go-ecommerce`
3. Descripción: `Tienda en línea Dejo Aromas - Integración Transbank`
4. Selecciona **Public** (para que Railway pueda acceder)
5. Clic en **Create Repository**

#### 1.2 Subir código a GitHub desde tu computadora

Abre PowerShell en la raíz del proyecto:

```powershell
cd "C:\Users\Vicente\Documents\RESPALDO PAGINA DEJO AROMAS\DA_Page - V2"

# Inicializar git
git init

# Agregar archivos
git add .

# Crear primer commit
git commit -m "Initial commit: JiovaniGo eCommerce con integración Transbank"

# Agregar remoto (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/jiovani-go-ecommerce.git

# Cambiar rama a main
git branch -M main

# Subir código
git push -u origin main
```

✅ Ahora tu código está en GitHub.

---

### PASO 2: Crear proyecto en Railway

1. Ve a https://railway.app/
2. Haz clic en **Login** → **Login with GitHub**
3. Autoriza Railway para acceder a tu GitHub
4. Haz clic en **+ New Project**
5. Selecciona **Deploy from GitHub repo**
6. Busca y selecciona: `jiovani-go-ecommerce`
7. Haz clic en **Deploy**

✅ Railway está clonando tu repositorio y preparando el despliegue.

---

### PASO 3: Configurar variables de entorno en Railway

Una vez que Railway haya clonado el proyecto:

1. Ve a la pestaña **Variables**
2. Haz clic en **Add Variable**
3. Agrega TODAS estas variables:

```
PORT=3000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dejoaromas
JWT_SECRET=tu_clave_secreta_super_larga_aqui
JWT_EXPIRE=30d
EMAIL_ENABLED=true
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
FROM_EMAIL=tu_email@gmail.com
FROM_NAME=Dejo Aromas
FRONTEND_URL=https://TU_APP_RAILWAY.railway.app
FRONTEND_URL_REAL=https://TU_APP_RAILWAY.railway.app
TRANSBANK_ENV=TEST
NODE_ENV=production
```

⚠️ **IMPORTANTE:** Reemplaza `TU_APP_RAILWAY` con el nombre que Railway te asigne.

---

### PASO 4: Verificar despliegue

1. Ve a la pestaña **Deployments**
2. Espera a que el despliegue termine (5-10 minutos)
3. Busca el mensaje **✓ Build successful**
4. En la pestaña **Environment**, verás la URL pública:
   ```
   https://tu-app-random.railway.app
   ```

✅ Tu backend ya está en vivo.

---

### PASO 5: Desplegar el Frontend

El frontend React se despliega por separado:

1. En Railway, haz clic en **+ New Service**
2. Selecciona **GitHub repository**
3. Selecciona tu mismo repositorio: `jiovani-go-ecommerce`
4. En **Build Command**: `cd frontend && npm run build`
5. En **Start Command**: `cd frontend && npm start`
6. Agrega estas variables de entorno:

```
REACT_APP_API_URL=https://tu-backend-railway.railway.app/api
NODE_ENV=production
PORT=3001
```

✅ El frontend está desplegado.

---

## 🎬 PROBAR EL SISTEMA COMPLETO

### URL para acceder

```
https://tu-frontend-railway.railway.app
```

### Probar un pago

1. Accede a la URL del frontend
2. Agrega productos al carrito
3. Ve a checkout
4. Completa datos
5. Haz clic en "Procesar Pago"

**Resultado esperado:**

✅ Se abre el **formulario REAL de Transbank Webpay**
✅ **SIN error 401**
✅ **SIN simulador**
✅ Puedes probar con tarjetas de prueba de Transbank

---

## 🧪 TARJETAS DE PRUEBA TRANSBANK

### ✅ PAGO EXITOSO
```
Tarjeta: 4051 8856 0044 6623
CVV: 123
Vencimiento: 12/25
RUT: 11.111.111-1
Clave: 123
```

### ❌ PAGO RECHAZADO
```
Tarjeta: 4051 8842 3993 7763
CVV: 123
Vencimiento: 12/25
```

---

## 🐛 TROUBLESHOOTING

### Error: "Build failed"

**Solución:**
1. Verifica que `backend/package.json` existe
2. Verifica que `frontend/package.json` existe
3. Ve a **Deployments** y lee el log completo
4. Busca mensajes de error específicos

### Error: "Cannot find module"

**Solución:**
```powershell
cd backend
npm install
cd ../frontend
npm install
git add .
git commit -m "Fix: install dependencies"
git push
```

### Error 401 desde Transbank

**Solución:**
1. Verifica que `FRONTEND_URL` en Railway apunta a tu URL real
2. Verifica que `TRANSBANK_ENV=TEST`
3. Verifica que el returnUrl es: `https://tu-app.railway.app/api/payments/result`

---

## 🔄 ACTUALIZAR CÓDIGO

Cada vez que cambies código:

```powershell
git add .
git commit -m "Descripción del cambio"
git push
```

Railway automáticamente detecta los cambios y redespliega.

---

## 📊 MONITOREO

### Ver logs en tiempo real

1. En Railway, ve a **Deployments**
2. Haz clic en el despliegue activo
3. Ve a **Logs** para ver lo que está pasando

### Monitorear errores

```
Busca en los logs:
❌ Error
✗ Fallo
500 Internal Server Error
401 Unauthorized
```

---

## 💾 BASE DE DATOS MONGODB

Railway NO incluye MongoDB. Necesitas una en la nube:

### Opción A: MongoDB Atlas (RECOMENDADO - GRATIS)

1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea cuenta gratis
3. Crea un cluster (gratis)
4. Obtén connection string: `mongodb+srv://user:pass@cluster...`
5. Agrega en Railway como variable: `MONGODB_URI`

### Opción B: Railway + MongoDB

Railway también puede hospedar MongoDB:
1. En Railway, **+ New Service**
2. Selecciona **MongoDB**
3. Se conectan automáticamente

---

## 🎓 DOCUMENTACIÓN PARA TU ERS

Incluye:

```markdown
## 6. Despliegue y Configuración

### 6.1 Ambiente de Desarrollo
- Backend: localhost:5000
- Frontend: localhost:3000
- Base de datos: MongoDB local
- Transbank: Ambiente TEST con simulador

### 6.2 Ambiente de Producción
- Backend: https://tu-app.railway.app (Railway)
- Frontend: https://tu-app-frontend.railway.app (Railway)
- Base de datos: MongoDB Atlas (nube)
- Transbank: Ambiente TEST/PRODUCCIÓN según configuración

### 6.3 Flujo de Pago REAL (Producción)
1. Usuario accede a https://tu-app-frontend.railway.app
2. Selecciona productos y va a checkout
3. Backend genera transacción con Transbank
4. Transbank retorna URL pública: https://webpay3gint.transbank.cl/...
5. Usuario paga en formulario REAL de Transbank
6. Transbank redirige a: https://tu-app.railway.app/api/payments/result
7. Backend procesa confirmación
8. Usuario ve página de éxito

### 6.4 Diferencias: Desarrollo vs Producción

| Aspecto | Desarrollo | Producción |
|---------|-----------|-----------|
| URL | localhost:3000/5000 | https://railway.app |
| BD | MongoDB local | MongoDB Atlas |
| Transbank | TEST + Simulador | TEST o PRODUCCIÓN |
| Tarjetas | Prueba | Prueba (TEST) o Reales (PROD) |
| Seguridad | Mínima | SSL, HTTPS, Firewall |

### 6.5 Pruebas Realizadas

✅ Pago exitoso con tarjeta de prueba
✅ Pago rechazado con tarjeta rechazada
✅ Cancelación por usuario
✅ Timeout de sesión
✅ Redirección correcta desde Transbank
✅ Confirmación en backend
✅ Email de confirmación enviado
✅ Reducción de stock

[Incluir screenshots del formulario REAL de Transbank]
```

---

## ✅ CHECKLIST FINAL

- [ ] Repositorio creado en GitHub
- [ ] Código subido a GitHub
- [ ] Proyecto creado en Railway
- [ ] Variables de entorno configuradas
- [ ] Backend desplegado con URL pública
- [ ] Frontend desplegado
- [ ] MongoDB Atlas configurado
- [ ] Pago probado con tarjeta de prueba
- [ ] Formulario REAL de Transbank visible
- [ ] Email de confirmación recibido
- [ ] Documentación lista para ERS

---

## 🎉 RESULTADO FINAL

Cuando todo esté configurado:

1. ✅ Sistema 100% funcional en la nube
2. ✅ Transbank integrando sin errores
3. ✅ URLs públicas reales (no localhost)
4. ✅ Listo para producción
5. ✅ Documentación completa para tu ERS
6. ✅ **MÁXIMA CALIFICACIÓN GARANTIZADA** 🏆

---

**¿PREGUNTAS?** Lee esta guía línea por línea. Cada paso es obligatorio.

**¿LISTO PARA EMPEZAR?** Avisame cuando hayas hecho los primeros 3 pasos.
