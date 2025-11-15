# ✅ VARIABLES DE ENTORNO PARA RAILWAY - CORRECTAS

## 🔴 CRÍTICAS (El backend NO inicia sin estas)

### MONGODB_URI
```
mongodb+srv://dejoaromas:TU_PASSWORD_AQUI@jiovani-go.sybsurl.mongodb.net/dejoaromas?retryWrites=true&w=majority
```
**IMPORTANTE:** Reemplaza `TU_PASSWORD_AQUI` con la contraseña que creaste en MongoDB Atlas cuando creaste el usuario `dejoaromas`.

Si no recuerdas la contraseña:
1. Ve a MongoDB Atlas
2. Database Access → Usuario `dejoaromas` → Edit
3. Edit Password → Auto-generate o crear nueva
4. Copia la contraseña y reemplázala en la URL arriba

---

## 🟡 IMPORTANTES (El backend inicia pero sin funcionalidad completa)

### JWT_SECRET
```
jiovani_go_produccion_secret_key_2024_ultra_segura_abc123xyz789
```
**Explicación:** Esta clave NO existe en ningún lado previamente. Es un texto que TÚ defines para encriptar tokens. Puedes usar esta misma o inventar otra clave larga.

### NODE_ENV
```
production
```

### PORT
```
3000
```
**Nota:** Railway asigna automáticamente el puerto. Si Railway te da un error de puerto, ELIMINA esta variable.

---

## 🟢 OPCIONALES (Para funcionalidades específicas)

### FRONTEND_URL
```
https://tu-backend-railway.up.railway.app
```
**NOTA:** Por AHORA déjala así mientras arreglamos el backend:
```
http://localhost:3001
```

Después que el backend funcione en Railway, copia la URL que Railway te dé (ejemplo: `https://jiovani-go-backend-production.up.railway.app`) y actualiza esta variable.

### TRANSBANK_ENV
```
TEST
```
**Explicación:** Para usar tarjetas de prueba de Transbank. Cuando tengas credenciales reales, cambiar a `PRODUCTION`.

### EMAIL_ENABLED
```
true
```

### EMAIL_USER
```
tu_email@gmail.com
```
**Nota:** Solo si quieres enviar emails reales. Por ahora puedes dejarlo vacío o poner `false` en `EMAIL_ENABLED`.

### EMAIL_PASS
```
tu_app_password_de_gmail
```
**Nota:** NO es tu contraseña normal de Gmail. Es una "App Password" que generas en: https://myaccount.google.com/apppasswords

### SMTP_HOST
```
smtp.gmail.com
```

### SMTP_PORT
```
587
```

### FROM_EMAIL
```
tu_email@gmail.com
```

### FROM_NAME
```
Dejo Aromas
```

### JWT_EXPIRE
```
30d
```

---

## 📋 RESUMEN RÁPIDO - Copia y Pega en Railway

**MÍNIMO PARA QUE FUNCIONE:**

| Variable | Valor |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://dejoaromas:TU_PASSWORD@jiovani-go.sybsurl.mongodb.net/dejoaromas?retryWrites=true&w=majority` |
| `JWT_SECRET` | `jiovani_go_produccion_secret_key_2024_ultra_segura_abc123xyz789` |
| `NODE_ENV` | `production` |
| `TRANSBANK_ENV` | `TEST` |
| `FRONTEND_URL` | `http://localhost:3001` (temporal) |

**DESPUÉS agregar las de EMAIL si quieres notificaciones.**

---

## 🚀 PASOS SIGUIENTES:

1. **Ve a Railway** → Tu proyecto → Variables tab
2. **Agrega la variable `MONGODB_URI`** primero (la más importante)
3. **Agrega `JWT_SECRET`** 
4. **Agrega las demás** de la tabla de arriba
5. **Railway redesplegará automáticamente** con las nuevas variables
6. **Espera 2-3 minutos** a que termine el build
7. **Revisa los logs** en Railway para ver si ahora inicia correctamente

---

## ❓ DUDAS RESPONDIDAS:

### ¿De dónde saco el MONGODB_URI exacto?

MongoDB Atlas te dio este comando:
```
mongosh "mongodb+srv://jiovani-go.sybsurl.mongodb.net/" --apiVersion 1 --username dejoaromas
```

La URL de conexión para Node.js es:
```
mongodb+srv://dejoaromas:<password>@jiovani-go.sybsurl.mongodb.net/dejoaromas
```

Reemplaza `<password>` con tu contraseña.

### ¿Qué poner en FRONTEND_URL?

**POR AHORA:** `http://localhost:3001`

**DESPUÉS:** Cuando Railway te dé la URL del backend (ejemplo: `https://jiovani-go-backend-production.up.railway.app`), usa ESA URL.

### ¿El JWT_SECRET existe en algún lado?

**NO.** Es una clave que TÚ inventas. Puede ser cualquier texto largo. Usa la que te di arriba o inventa otra.

---

## 🔧 ARREGLOS REALIZADOS:

✅ Cambiado `Procfile` para usar `node index.js` directamente
✅ Actualizado `railway.json` para evitar conflictos
✅ Subido a GitHub (commit: "Fix: Railway solo backend")
✅ Railway se redesplegará automáticamente en unos minutos

**Ahora ve a Railway y revisa si el nuevo despliegue funciona con las variables correctas.**
