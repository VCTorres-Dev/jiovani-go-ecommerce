# 🚀 GUÍA DE CONFIGURACIÓN NGROK - JIOVANI GO E-COMMERCE

## ¿Qué es ngrok y por qué lo necesitamos?

**Problema actual:**
- Tu aplicación corre en `http://localhost:3000` (frontend) y `http://localhost:5000` (backend)
- Transbank **NO PUEDE** acceder a `localhost` desde sus servidores
- Por eso ves el simulador en lugar del formulario real de Webpay

**Solución con ngrok:**
- ngrok crea un "túnel" público que redirige tráfico de internet a tu localhost
- Le da URLs públicas como: `https://abc123.ngrok.io`
- Transbank SÍ puede acceder a estas URLs públicas
- Resultado: Verás el formulario REAL de Webpay

---

## 📋 PASO 1: Crear cuenta gratuita en ngrok

1. Ve a: https://dashboard.ngrok.com/signup
2. Regístrate con GitHub, Google o email
3. Confirma tu email
4. Inicia sesión en: https://dashboard.ngrok.com

---

## 📋 PASO 2: Obtener tu authtoken

1. Una vez logueado, ve a: https://dashboard.ngrok.com/get-started/your-authtoken
2. Verás algo como: `2abcDEF123ghijKLMN456opqrSTUV789`
3. Copia ese token (lo necesitarás en el siguiente paso)

---

## 📋 PASO 3: Configurar ngrok con tu authtoken

### Opción A: Autenticar globalmente (RECOMENDADO)

Abre PowerShell y ejecuta:

```powershell
ngrok config add-authtoken TU_TOKEN_AQUI
```

Reemplaza `TU_TOKEN_AQUI` con el token que copiaste.

### Opción B: Usar archivo de configuración

Edita el archivo `ngrok-config.yml` en la raíz del proyecto:

```yml
authtoken: TU_TOKEN_AQUI
```

---

## 📋 PASO 4: Iniciar ngrok con ambos túneles

### Opción A: Usando el archivo de configuración (RECOMENDADO)

```powershell
ngrok start --all --config=ngrok-config.yml
```

### Opción B: Iniciar túneles individualmente (en 2 terminales separadas)

Terminal 1 (Backend):
```powershell
ngrok http 5000
```

Terminal 2 (Frontend):
```powershell
ngrok http 3000
```

---

## 📋 PASO 5: Copiar las URLs generadas

Verás algo como esto:

```
Session Status                online
Account                       tu_email@ejemplo.com
Version                       3.x.x
Region                        United States (us)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:5000
Forwarding                    https://def456.ngrok.io -> http://localhost:3000
```

**Copia estas URLs:**
- Backend URL: `https://abc123.ngrok.io`
- Frontend URL: `https://def456.ngrok.io`

⚠️ **IMPORTANTE:** Estas URLs cambian cada vez que reinicias ngrok (en plan gratuito)

---

## 📋 PASO 6: Actualizar variables de entorno

### Backend (.env)

Edita: `backend/.env`

```env
# IMPORTANTE: URL del frontend con ngrok
FRONTEND_URL=https://def456.ngrok.io

# Resto de variables permanecen igual
PORT=5000
MONGODB_URI=tu_mongodb_uri
JWT_SECRET=tu_secreto
# ... etc
```

### Frontend (.env o archivo de configuración)

Si tienes un `.env` en frontend, actualiza:

```env
REACT_APP_API_URL=https://abc123.ngrok.io
```

O actualiza directamente en tu código donde se define la URL base de la API.

---

## 📋 PASO 7: Reiniciar servidores

### Terminal 1: Backend
```powershell
cd backend
npm start
```

### Terminal 2: Frontend
```powershell
cd frontend
npm start
```

---

## 📋 PASO 8: Acceder a la aplicación

🌐 **Abre tu navegador en:** `https://def456.ngrok.io`

(Usa la URL de ngrok, NO localhost:3000)

---

## 🧪 PASO 9: Probar el flujo de pago REAL

1. Agrega productos al carrito
2. Ve al checkout
3. Completa los datos de envío
4. Haz clic en "Procesar Pago"

**¡Ahora SÍ deberías ver el formulario REAL de Transbank Webpay!**

---

## 🧪 TARJETAS DE PRUEBA DE TRANSBANK

Para probar en el ambiente de integración:

### ✅ PAGO EXITOSO
- **Tarjeta:** `4051 8856 0044 6623`
- **CVV:** `123`
- **Vencimiento:** Cualquier fecha futura
- **RUT:** `11.111.111-1`
- **Clave:** `123` (en webpay de prueba)

### ❌ PAGO RECHAZADO
- **Tarjeta:** `4051 8842 3993 7763`
- **CVV:** `123`
- **Vencimiento:** Cualquier fecha futura

### ⏱️ TIMEOUT (espera 10 minutos sin confirmar)

### 🚫 CANCELACIÓN (haz clic en "Cancelar" en el formulario de Transbank)

---

## 🔍 VERIFICAR QUE FUNCIONA

### 1. Verificar que ngrok está corriendo

Ve a: http://127.0.0.1:4040

Verás un dashboard con todas las peticiones HTTP que pasan por ngrok.

### 2. Verificar logs del backend

Deberías ver:

```
✓ Transacción creada exitosamente con Transbank
✓ URL de Transbank: https://webpay3gint.transbank.cl/...
✓ Token: abc123def456...
```

**NO deberías ver:**
```
✗ Error 401
✗ Redirigiendo a simulador
```

### 3. Verificar que Transbank responde

En los logs, busca:

```
POST /api/payments/init 200 1234ms
```

Si ves `200`, significa que Transbank aceptó la solicitud.

Si ves `401`, revisa que:
- ngrok esté corriendo
- FRONTEND_URL en .env apunte a la URL de ngrok
- Hayas reiniciado el backend

---

## ⚠️ LIMITACIONES DEL PLAN GRATUITO DE NGROK

1. **URLs cambian al reiniciar:** Cada vez que detengas y reinicies ngrok, obtendrás URLs diferentes. Tendrás que actualizar `.env` nuevamente.

2. **40 conexiones/minuto:** Suficiente para desarrollo, pero no para producción.

3. **Sesiones de 2 horas:** Después de 2 horas, la sesión se cierra. Solo reinicia ngrok.

4. **1 región:** Solo puedes usar 1 región (US por defecto).

**Solución:** Plan de pago ($8/mes) para URLs fijas y sin límites.

---

## 🔒 SEGURIDAD - MUY IMPORTANTE

### ⚠️ NUNCA en producción

ngrok es SOLO para desarrollo. En producción real:
- Despliega en Heroku, Railway, Render, AWS, etc.
- Usa tu propio dominio (ejemplo.com)
- Configura SSL/TLS adecuado
- Usa variables de entorno del servidor

### 🔐 No compartas tus URLs de ngrok

Las URLs de ngrok son públicas. Cualquiera con la URL puede acceder a tu aplicación.

Solo compártelas con personas de confianza durante desarrollo.

### 🚫 No subas ngrok-config.yml con tu authtoken

Agrega al `.gitignore`:

```
ngrok-config.yml
```

O borra la línea `authtoken:` antes de subir a GitHub.

---

## 🎯 VERIFICACIÓN FINAL - CHECKLIST

Antes de probar el pago, confirma:

- [ ] ngrok está corriendo (ves las URLs en terminal)
- [ ] Backend corriendo en `http://localhost:5000`
- [ ] Frontend corriendo en `http://localhost:3000`
- [ ] `.env` actualizado con URL de ngrok
- [ ] Backend reiniciado después de cambiar `.env`
- [ ] Accedes a la app vía URL de ngrok (no localhost)
- [ ] Dashboard de ngrok abierto en `http://127.0.0.1:4040`

---

## 🐛 TROUBLESHOOTING

### Problema: Sigo viendo el simulador

**Solución:**
1. Verifica que `FRONTEND_URL` en backend/.env tenga la URL de ngrok
2. Reinicia el backend
3. Limpia caché del navegador (Ctrl + Shift + R)
4. Accede SOLO vía URL de ngrok, no uses localhost

### Problema: Error "tunnel not found"

**Solución:**
1. Autentícate: `ngrok config add-authtoken TU_TOKEN`
2. Reinicia ngrok

### Problema: ngrok se cierra solo

**Solución:**
- Plan gratuito tiene sesiones de 2 horas
- Simplemente reinicia: `ngrok start --all --config=ngrok-config.yml`
- Actualiza URLs en `.env` si cambiaron

### Problema: Error CORS

**Solución:**
Tu backend ya tiene CORS configurado correctamente. Si ves errores CORS:
1. Verifica que `FRONTEND_URL` en `.env` coincida exactamente con la URL de ngrok
2. No incluyas `/` al final de la URL
3. Reinicia backend

---

## 📊 DIFERENCIAS: DESARROLLO vs PRODUCCIÓN

| Aspecto | Desarrollo (ngrok) | Producción Real |
|---------|-------------------|-----------------|
| URL | `https://abc123.ngrok.io` | `https://jiovani-go.com` |
| SSL | Automático (ngrok) | Certificado SSL propio |
| Transbank | Ambiente integración | Ambiente producción |
| Tarjetas | Tarjetas de prueba | Tarjetas reales |
| Dinero | No se cobra dinero real | Transacciones reales |
| Commerce Code | IntegrationCommerceCodes | Tu código real |
| API Key | IntegrationApiKeys | Tu API key real |
| Servidor | Tu laptop | Servidor cloud |

---

## 🎓 PARA TU DOCUMENTACIÓN ERS

Incluye una sección explicando:

```markdown
## 6.2 Configuración de Ambiente de Desarrollo

### 6.2.1 Limitaciones de localhost

Durante el desarrollo local, Transbank no puede acceder a `http://localhost:3000`
ya que esta dirección solo es accesible desde la máquina local.

### 6.2.2 Solución con ngrok

Se utiliza ngrok para crear túneles públicos temporales que permiten:
- Probar la integración real con Transbank
- Visualizar el formulario Webpay auténtico
- Validar el flujo completo de pago

### 6.2.3 Configuración

[Ver: NGROK_SETUP_GUIDE.md]

### 6.2.4 Ambiente de Producción

En producción, la aplicación se desplegará en un servidor con dominio público,
eliminando la necesidad de túneles temporales.
```

---

## ✅ RESULTADO ESPERADO

Después de completar todos estos pasos:

1. ✅ Accedes a tu app vía `https://def456.ngrok.io`
2. ✅ Agregas productos y vas a checkout
3. ✅ Haces clic en "Procesar Pago"
4. ✅ **Ves el formulario REAL de Transbank Webpay** (simple, profesional, auténtico)
5. ✅ Ingresas tarjeta de prueba
6. ✅ Transbank procesa el pago
7. ✅ Redirige a tu página de resultado
8. ✅ Tu backend recibe la confirmación
9. ✅ Orden se marca como completada
10. ✅ Stock se reduce
11. ✅ Email de confirmación enviado

**¡Ya no verás el simulador colorido! Verás el Webpay real de Transbank.**

---

## 📞 SOPORTE

Si tienes problemas:
1. Revisa el dashboard de ngrok: `http://127.0.0.1:4040`
2. Revisa los logs del backend (busca errores 401)
3. Verifica que las URLs de ngrok estén correctas en `.env`
4. Confirma que accediste vía URL de ngrok (no localhost)

---

**¡Ahora sí tienes todo listo para ver Transbank REAL en acción!** 🎉
