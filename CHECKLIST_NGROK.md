# ✅ CHECKLIST - CONFIGURACIÓN NGROK PASO A PASO

## 📋 FASE 1: PREPARACIÓN (5 minutos)

### ✅ 1.1 Instalar ngrok
```powershell
npm install -g ngrok
```
**Verifica:** Ejecuta `ngrok version` - debe mostrar la versión instalada

---

### ✅ 1.2 Crear cuenta en ngrok
1. Ve a: https://dashboard.ngrok.com/signup
2. Regístrate (GitHub, Google o email)
3. Confirma tu email
4. Inicia sesión

**Verifica:** Debes ver el dashboard de ngrok

---

### ✅ 1.3 Obtener authtoken
1. Ve a: https://dashboard.ngrok.com/get-started/your-authtoken
2. Copia el token (ejemplo: `2abcDEF123ghijKLMN456opqrSTUV789`)

**Verifica:** El token tiene aproximadamente 30-40 caracteres alfanuméricos

---

## 📋 FASE 2: CONFIGURACIÓN (3 minutos)

### ✅ 2.1 Autenticar ngrok globalmente (RECOMENDADO)
```powershell
ngrok config add-authtoken TU_TOKEN_AQUI
```

**Verifica:** Debe mostrar: "Authtoken saved to configuration file"

---

### ✅ 2.2 Editar ngrok-config.yml
1. Abre: `ngrok-config.yml` en la raíz del proyecto
2. Reemplaza `YOUR_AUTHTOKEN_HERE` con tu token real
3. Guarda el archivo

**Verifica:** El archivo debe verse así:
```yml
version: "2"
authtoken: 2abcDEF123ghijKLMN456opqrSTUV789

tunnels:
  backend:
    proto: http
    addr: 5000
  frontend:
    proto: http
    addr: 3000
```

---

## 📋 FASE 3: INICIAR SERVIDORES (2 minutos)

### ✅ 3.1 Iniciar Backend
**Terminal 1:**
```powershell
cd backend
npm start
```

**Verifica:** Debe mostrar:
```
✓ MongoDB conectada
✓ Servidor corriendo en puerto 5000
```

---

### ✅ 3.2 Iniciar Frontend
**Terminal 2:**
```powershell
cd frontend
npm start
```

**Verifica:** Debe abrir automáticamente http://localhost:3000

---

## 📋 FASE 4: INICIAR NGROK (2 minutos)

### ✅ 4.1 Iniciar túneles ngrok
**Terminal 3:**
```powershell
npm run start:ngrok
```

O directamente:
```powershell
ngrok start --all --config=ngrok-config.yml
```

**Verifica:** Debes ver algo como:
```
Session Status                online
Forwarding                    https://abc123.ngrok.io -> http://localhost:5000
Forwarding                    https://def456.ngrok.io -> http://localhost:3000
```

---

### ✅ 4.2 Copiar URLs de ngrok
Copia las dos URLs que aparecen:
- **Backend URL:** `https://abc123.ngrok.io`
- **Frontend URL:** `https://def456.ngrok.io`

⚠️ **IMPORTANTE:** Copia las URLs HTTPS (no las HTTP)

---

## 📋 FASE 5: CONFIGURAR .ENV (1 minuto)

### ✅ 5.1 Actualizar backend/.env
1. Abre: `backend/.env`
2. Encuentra la línea: `FRONTEND_URL=http://localhost:3000`
3. Reemplázala con tu URL de ngrok del FRONTEND:
```env
FRONTEND_URL=https://def456.ngrok.io
```
4. ⚠️ **NO pongas `/` al final**
5. Guarda el archivo

**Verifica:** La línea debe verse así (con TU URL de ngrok):
```env
FRONTEND_URL=https://def456.ngrok.io
```

---

### ✅ 5.2 Reiniciar Backend
1. Ve a la terminal del backend (Terminal 1)
2. Presiona `Ctrl + C` para detener
3. Ejecuta nuevamente:
```powershell
npm start
```

**Verifica:** Backend debe iniciar sin errores

---

## 📋 FASE 6: PROBAR TRANSBANK REAL (5 minutos)

### ✅ 6.1 Abrir aplicación con URL de ngrok
1. Abre tu navegador
2. **NO uses** http://localhost:3000
3. **USA** la URL de ngrok del frontend: `https://def456.ngrok.io`

**Verifica:** La aplicación debe cargar normalmente

---

### ✅ 6.2 Dashboard de ngrok (OPCIONAL - MUY ÚTIL)
Abre en otro tab: http://127.0.0.1:4040

Aquí verás TODAS las peticiones HTTP que pasan por ngrok en tiempo real.

---

### ✅ 6.3 Agregar productos al carrito
1. Navega por la tienda
2. Agrega varios productos al carrito
3. Ve al carrito

**Verifica:** Los productos deben aparecer correctamente

---

### ✅ 6.4 Ir a Checkout
1. Haz clic en "Proceder al Pago" o similar
2. Completa los datos de envío:
   - Nombre completo
   - Dirección
   - Teléfono
   - Email

**Verifica:** El formulario debe validarse correctamente

---

### ✅ 6.5 Iniciar pago con Transbank
1. Haz clic en "Procesar Pago" o "Pagar con Webpay"
2. Espera unos segundos...

**🎉 MOMENTO CRÍTICO: ¿Qué ves?**

### ✅ ÉXITO: Formulario REAL de Transbank
Si ves:
- Diseño simple y profesional
- Logo de Transbank en la parte superior
- Fondo blanco/gris claro
- Formulario para ingresar datos de tarjeta
- URL: `https://webpay3gint.transbank.cl/...`

**¡FELICIDADES! La integración está funcionando correctamente.**

### ❌ ERROR: Simulador colorido
Si ves:
- Diseño colorido con gradientes
- Logo "jiovaniGo Chile"
- Banner amarillo que dice "Estás en el simulador..."
- URL: `https://def456.ngrok.io/payment/simulate`

**Algo salió mal. Revisa:**
1. ¿Actualizaste `FRONTEND_URL` en `backend/.env`?
2. ¿Reiniciaste el backend después de cambiar `.env`?
3. ¿Estás accediendo vía URL de ngrok (no localhost)?
4. ¿ngrok está corriendo sin errores?

---

### ✅ 6.6 Probar pago exitoso
En el formulario REAL de Transbank, ingresa:

**Tarjeta de prueba (ÉXITO):**
- **Número:** `4051 8856 0044 6623`
- **CVV:** `123`
- **Vencimiento:** Cualquier fecha futura (ej: 12/25)
- **RUT:** `11.111.111-1`
- **Clave:** `123`

Haz clic en "Pagar" o "Continuar"

**Verifica:**
- Transbank procesa el pago
- Redirige a tu página de resultado
- Muestra "Pago Exitoso" o similar
- Puedes ver los detalles de la transacción

---

### ✅ 6.7 Verificar en el backend
Revisa los logs de la terminal del backend (Terminal 1)

**Debes ver:**
```
✓ Transacción creada exitosamente con Transbank
✓ URL de Transbank: https://webpay3gint.transbank.cl/...
✓ Token recibido: abc123def456...
✓ Pago confirmado exitosamente
✓ Código de autorización: 123456
✓ Orden actualizada a 'completed'
✓ Stock reducido
✓ Email enviado
```

**NO debes ver:**
```
✗ Error 401
✗ Redirigiendo a simulador
```

---

### ✅ 6.8 Verificar orden en base de datos
Puedes usar MongoDB Compass o la terminal:

```powershell
mongosh
use dejoaromas
db.orders.find().sort({createdAt: -1}).limit(1).pretty()
```

**Verifica:**
- `status: 'completed'`
- `transbank.authorizationCode` tiene un valor
- `transbank.status: 'AUTHORIZED'`
- `transbank.responseCode: 0`

---

## 📋 FASE 7: PROBAR OTROS CASOS (OPCIONAL - 10 minutos)

### ✅ 7.1 Probar pago rechazado
Usa esta tarjeta:
- **Número:** `4051 8842 3993 7763`
- **CVV:** `123`

**Verifica:** Transbank rechaza el pago, orden queda en 'failed'

---

### ✅ 7.2 Probar cancelación por usuario
1. Inicia un pago normal
2. En el formulario de Transbank, haz clic en "Cancelar" o "Volver"

**Verifica:** Orden queda en 'cancelled', `cancelledByUser: true`

---

### ✅ 7.3 Probar timeout (10 minutos)
1. Inicia un pago normal
2. NO ingreses ningún dato
3. Espera 10 minutos sin hacer nada
4. Transbank cierra la sesión automáticamente

**Verifica:** Orden queda en 'failed', `timeoutExpired: true`

---

## 📋 FASE 8: ENDPOINTS ADMIN (OPCIONAL - 5 minutos)

### ✅ 8.1 Consultar estado de transacción

Primero, obtén un token de una transacción exitosa (del dashboard de ngrok o logs).

```powershell
curl https://abc123.ngrok.io/api/payments/transaction/status/TU_TOKEN_AQUI `
  -H "Authorization: Bearer TU_JWT_TOKEN"
```

**Verifica:** Debe devolver todos los detalles de la transacción

---

### ✅ 8.2 Reembolsar transacción

```powershell
curl -X POST https://abc123.ngrok.io/api/payments/refund `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer TU_JWT_TOKEN" `
  -d '{\"token\":\"TU_TOKEN_AQUI\",\"amount\":10000}'
```

**Verifica:**
- Transbank procesa el reembolso
- Stock se devuelve al inventario
- Orden se marca como `refunded: true`

---

### ✅ 8.3 Reconciliar transacciones pendientes

```powershell
curl -X POST https://abc123.ngrok.io/api/payments/reconcile `
  -H "Authorization: Bearer TU_JWT_TOKEN"
```

**Verifica:** Debe devolver un reporte de transacciones procesadas

---

## 🎯 RESUMEN FINAL

### ✅ TODO FUNCIONA SI:
- [ ] ngrok instalado y autenticado
- [ ] ngrok-config.yml configurado con tu authtoken
- [ ] Backend corriendo en localhost:5000
- [ ] Frontend corriendo en localhost:3000
- [ ] ngrok exponiendo ambos puertos
- [ ] FRONTEND_URL actualizado en backend/.env con URL de ngrok
- [ ] Backend reiniciado después de cambiar .env
- [ ] Accedes vía URL de ngrok (no localhost)
- [ ] **VES EL FORMULARIO REAL DE TRANSBANK** ✨
- [ ] Puedes pagar con tarjetas de prueba
- [ ] Transacciones se registran correctamente
- [ ] Todos los 4 casos funcionan (éxito, rechazo, cancelar, timeout)

---

## 🐛 TROUBLESHOOTING RÁPIDO

### Problema: "tunnel not found"
**Solución:** Autentica ngrok
```powershell
ngrok config add-authtoken TU_TOKEN
```

### Problema: Sigo viendo el simulador
**Solución:**
1. Verifica `FRONTEND_URL` en `backend/.env`
2. Reinicia backend
3. Accede SOLO vía URL de ngrok
4. Limpia caché del navegador (Ctrl + Shift + R)

### Problema: Error CORS
**Solución:**
- Verifica que `FRONTEND_URL` sea exactamente la URL de ngrok
- NO incluyas `/` al final
- Reinicia backend

### Problema: ngrok se cierra solo
**Solución:**
- Plan gratuito: sesiones de 2 horas
- Reinicia: `npm run start:ngrok`
- Actualiza URLs en `.env` si cambiaron

---

## 📞 SOPORTE

Si algo no funciona:
1. Revisa los logs del backend (Terminal 1)
2. Revisa el dashboard de ngrok (http://127.0.0.1:4040)
3. Busca errores 401 en los logs
4. Verifica que accediste vía URL de ngrok

---

## 🎉 ¡ÉXITO!

Cuando veas el formulario REAL de Transbank Webpay, habrás logrado:
- ✅ Integración completa con Transbank
- ✅ Ambiente de desarrollo funcional
- ✅ Flujo de pago auténtico
- ✅ Todos los casos especiales implementados
- ✅ Sistema listo para documentar en ERS

**¡Felicidades! Tu implementación de Transbank está completa y funcionando.** 🎊
