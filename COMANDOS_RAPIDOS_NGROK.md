# 🚀 COMANDOS RÁPIDOS - NGROK Y TRANSBANK

## 📦 INSTALACIÓN INICIAL (Solo una vez)

```powershell
# Instalar ngrok globalmente
npm install -g ngrok

# Verificar instalación
ngrok version

# Autenticar ngrok (reemplaza con tu token)
ngrok config add-authtoken TU_TOKEN_AQUI
```

---

## 🎯 INICIO RÁPIDO (Cada sesión de desarrollo)

### Opción 1: Usar scripts automatizados (RECOMENDADO)

```powershell
# Terminal 1: Iniciar ngrok
npm run start:ngrok

# Terminal 2: Iniciar backend
cd backend
npm start

# Terminal 3: Iniciar frontend
cd frontend
npm start
```

### Opción 2: Manual

```powershell
# Terminal 1: ngrok
ngrok start --all --config=ngrok-config.yml

# Terminal 2: Backend
cd backend
npm start

# Terminal 3: Frontend
cd frontend
npm start
```

---

## 📋 ACTUALIZAR .ENV CON URLS DE NGROK

```powershell
# 1. Copia la URL del FRONTEND de ngrok (ejemplo: https://def456.ngrok.io)

# 2. Edita backend/.env
code backend\.env

# 3. Cambia esta línea:
# FRONTEND_URL=https://def456.ngrok.io

# 4. Guarda y reinicia backend (Ctrl+C en Terminal 2, luego npm start)
```

---

## 🌐 ACCEDER A LA APLICACIÓN

```powershell
# Dashboard de ngrok (ver peticiones en tiempo real)
start http://127.0.0.1:4040

# Aplicación (usa la URL de ngrok del FRONTEND)
start https://def456.ngrok.io
```

---

## 🧪 PRUEBAS DE TRANSBANK

### Tarjetas de prueba

```
✅ PAGO EXITOSO
Tarjeta: 4051 8856 0044 6623
CVV: 123
Vencimiento: 12/25
RUT: 11.111.111-1
Clave: 123

❌ PAGO RECHAZADO
Tarjeta: 4051 8842 3993 7763
CVV: 123
Vencimiento: 12/25

🚫 CANCELACIÓN
Haz clic en "Cancelar" en el formulario de Transbank

⏱️ TIMEOUT
Espera 10 minutos sin ingresar datos
```

---

## 🔧 ENDPOINTS ADMIN (Requiere autenticación)

### Consultar estado de transacción

```powershell
# Reemplaza TU_NGROK_URL, TU_JWT_TOKEN y TU_TOKEN_TRANSBANK
curl https://TU_NGROK_URL/api/payments/transaction/status/TU_TOKEN_TRANSBANK `
  -H "Authorization: Bearer TU_JWT_TOKEN"
```

### Reembolsar transacción

```powershell
# Reemplaza valores según tu caso
curl -X POST https://TU_NGROK_URL/api/payments/refund `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer TU_JWT_TOKEN" `
  -d '{\"token\":\"TU_TOKEN_TRANSBANK\",\"amount\":10000}'
```

### Reconciliar transacciones pendientes

```powershell
curl -X POST https://TU_NGROK_URL/api/payments/reconcile `
  -H "Authorization: Bearer TU_JWT_TOKEN"
```

---

## 🔍 VERIFICACIÓN RÁPIDA

### Ver logs del backend en tiempo real

```powershell
# En la terminal del backend, los logs aparecen automáticamente
# Busca estos mensajes:

# ✅ ÉXITO (Transbank real)
"✓ Transacción creada exitosamente con Transbank"
"✓ URL de Transbank: https://webpay3gint.transbank.cl/..."

# ❌ ERROR (Cayó en simulador)
"✗ Error 401"
"✗ Redirigiendo a simulador"
```

### Consultar última orden en MongoDB

```powershell
# Abrir mongosh
mongosh

# Consultar última orden
use dejoaromas
db.orders.find().sort({createdAt: -1}).limit(1).pretty()

# Salir
exit
```

### Ver todas las peticiones HTTP en ngrok

```
Abre: http://127.0.0.1:4040

Aquí verás:
- Todas las peticiones que pasan por ngrok
- Headers completos
- Respuestas
- Tiempos de respuesta
```

---

## 🛑 DETENER TODO

```powershell
# En cada terminal, presiona:
Ctrl + C

# O cierra las ventanas de terminal directamente
```

---

## 🔄 REINICIAR TODO (después de cambiar código)

```powershell
# 1. Detener todo (Ctrl+C en cada terminal)

# 2. Reiniciar en este orden:

# Terminal 1: ngrok (solo si se cerró)
npm run start:ngrok

# Terminal 2: Backend
cd backend
npm start

# Terminal 3: Frontend
cd frontend
npm start
```

---

## 🐛 TROUBLESHOOTING RÁPIDO

### ngrok no inicia

```powershell
# Verificar que está instalado
ngrok version

# Si no está instalado
npm install -g ngrok

# Autenticar
ngrok config add-authtoken TU_TOKEN
```

### Backend no encuentra FRONTEND_URL

```powershell
# Verificar que .env tiene la URL correcta
cat backend\.env | Select-String "FRONTEND_URL"

# Debe mostrar:
# FRONTEND_URL=https://tu-url-de-ngrok.ngrok.io

# Si no, edita:
code backend\.env

# Y reinicia backend
```

### Sigo viendo el simulador

```powershell
# 1. Verificar URL en .env
cat backend\.env | Select-String "FRONTEND_URL"

# 2. Reiniciar backend
# (Ctrl+C en terminal del backend, luego npm start)

# 3. Limpiar caché del navegador
# Ctrl + Shift + R

# 4. Asegurarte de acceder vía URL de ngrok
# https://tu-url.ngrok.io (NO localhost:3000)
```

### Error CORS

```powershell
# 1. Verificar FRONTEND_URL en backend/.env
# Debe ser EXACTAMENTE la URL de ngrok, sin / al final

# 2. Reiniciar backend

# 3. Si persiste, verificar en backend/server.js o index.js
# que CORS esté configurado para aceptar FRONTEND_URL
```

---

## 📊 MONITOREO EN TIEMPO REAL

### Dashboard de ngrok

```
URL: http://127.0.0.1:4040

Muestra:
- Todas las peticiones HTTP/HTTPS
- Códigos de respuesta (200, 401, 500, etc.)
- Tiempos de respuesta
- Headers completos
- Body de requests/responses
```

### Logs del backend

```
Terminal 2 (donde corre el backend)

Busca:
✓ = Operación exitosa
✗ = Error
ℹ = Información
```

---

## 🎯 CHECKLIST ANTES DE CADA SESIÓN

```
[ ] ngrok instalado y autenticado
[ ] Backend corriendo (Terminal 2)
[ ] Frontend corriendo (Terminal 3)
[ ] ngrok exponiendo puertos (Terminal 1)
[ ] backend/.env actualizado con URL de ngrok
[ ] Backend reiniciado después de cambiar .env
[ ] Accedo vía URL de ngrok (NO localhost)
[ ] Dashboard de ngrok abierto (http://127.0.0.1:4040)
```

---

## 💡 TIPS ÚTILES

### URLs de ngrok cambian al reiniciar (plan gratuito)

Cada vez que detengas y reinicies ngrok, las URLs serán diferentes.

**Solución rápida:**
1. Copia la nueva URL del frontend
2. Actualiza `backend/.env`
3. Reinicia backend

**Solución permanente:**
- Plan de pago de ngrok ($8/mes) con URLs fijas

### Sesiones de ngrok expiran (2 horas)

Después de 2 horas, ngrok cierra la sesión.

**Solución:**
1. Reinicia ngrok: `npm run start:ngrok`
2. Actualiza `.env` si las URLs cambiaron
3. Reinicia backend

### Desarrollo local sin ngrok

Si solo quieres probar funcionalidades que NO requieren Transbank:

```powershell
# Backend
cd backend
npm start

# Frontend
cd frontend
npm start

# Accede a:
http://localhost:3000

# El simulador funcionará normalmente
```

### Producción real

En producción NO uses ngrok. Despliega en:
- Railway
- Render
- Heroku
- AWS
- Azure
- Google Cloud
- Tu propio servidor VPS

Con dominio propio y SSL.

---

## 📚 DOCUMENTACIÓN ADICIONAL

- **Guía completa:** Ver `NGROK_SETUP_GUIDE.md`
- **Checklist detallado:** Ver `CHECKLIST_NGROK.md`
- **Implementación Transbank:** Ver `TRANSBANK_IMPLEMENTATION_COMPLETE_V2.md`
- **Guía admin:** Ver `GUIA_RAPIDA_ADMIN.md`

---

## 🎓 PARA TU ERS

Documenta:
1. Configuración de ambiente de desarrollo con ngrok
2. Diferencias entre desarrollo (ngrok) y producción
3. Procedimiento de pruebas con tarjetas de Transbank
4. Screenshots del formulario REAL de Webpay
5. Casos de prueba ejecutados (éxito, rechazo, cancelar, timeout)

---

## ✅ ÉXITO GARANTIZADO

Si sigues estos pasos:
1. ngrok autenticado ✓
2. .env actualizado con URL de ngrok ✓
3. Backend reiniciado ✓
4. Accedes vía URL de ngrok ✓

**Resultado:** Verás el formulario REAL de Transbank Webpay 🎉

---

**¿Necesitas ayuda? Revisa los logs del backend y el dashboard de ngrok.**
