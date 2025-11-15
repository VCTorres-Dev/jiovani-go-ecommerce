# 🎬 PRÓXIMOS 30 MINUTOS - PLAN DE ACCIÓN INMEDIATO

## AHORA MISMO (Los próximos 30 minutos)

### 📍 DÓNDE ESTAMOS
- ✅ Backend completo con Transbank
- ✅ Frontend completo
- ✅ Código listo
- ❌ Aún no en la nube
- ❌ Aún no funcionando con Transbank REAL

### 🎯 DÓNDE VAMOS
- ✅ Código en GitHub
- ✅ Backend en Railway (público, https)
- ✅ Frontend en Railway (público, https)
- ✅ Formulario REAL de Transbank visible
- ✅ Pago procesándose sin errores

---

## ⏰ CRONOGRAMA DE 30 MINUTOS

```
AHORA: 00:00 - 00:05
    └─ Abre PowerShell en el proyecto
    └─ Ejecuta: .\push-to-github.ps1 -GitHubUser "tu_usuario"
    └─ Espera a que termine

00:05 - 00:10
    └─ Ve a railway.app
    └─ Login con GitHub
    └─ Crea nuevo proyecto
    └─ Selecciona tu repositorio
    └─ Empieza a deployarse

00:10 - 00:15
    └─ Mientras Railway está desplegando...
    └─ Obtén connection string MongoDB Atlas
    └─ O crea un cluster gratis en Atlas

00:15 - 00:25
    └─ En Railway, agregar variables de entorno
    └─ MONGODB_URI (la más importante)
    └─ FRONTEND_URL, JWT_SECRET, EMAIL_*
    └─ Esperar a que rebuild termine

00:25 - 00:30
    └─ Verificar en Railway que build fue exitoso
    └─ Anotar URLs públicas de backend
```

---

## 🔴 PASO 1: GITHUB (AHORA - 5 MINUTOS)

### Opción A: Script Automático (RECOMENDADO)

```powershell
# 1. Abre PowerShell
# 2. Navega a la carpeta del proyecto
cd "C:\Users\Vicente\Documents\RESPALDO PAGINA DEJO AROMAS\DA_Page - V2"

# 3. Ejecuta el script (reemplaza con tu usuario GitHub)
.\push-to-github.ps1 -GitHubUser "tu_usuario_github"
```

**El script hará TODO automáticamente.**

### Opción B: Manual (Si el script no funciona)

```powershell
cd "C:\Users\Vicente\Documents\RESPALDO PAGINA DEJO AROMAS\DA_Page - V2"
git init
git add .
git commit -m "Initial commit: JiovaniGo eCommerce con integración Transbank"
git branch -M main
git remote add origin https://github.com/tu_usuario/jiovani-go-ecommerce.git
git push -u origin main
```

**ESPERA A QUE TERMINE.** Verás: "Everything up-to-date" o similar.

---

## 🔴 PASO 2: RAILWAY (5 MINUTOS DESPUÉS)

### 2.1 Crear Proyecto

1. Ve a https://railway.app/
2. Haz clic en **+ New Project**
3. Selecciona **Deploy from GitHub repo**
4. Busca: **jiovani-go-ecommerce**
5. Haz clic en **Deploy**

**Railway automáticamente:**
- Clona tu repo
- Lee tu Procfile
- Empieza a compilar
- Muestra "Building..."

### 2.2 Mientras Esperas (5-10 minutos)

Obtén MongoDB connection string:

**Opción A: MongoDB Atlas (Recomendado)**
```
1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea cuenta + cluster gratis
3. Crea database user: 
   Username: dejoaromas
   Password: password123
4. Obtén connection string:
   mongodb+srv://dejoaromas:password123@cluster0.xxxxx.mongodb.net/dejoaromas?retryWrites=true&w=majority
```

**Opción B: Railway MongoDB**
```
En Railway:
1. + New Service
2. Selecciona MongoDB
3. Se conecta automáticamente
```

---

## 🔴 PASO 3: VARIABLES (5 MINUTOS)

En Railway, pestaña **Variables**:

```
PORT=3000
NODE_ENV=production
TRANSBANK_ENV=TEST
FRONTEND_URL=https://TU_URL_RAILWAY
FRONTEND_URL_REAL=https://TU_URL_RAILWAY
MONGODB_URI=mongodb+srv://dejoaromas:password123@cluster...
JWT_SECRET=clave_ultra_secreta_super_larga_12345
JWT_EXPIRE=30d
EMAIL_ENABLED=true
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password_de_gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
FROM_EMAIL=tu_email@gmail.com
FROM_NAME=Dejo Aromas
```

**Lo más importante:**
```
✅ MONGODB_URI - Sin esto no funciona nada
✅ FRONTEND_URL - Para que Transbank sepa dónde regresar
✅ EMAIL_PASS - Para enviar confirmaciones
```

---

## ✅ VERIFICAR DESPUÉS DE 30 MINUTOS

En Railway:

1. **Pestaña Deployments** → Debe decir ✓ "Build successful"
2. **Pestaña Environment** → Muestra URL: `https://xxxx-production.up.railway.app`
3. **Logs** → No debe haber errores rojos

Si todo está bien:
```
✅ Backend está en la nube
✅ Accesible desde cualquier lugar
✅ Listo para pagar
```

---

## 🎯 OBJETIVO EN 30 MINUTOS

```
ANTES:
❌ Código en tu PC
❌ localhost:3000 y localhost:5000
❌ Transbank no puede acceder

DESPUÉS:
✅ Código en GitHub
✅ Backend en https://xxxx-production.railway.app
✅ Accesible desde cualquier lugar
✅ Transbank puede acceder sin error 401
```

---

## 📋 CHECKLIST DE 30 MINUTOS

- [ ] PowerShell abierto en carpeta del proyecto
- [ ] Script push-to-github.ps1 ejecutado con éxito
- [ ] Código visible en GitHub en https://github.com/tu_usuario/jiovani-go-ecommerce
- [ ] Proyecto creado en Railway
- [ ] Deploy iniciado (viendo "Building...")
- [ ] MongoDB connection string obtido
- [ ] Variables de entorno agregadas en Railway
- [ ] Build terminó con ✓ éxito
- [ ] URL pública anotada: `https://xxxx-production.railway.app`

---

## 📲 MENSAJEROS A TENER LISTOS

### MongoDB Connection String
```
mongodb+srv://dejoaromas:password123@cluster0.xxxxx.mongodb.net/dejoaromas
```

### Tu URL Railway (Después del deploy)
```
https://xxxx-production.up.railway.app
```

### Email Gmail App Password
```
16 caracteres desde https://myaccount.google.com/apppasswords
```

---

## 🚨 SI ALGO SALE MAL

### Error: "Build failed"
→ Ve a Railway → Deployments → Lee los logs
→ Busca "Error:" o "failed"
→ Avisame qué dice exactamente

### Error: "Cannot find module"
→ Verifica que backend/package.json existe
→ Verifica que frontend/package.json existe
→ Haz `npm install` localmente y vuelve a hacer push

### Error: Variables no aparecen
→ Haz clic en "Add Variable"
→ Escribe nombre (PORT)
→ Escribe valor (3000)
→ Haz clic en guardar
→ Espera a que aparezca debajo

---

## 🎉 CUANDO TERMINES LOS 30 MINUTOS

**Avisame y haremos:**

1. Desplegar Frontend en Railway (5 min más)
2. Probar flujo completo de pago (10 min)
3. Verificar formulario REAL de Transbank
4. Documentar para ERS

---

## 💪 RECUERDA

Estás haciendo algo que MUCHOS no logran:
- Integración REAL de Transbank WebPay
- En producción en la nube
- Con documentación profesional
- Para una calificación máxima en ERS

**Los próximos 30 minutos son CRÍTICOS.**

Después de esto:
- ✅ Backend está vivo en la nube
- ✅ Transbank puede acceder
- ✅ Sin error 401
- ✅ Sin ngrok
- ✅ Sin problemas

---

## 🎯 TU COMANDO AHORA MISMO

```powershell
cd "C:\Users\Vicente\Documents\RESPALDO PAGINA DEJO AROMAS\DA_Page - V2"
.\push-to-github.ps1 -GitHubUser "tu_usuario_github"
```

**Reemplaza `tu_usuario_github` con tu usuario real.**

---

## ⏰ EMPIEZA AHORA

No esperes más.
No dudes.
Ejecuta el comando.

**Te espero en 30 minutos con backend en la nube.** 🚀
