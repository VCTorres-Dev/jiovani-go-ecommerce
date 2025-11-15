# 🚀 Instrucciones para Deploy del Frontend

## ✅ Estado Actual
- ✅ Backend desplegado en Railway: `https://jiovani-go-ecommerce-production.up.railway.app`
- ✅ Backend responde correctamente a Transbank con tokens válidos
- ✅ Frontend actualizado para usar endpoint real `/api/payments/init-test`
- ⏳ **PENDIENTE: Desplegar frontend y configurar variables de entorno**

---

## 🎯 Opciones de Deploy (elige una)

### **Opción A: Netlify (Recomendado - Más fácil)**

#### Paso 1: Preparar el frontend
```bash
cd frontend
npm install
npm run build
```

#### Paso 2: Deploy con Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

Cuando te pregunte:
- **Publish directory**: `build`
- Confirma el deploy

#### Paso 3: Configurar variables de entorno en Netlify
1. Ve a tu sitio en Netlify Dashboard
2. Site Settings → Environment Variables
3. Agrega: `REACT_APP_API_URL = https://jiovani-go-ecommerce-production.up.railway.app/api`
4. Redeploy el sitio para que tome la variable

---

### **Opción B: Vercel (Alternativa)**

#### Paso 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Paso 2: Deploy
```bash
cd frontend
vercel --prod
```

#### Paso 3: Configurar variable de entorno
```bash
vercel env add REACT_APP_API_URL
# Pegar: https://jiovani-go-ecommerce-production.up.railway.app/api
```

---

### **Opción C: Railway (Todo en un solo lugar)**

#### Paso 1: Crear nuevo servicio en Railway
1. Ve a tu proyecto Railway
2. Click en "New Service"
3. Conecta el mismo repo GitHub
4. Configura:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

#### Paso 2: Agregar variables de entorno
```
REACT_APP_API_URL=https://jiovani-go-ecommerce-production.up.railway.app/api
```

---

## 🔧 Configuración CRÍTICA Post-Deploy

### Una vez que tengas la URL del frontend desplegado:

1. **Actualizar Railway Backend**
   - Ve a Railway → Tu servicio backend → Variables
   - Agrega o actualiza:
     ```
     FRONTEND_URL_REAL=https://TU-FRONTEND-DESPLEGADO.netlify.app
     ```
   - **SIN** barra final `/`
   - Ejemplo: `https://jiovani-go-ecommerce.netlify.app`

2. **Redeploy del backend**
   - Railway detectará el cambio y redespleará automáticamente
   - O puedes forzar un redeploy desde el dashboard

---

## ✅ Validación Final

### Test del flujo completo:
1. Abre tu frontend desplegado: `https://TU-FRONTEND.netlify.app`
2. Navega a catálogo y agrega productos al carrito
3. Ve a checkout y llena los datos de envío
4. Click en "Proceder al Pago"
5. **Deberías ser redirigido a**: `https://webpay3gint.transbank.cl/webpayserver/initTransaction`
6. Usa tarjeta de prueba:
   - **VISA**: `4051885600446623`
   - **CVV**: `123`
   - **Fecha**: Cualquier fecha futura (ej: 12/25)
7. Completa el pago en Transbank
8. Deberías volver a tu app con la confirmación del pago

---

## 🐛 Troubleshooting

### Si el redirect no funciona:
1. Verifica que `FRONTEND_URL_REAL` esté correcta en Railway (sin `/` al final)
2. Verifica que `REACT_APP_API_URL` esté correcta en Netlify/Vercel
3. Revisa los logs de Railway para ver errores

### Si el pago no se confirma:
1. Verifica que el endpoint `/api/payments/confirm` esté funcionando
2. Revisa los logs de Railway después de completar el pago en Transbank
3. Verifica que Transbank pueda alcanzar tu backend (debe ser público)

---

## 📋 Checklist Final

- [ ] Frontend desplegado y accesible públicamente
- [ ] Variable `REACT_APP_API_URL` configurada en el hosting del frontend
- [ ] Variable `FRONTEND_URL_REAL` configurada en Railway backend
- [ ] Backend redespleado con nueva variable
- [ ] Test completo del flujo de pago exitoso
- [ ] Capturas de pantalla del flujo para documentación

---

## 🎓 Notas para tu presentación universitaria

Una vez que todo funcione:
1. Graba un video del flujo completo (30-60 segundos)
2. Toma screenshots de cada paso
3. Documenta las tecnologías usadas:
   - Frontend: React + Tailwind
   - Backend: Node.js + Express + MongoDB
   - Pagos: Transbank WebPay Plus (Integration)
   - Hosting: Railway (backend) + Netlify/Vercel (frontend)
4. Menciona las credenciales públicas de Transbank que usaste

---

## ❓ ¿Necesitas ayuda?

Si encuentras algún error o no sabes qué hacer, copia el mensaje de error y pídeme ayuda con:
- Los logs de Railway
- El error en la consola del navegador
- La URL que estás intentando usar
