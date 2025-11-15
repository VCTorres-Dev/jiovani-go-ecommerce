# ⚡ COMANDOS RÁPIDOS - Deployment Final

## 🚀 OPCIÓN 1: Deploy Frontend con Netlify (RECOMENDADO)

### Paso 1: Instalar Netlify CLI (solo una vez)
```powershell
npm install -g netlify-cli
```

### Paso 2: Login en Netlify
```powershell
netlify login
```
Se abrirá el navegador para autorizar.

### Paso 3: Deploy desde carpeta frontend
```powershell
cd frontend
npm install
npm run build
netlify deploy --prod
```

Cuando pregunte:
- **Publish directory:** escribe `build` y presiona Enter
- Confirma el deploy

**Copia la URL que te da (ej: https://tu-app.netlify.app)**

### Paso 4: Configurar variable de entorno en Netlify
Ve a Netlify Dashboard:
1. Site Settings → Environment Variables
2. Add: `REACT_APP_API_URL`
3. Value: `https://jiovani-go-ecommerce-production.up.railway.app/api`
4. Save
5. Redeploy el sitio (Deploys → Trigger deploy → Clear cache and deploy)

---

## 🔧 OPCIÓN 2: Deploy Frontend con Vercel

### Paso 1: Instalar Vercel CLI
```powershell
npm install -g vercel
```

### Paso 2: Deploy
```powershell
cd frontend
vercel --prod
```

### Paso 3: Configurar variable de entorno
```powershell
vercel env add REACT_APP_API_URL
# Pegar: https://jiovani-go-ecommerce-production.up.railway.app/api
vercel --prod
```

---

## 🔐 Actualizar Railway Backend (CRÍTICO)

Una vez que tengas la URL del frontend:

### Opción A: Desde Railway Web (más fácil)
1. Ve a: https://railway.app
2. Login → Tu proyecto → Servicio backend
3. Tab "Variables"
4. Click "New Variable"
5. Name: `FRONTEND_URL_REAL`
6. Value: `https://tu-frontend.netlify.app` (SIN barra final)
7. Save

### Opción B: Desde Railway CLI
```powershell
railway login
railway link
railway variables set FRONTEND_URL_REAL=https://tu-frontend.netlify.app
```

---

## ✅ Validación Rápida

### Test 1: Verificar backend
```powershell
curl https://jiovani-go-ecommerce-production.up.railway.app/api/payments/health
```

Deberías ver:
```json
{
  "status": "success",
  "message": "Sistema de pagos Transbank funcionando correctamente",
  ...
}
```

### Test 2: Verificar endpoint de pago
```powershell
curl -X POST https://jiovani-go-ecommerce-production.up.railway.app/api/payments/init-test `
  -H "Content-Type: application/json" `
  -d '{"amount":10000,"buyOrder":"test-123","sessionId":"sess-1","returnUrl":"https://example.com","userEmail":"test@test.com"}'
```

Deberías ver:
```json
{
  "success": true,
  "data": {
    "token": "...",
    "url": "https://webpay3gint.transbank.cl/webpayserver/initTransaction"
  }
}
```

### Test 3: Verificar frontend desplegado
Abre tu frontend en el navegador y verifica:
- [ ] Página carga correctamente
- [ ] Catálogo muestra productos
- [ ] Puedes agregar al carrito
- [ ] Checkout es accesible

---

## 🧪 Test Manual del Flujo Completo

1. Abre: `https://tu-frontend.netlify.app`
2. Navega al catálogo (Dama o Varón)
3. Click en un producto
4. Click "Agregar al Carrito"
5. Ve al carrito (ícono arriba derecha)
6. Click "Proceder al Pago"
7. Llena el formulario de checkout:
   - Nombre: Juan Pérez
   - Email: test@example.com
   - Teléfono: +56912345678
   - Dirección: Av. Providencia 123
   - Ciudad: Santiago
   - Región: Metropolitana
8. Click "Proceder al Pago"
9. **DEBERÍAS SER REDIRIGIDO A:** `https://webpay3gint.transbank.cl/webpayserver/initTransaction`
10. Llena el formulario de Transbank:
    - Tarjeta: `4051885600446623`
    - CVV: `123`
    - Fecha: `12/25`
11. Click "Continuar"
12. **DEBERÍAS VOLVER A TU APP** con mensaje de confirmación

---

## 🐛 Troubleshooting Rápido

### Error: "No se pudo iniciar el pago"
```powershell
# Verifica logs de Railway
railway logs
```

### Error: "CORS blocked"
- Verifica que `REACT_APP_API_URL` esté correcta en Netlify
- Asegúrate de NO incluir `/` al final

### Error: "Cannot redirect"
- Verifica que `FRONTEND_URL_REAL` esté configurada en Railway
- Espera 2-3 minutos a que Railway redespliegue

### Frontend no carga imágenes
- Normal, las imágenes están en `frontend/public/images/`
- Netlify las servirá automáticamente

---

## 📊 Checklist Final

### Pre-deployment:
- [ ] `npm install` ejecutado en frontend
- [ ] `npm run build` exitoso sin errores
- [ ] Netlify CLI instalado

### Post-deployment Frontend:
- [ ] Frontend desplegado y accesible
- [ ] Variable `REACT_APP_API_URL` configurada
- [ ] Frontend redespleado con variable

### Post-deployment Backend:
- [ ] Variable `FRONTEND_URL_REAL` agregada en Railway
- [ ] Railway redespleado (esperar 2-3 min)
- [ ] Health check responde OK

### Testing:
- [ ] Flujo completo probado manualmente
- [ ] Redirección a Transbank funciona
- [ ] Pago con tarjeta de prueba exitoso
- [ ] Confirmación se muestra correctamente

---

## 🎯 URLs Importantes

### Backend (Railway)
```
Base URL: https://jiovani-go-ecommerce-production.up.railway.app
Health: /api/payments/health
Init Payment: /api/payments/init-test
Confirm: /api/payments/confirm
```

### Frontend (después de deploy)
```
URL: https://TU-APP.netlify.app (actualizar después del deploy)
```

### Transbank Integration
```
WebPay URL: https://webpay3gint.transbank.cl/webpayserver/initTransaction
Commerce Code: 597055555532
Environment: integration
```

### Tarjetas de Prueba Transbank
```
VISA: 4051885600446623
CVV: 123
Fecha: 12/25 (cualquier fecha futura)

MASTERCARD: 5186059559590568
CVV: 123
Fecha: 12/25
```

---

## 📞 Si Necesitas Ayuda

1. Copia el error exacto que ves
2. Revisa los logs de Railway: `railway logs`
3. Revisa la consola del navegador (F12)
4. Busca en los archivos de documentación:
   - `DEPLOY_FRONTEND_INSTRUCTIONS.md`
   - `RAILWAY_ENV_VARS.md`
   - `RESUMEN_EJECUTIVO.md`

---

**🎉 ¡TODO ESTÁ LISTO PARA EL DEPLOY FINAL!**

**Tiempo estimado total:** 30-45 minutos

**Siguiente acción:** Ejecuta los comandos de Netlify arriba ☝️
