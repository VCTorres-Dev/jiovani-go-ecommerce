# Guía de Deployment a Producción - Transbank

## 📋 CHECKLIST PRE-PRODUCCIÓN

### ✅ Requisitos Técnicos Completados:
- [x] Simulación de pagos funcionando
- [x] Generación correcta de órdenes
- [x] UI/UX profesional
- [x] Manejo de errores
- [x] Validaciones de seguridad
- [x] Base de datos estructurada

### 🔲 Pendientes para Producción:

#### 1. Credenciales Transbank Reales
```env
# Solicitar en: https://developers.transbank.cl/
TRANSBANK_ENV=PRODUCTION
TRANSBANK_COMMERCIAL_CODE=[SOLICITAR_A_TRANSBANK]
TRANSBANK_API_KEY=[SOLICITAR_A_TRANSBANK]
NODE_ENV=production
```

#### 2. Configuración de Servidor
```nginx
# Ejemplo configuración Nginx
server {
    listen 443 ssl;
    server_name tu-dominio.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:3000;
    }
    
    location /api/ {
        proxy_pass http://localhost:5000;
    }
}
```

#### 3. Variables de Entorno Producción
```env
# Backend (.env.production)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dejoaromas
JWT_SECRET=[GENERAR_SECRETO_FUERTE]
FRONTEND_URL=https://tu-dominio.com
TRANSBANK_ENV=PRODUCTION
NODE_ENV=production

# Frontend (.env.production)
REACT_APP_API_URL=https://tu-dominio.com/api
REACT_APP_ENV=production
```

## 🚀 PASOS DE DEPLOYMENT

### Paso 1: Preparar Aplicación
```bash
# Backend
cd backend
npm run build
npm prune --production

# Frontend  
cd frontend
npm run build
```

### Paso 2: Configurar Base de Datos
```bash
# Migrar datos a MongoDB Atlas o similar
# Configurar backups automáticos
# Implementar índices de rendimiento
```

### Paso 3: Deploy
```bash
# Usando PM2 (recomendado)
npm install -g pm2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

## 📊 MÉTRICAS A MONITOREAR

### Transacciones
- Tasa de éxito de pagos
- Tiempo promedio de procesamiento
- Errores por tipo

### Rendimiento
- Tiempo de respuesta API
- Memoria y CPU
- Conexiones concurrentes

### Negocio
- Conversión de carrito a pago
- Valor promedio de orden
- Productos más vendidos

## 🔒 SEGURIDAD EN PRODUCCIÓN

### Obligatorio:
- HTTPS en toda la aplicación
- Headers de seguridad
- Rate limiting
- Logs de auditoría
- Backup diario de BD

### Recomendado:
- WAF (Web Application Firewall)
- Monitoreo de intrusiones
- Tests de penetración
- Certificados SSL automáticos (Let's Encrypt)

## 📞 SOPORTE POST-LANZAMIENTO

### Documentación Necesaria:
1. Manual de usuario
2. Guía de troubleshooting
3. Contactos de soporte Transbank
4. Procedimientos de emergencia

### Monitoreo:
- Uptimerobot o similar
- Logs centralizados (ELK Stack)
- Alertas automáticas
- Dashboard de métricas
