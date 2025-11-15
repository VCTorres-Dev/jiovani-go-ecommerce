# 📧 Configuración de Emails - Dejo Aromas

## 🚨 ESTADO ACTUAL
- ✅ Código implementado
- ❌ Emails NO funcionan (faltan credenciales)

## 🎯 OPCIONES PARA ACTIVAR EMAILS

### OPCIÓN 1: Gmail (FÁCIL - 15 minutos)
```bash
# 1. Ir a: https://myaccount.google.com/security
# 2. Activar verificación en 2 pasos
# 3. Generar contraseña de aplicación
# 4. Actualizar .env:

EMAIL_ENABLED=true
EMAIL_USER=tu-email@gmail.com  # Tu email real
EMAIL_PASS=abcd efgh ijkl mnop  # La contraseña de 16 chars que te da Google
```

### OPCIÓN 2: SendGrid (PROFESIONAL - 30 minutos)
```bash
# 1. Registrarse en: https://sendgrid.com/
# 2. Verificar dominio dejoaromas.cl
# 3. Obtener API Key
# 4. Instalar SendGrid:
npm install @sendgrid/mail

# 5. Actualizar emailService.js para usar SendGrid
```

### OPCIÓN 3: Mailgun (ALTERNATIVA)
```bash
# 1. Registrarse en: https://www.mailgun.com/
# 2. Verificar dominio
# 3. Obtener credenciales SMTP
# 4. Actualizar .env con datos de Mailgun
```

## ⚠️ IMPORTANTE - Sin configurar emails:
- Las órdenes se crean correctamente
- Los pagos funcionan normalmente  
- NO se envían confirmaciones por email
- Los clientes NO reciben notificaciones

## 🧪 CÓMO PROBAR
1. Configurar una opción
2. Hacer una compra de prueba
3. Revisar tu email
4. Verificar logs del servidor

## 🔧 CONFIGURACIÓN DE PRODUCCIÓN
Para tu dominio dejoaromas.cl necesitarás:
- Registros DNS (MX, SPF, DKIM)
- Verificación del dominio
- IP dedicada (recomendado)

## 📞 ¿NECESITAS AYUDA?
Te puedo ayudar a configurar cualquier opción paso a paso.
