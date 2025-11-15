# 🔧 COMANDOS EXACTOS PARA RAILWAY

## ⚡ OPCIÓN RÁPIDA: Solo Comandos

Si eres de "copy-paste":

### PASO 1: GitHub Push
```powershell
cd "C:\Users\Vicente\Documents\RESPALDO PAGINA DEJO AROMAS\DA_Page - V2"
.\push-to-github.ps1 -GitHubUser "aqui_tu_usuario_github"
```

---

## 📋 OPCIÓN MANUAL: Comando por Comando

### Paso 1.1: Iniciar Git
```powershell
cd "C:\Users\Vicente\Documents\RESPALDO PAGINA DEJO AROMAS\DA_Page - V2"
git init
```

### Paso 1.2: Agregar Archivos
```powershell
git add .
```

### Paso 1.3: Crear Commit
```powershell
git commit -m "Initial commit: JiovaniGo eCommerce con integración Transbank"
```

### Paso 1.4: Cambiar a main
```powershell
git branch -M main
```

### Paso 1.5: Agregar Remoto
```powershell
git remote add origin https://github.com/TU_USUARIO/jiovani-go-ecommerce.git
```

**REEMPLAZA TU_USUARIO CON TU USUARIO GITHUB**

### Paso 1.6: Hacer Push
```powershell
git push -u origin main
```

Pedirá usuario/contraseña de GitHub.

---

## 🌐 Variables de Entorno Para Copiar

Copia estas exactamente en Railway (Variables tab):

```
PORT
3000

NODE_ENV
production

TRANSBANK_ENV
TEST

FRONTEND_URL
https://tu-app-railway.railway.app

FRONTEND_URL_REAL
https://tu-app-railway.railway.app

JWT_SECRET
clave_ultra_secreta_aqui_12345_no_cambiar

JWT_EXPIRE
30d

MONGODB_URI
mongodb+srv://dejoaromas:password123@cluster0.xxxxx.mongodb.net/dejoaromas

EMAIL_ENABLED
true

EMAIL_USER
tu_email@gmail.com

EMAIL_PASS
app_password_de_gmail

SMTP_HOST
smtp.gmail.com

SMTP_PORT
587

FROM_EMAIL
tu_email@gmail.com

FROM_NAME
Dejo Aromas
```

---

## 🏗️ Configuración Frontend en Railway

Cuando agregues el Frontend como nuevo Service:

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

**Variables:**
```
REACT_APP_API_URL
https://tu-backend-railway.railway.app/api

NODE_ENV
production

PORT
3001
```

---

## 🧪 Tarjetas de Prueba Transbank

### ✅ PAGO EXITOSO
```
Número: 4051 8856 0044 6623
CVV: 123
Vencimiento: 12/25
RUT: 11.111.111-1
Clave Transbank: 123
```

### ❌ PAGO RECHAZADO
```
Número: 4051 8842 3993 7763
CVV: 123
Vencimiento: 12/25
RUT: 11.111.111-1
```

---

## 🔐 Gmail App Password (Emails)

1. Ve a https://myaccount.google.com/apppasswords
2. Selecciona **Mail** y **Windows Computer**
3. Gmail genera contraseña de 16 caracteres
4. Copia exactamente (sin espacios)
5. Pega en Railway como EMAIL_PASS

---

## 📊 MongoDB Atlas Connection String

1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea cluster gratis
3. Database user: `dejoaromas` / `password123`
4. Connection string:
   ```
   mongodb+srv://dejoaromas:password123@cluster0.xxxxx.mongodb.net/dejoaromas?retryWrites=true&w=majority
   ```
5. Copia en Railway como MONGODB_URI

---

## ✅ Checklist: Lo Que Verificar

Después de Railway deploy:

- [ ] Build status: ✓ Build successful
- [ ] Backend URL visible: https://xxxx-railway.app
- [ ] Variables todas agregadas
- [ ] MongoDB conectado (sin "Connection refused")
- [ ] Logs sin errores rojos

---

## 🚨 Si Algo Falla

### Error: git command not found
```
Necesitas instalar Git:
https://git-scm.com/download/win
```

### Error: Railway build failed
```
Ve a Railways Deployments
Lee los logs completos
Busca: "Error:" o "failed"
Avisame qué dice
```

### Error: 401 Unauthorized en Transbank
```
Verifica:
1. FRONTEND_URL correcto
2. TRANSBANK_ENV = TEST
3. MongoDB conectado
4. returnUrl = backend_url/api/payments/result
```

---

## 📱 URLs Finales (Después de Deploy)

### Backend
```
https://tu-app-production.up.railway.app
```

### Frontend
```
https://tu-app-frontend-production.up.railway.app
```

### API Base
```
https://tu-app-production.up.railway.app/api
```

### Pago
```
https://tu-app-frontend-production.up.railway.app → Checkout → Pagar
```

---

## 🎯 Paso a Paso Rápido

```
1. .\push-to-github.ps1 -GitHubUser "usuario"          (5 min)
2. railway.app → + New Project → Deploy               (10 min)
3. Agregar variables MONGODB_URI, FRONTEND_URL, etc   (5 min)
4. Esperar build exitoso                              (5 min)
5. Agregar Frontend como nuevo service                (5 min)
6. Probar pago con tarjeta 4051 8856 0044 6623       (5 min)
```

**Total: ~35 minutos**

---

## 💾 URLs a Anotar Cuando Termines

Anota estas URLs para documentación ERS:

```
Backend URL: ________________________________
Frontend URL: _______________________________
MongoDB Atlas: ______________________________
```

---

## 🚀 COMIENZA AQUÍ

```powershell
cd "C:\Users\Vicente\Documents\RESPALDO PAGINA DEJO AROMAS\DA_Page - V2"
.\push-to-github.ps1 -GitHubUser "tu_usuario"
```

Espera a que diga: "¡Push completado exitosamente!"

Luego:
1. Ve a railway.app
2. Sigue RAILWAY_CHECKLIST.md

---

¿Dudas? Lee RAILWAY_DEPLOYMENT_GUIDE.md
¿Pasos? Lee RAILWAY_CHECKLIST.md
¿Entender todo? Lee README_RAILWAY.md
