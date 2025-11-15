# Variables de Entorno para Railway - Backend

## ✅ Variables CRÍTICAS para Transbank (ya configuradas):

```bash
TRANSBANK_COMMERCE_CODE=597055555532
TRANSBANK_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
TRANSBANK_ENV=integration
```

## 🌐 Variables de URLs (IMPORTANTE - Configura estas):

```bash
# URL del frontend desplegado (Netlify, Vercel, etc.)
# Ejemplo: https://tu-app-frontend.netlify.app
FRONTEND_URL_REAL=https://TU-FRONTEND-URL-AQUI

# URL pública del backend en Railway (Railway la genera automáticamente)
# Ejemplo: https://jiovani-go-ecommerce-production.up.railway.app
# NO necesitas configurar RAILWAY_PUBLIC_DOMAIN, Railway la genera automáticamente

# MongoDB (opcional para testing)
MONGODB_URI=mongodb+srv://tu-usuario:tu-password@cluster.mongodb.net/dejoaromas

# JWT Secret (para autenticación)
JWT_SECRET=tu-secret-super-seguro-aqui-cambiar-en-produccion

# Puerto (Railway lo asigna automáticamente)
PORT=5000
```

## 📝 Cómo configurar en Railway:

1. Ve a tu proyecto en Railway
2. Click en "Variables"
3. Agrega cada variable con su valor
4. Click en "Deploy" para aplicar cambios

## ⚠️ IMPORTANTE:

- **FRONTEND_URL_REAL**: Debe ser la URL pública de tu frontend (sin barra final)
- **TRANSBANK_ENV**: Mantener en "integration" para testing
- **TRANSBANK_COMMERCE_CODE** y **TRANSBANK_API_KEY**: Son públicos para integración

## 🔄 Flujo de redirección:

1. Usuario hace pago → Frontend llama a `/api/payments/init-test`
2. Backend crea orden y obtiene token de Transbank
3. Frontend redirige a → `https://webpay3gint.transbank.cl/webpayserver/initTransaction?token_ws=XXX`
4. Usuario paga en Transbank
5. Transbank redirige a → `https://tu-backend.railway.app/api/payments/result?token_ws=XXX`
6. Backend redirige a → `https://tu-frontend.com/payment/result?token_ws=XXX`
7. Frontend llama a `/api/payments/confirm` y muestra resultado

## 🎯 Próximos pasos después de configurar:

1. Configurar FRONTEND_URL_REAL en Railway
2. Push de cambios a GitHub
3. Esperar deploy en Railway
4. Testear flujo completo desde frontend desplegado
