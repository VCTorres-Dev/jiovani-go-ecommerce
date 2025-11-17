# 📋 INSTRUCCIONES PARA VER LOGS DEL BACKEND

## ⚠️ IMPORTANTE: Los logs del navegador se borran al recargar la página

Los logs que necesitas ver están en el **BACKEND** (servidor Node.js), no en el navegador.

## 🔍 PASO A PASO PARA VER LOS LOGS:

### **Opción 1: Ver logs en tiempo real (RECOMENDADO)**

1. **Abre una terminal PowerShell** (nueva, separada)

2. **Navega a la carpeta del backend:**
   ```powershell
   cd "c:\Users\Vicente\Documents\RESPALDO PAGINA DEJO AROMAS\DA_Page - V2\backend"
   ```

3. **Inicia el servidor y observa los logs:**
   ```powershell
   npm start
   ```
   
   O si usas nodemon:
   ```powershell
   npm run dev
   ```

4. **Deja esta terminal ABIERTA** - aquí verás TODOS los logs del backend

5. **En otra ventana del navegador:**
   - Inicia sesión como admin
   - Ve a `/admin/users`
   - Presiona F5 para recargar
   - **OBSERVA LA TERMINAL DEL BACKEND** - verás logs como:
     ```
     ================================================================================
     --- TRACE: authRoutes.js está VIVO y listo para recibir peticiones ---
     ================================================================================
     [TRACE] Petición recibida en authRoutes: GET /user
     [TRACE] authMiddleware se está ejecutando para la ruta: /api/auth/user
     [TRACE] authMiddleware decoded userId: 673895b...
     --- TRACE: Petición recibida en GET /api/auth/user (en authRoutes.js) ---
     --- TRACE: Usuario encontrado en BD (desde authRoutes): admin
     --- TRACE: Enviando respuesta de /user (desde authRoutes). Role: admin
     ```

### **Opción 2: Logs guardados en archivo**

Si prefieres guardar los logs en un archivo:

```powershell
cd "c:\Users\Vicente\Documents\RESPALDO PAGINA DEJO AROMAS\DA_Page - V2\backend"
npm start > logs.txt 2>&1
```

Luego abre `backend/logs.txt` en VS Code para ver todos los logs.

---

## 🎯 QUÉ BUSCAR EN LOS LOGS:

### ✅ **SI VES ESTOS LOGS = TODO BIEN (authRoutes.js activo)**

```
================================================================================
--- TRACE: authRoutes.js está VIVO y listo para recibir peticiones ---
================================================================================
[TRACE] Petición recibida en authRoutes: GET /user
--- TRACE: Petición recibida en GET /api/auth/user (en authRoutes.js) ---
--- TRACE: Usuario encontrado en BD (desde authRoutes): admin
--- TRACE: Enviando respuesta de /user (desde authRoutes). Role: admin
```

### ❌ **SI VES ESTE LOG = PROBLEMA (código antiguo en server.js)**

```
--- ¡ALERTA! Se está ejecutando código ANTIGUO en server.js (GET /api/auth/user) ---
```

### ⚠️ **SI NO VES NINGÚN LOG DE authRoutes = NO SE CARGÓ EL ARCHIVO**

Esto significaría que el servidor no está usando la refactorización.

---

## 🐛 DIAGNÓSTICO SEGÚN LOS LOGS:

### **Caso 1: authRoutes.js se carga pero no recibe peticiones**
- **Síntoma:** Ves el log inicial `authRoutes.js está VIVO` al iniciar el servidor, pero NO ves logs cuando haces F5
- **Causa:** El frontend está enviando la petición a otra ruta o el middleware auth falla antes
- **Solución:** Revisar logs de authMiddleware

### **Caso 2: authMiddleware rechaza el token**
- **Síntoma:** Ves `authMiddleware se está ejecutando` pero luego error "Token inválido"
- **Causa:** El token en localStorage está corrupto o expiró
- **Solución:** Hacer logout/login nuevamente para obtener token fresco

### **Caso 3: Usuario no encontrado en BD**
- **Síntoma:** Ves `Usuario encontrado en BD: NO ENCONTRADO`
- **Causa:** El ID del token no coincide con ningún usuario en MongoDB
- **Solución:** Verificar conexión a MongoDB y datos de usuario

---

## 📸 CÓMO COMPARTIR LOS LOGS CONMIGO:

1. **Captura de pantalla de la terminal completa** mostrando los logs del backend
2. O copia y pega el texto completo de los logs desde la terminal
3. Incluye desde el inicio del servidor hasta después de hacer F5

---

## 🔄 SI EL SERVIDOR YA ESTÁ CORRIENDO:

Si tienes el backend corriendo en Railway o localmente pero no ves los logs:

1. **Detén el servidor** (Ctrl+C en la terminal)
2. **Inícialo nuevamente** con `npm start`
3. **Observa los logs desde el inicio**

---

## 💡 IMPORTANTE:

- **NO uses `cls`** para limpiar la terminal, necesitamos ver todos los logs
- **Deja la terminal abierta** mientras pruebas
- **Los logs del navegador (Console) NO son suficientes** - necesitamos ver el backend

---

¿Alguna duda? Sigue estos pasos y compárteme lo que veas en la terminal del backend.
