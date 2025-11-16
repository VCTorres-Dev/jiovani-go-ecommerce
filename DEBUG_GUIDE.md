# 🔍 GUÍA DE DEBUGGING - Problema "hola" y F5 redirect

## Cambios aplicados

### 1. App.js - Eliminado parseo preliminar del token
**Problema:** Al parsear el token localmente, seteábamos `{ id, email, role }` sin `username`, causando que el Navbar mostrara `undefined` o datos incompletos.

**Solución:** Eliminado el parseo preliminar. Ahora esperamos a que la petición a `/api/auth/user` termine antes de setear el usuario.

**Resultado:** El usuario siempre tiene todos sus datos completos (id, username, email, role).

### 2. AdminRoute.js - Mejor UI y logging
**Mejoras:**
- Spinner animado mientras carga (mejor UX)
- Logs detallados para debugging
- Mensajes claros sobre por qué redirige a login

### 3. Logging exhaustivo en App.js
**Agregado:**
- Log cuando loadUser se ejecuta
- Log de la petición a /api/auth/user
- Log de la respuesta del servidor
- Log del usuario seteado
- Log de errores detallados

## Cómo probar

### Test 1: Login normal
1. Abre http://localhost:3000 (o tu URL de producción)
2. Abre DevTools (F12) → pestaña Console
3. Haz login con admin@dejoaromas.com / admin123
4. Verifica en Console:
   ```
   [App.js] Respuesta recibida: { success: true, user: { id, username, email, role } }
   [App.js] Usuario seteado: { id, username, email, role }
   ```
5. Verifica en Navbar: debe mostrar "Hola, admin" (o el username correspondiente)

### Test 2: Recargar en dashboard (F5)
1. Estando logueado, ve a http://localhost:3000/admin/users
2. Abre DevTools Console
3. Presiona F5 (recargar)
4. Verifica en Console:
   ```
   [App.js] loadUser ejecutándose, token: encontrado
   [App.js] Haciendo petición a: http://localhost:5000/api/auth/user
   [App.js] Respuesta recibida: { success: true, user: { ... } }
   [App.js] Usuario seteado: { id, username, email, role }
   [App.js] loadUser finalizado, loading = false
   [AdminRoute] Estado: { loading: false, user: { id, role, username } }
   [AdminRoute] Acceso permitido, mostrando contenido admin
   ```
5. La página NO debe redirigir a login
6. Debe mostrar el listado de usuarios correctamente

### Test 3: Token inválido
1. Abre DevTools → Application → Local Storage
2. Borra el token (o modifica un carácter)
3. Recarga la página
4. Verifica en Console:
   ```
   [App.js] Error loading user: ...
   [AdminRoute] Redirigiendo a login, razón: no hay usuario
   ```
5. Debe redirigir a login (comportamiento correcto)

## Qué buscar en los logs

### Si ves "hola" como username:
1. Verifica en Console el log `[App.js] Usuario seteado:`
2. Comprueba que `username` tiene el valor correcto
3. Si username es correcto pero el Navbar muestra "hola", es un problema de cache del navegador → Ctrl+Shift+R

### Si redirige a login tras F5:
1. Busca en Console: `[App.js] Error loading user:`
2. Posibles causas:
   - **Error 401**: Token inválido o expirado → Reloguéate
   - **Error 404**: Usuario no encontrado en DB → Verifica con `node check-users.js`
   - **Error de red**: Backend no responde → Verifica que el backend esté corriendo
   - **CORS error**: Frontend y backend en diferentes dominios sin CORS configurado

### Si el username es undefined:
1. Busca en Console: `[App.js] Respuesta recibida:`
2. Verifica que `res.data.user.username` existe
3. Si no existe, el backend NO está devolviendo username → Revisa backend/server.js línea 569

## Comandos útiles

### Verificar usuarios en DB:
```bash
cd backend
node check-users.js
```

### Ver token en navegador:
1. Abre DevTools Console
2. Pega este código:
```javascript
const token = localStorage.getItem('token');
if (token) {
  const payload = token.split('.')[1];
  const decoded = JSON.parse(atob(payload));
  console.log('Token decodificado:', decoded);
} else {
  console.log('No hay token');
}
```

### Limpiar todo y empezar de cero:
1. DevTools → Application → Local Storage → Clear All
2. Ctrl+Shift+R (hard refresh)
3. Vuelve a hacer login

## Próximos pasos

Si después de aplicar estos cambios y seguir los tests:

1. **Sigue apareciendo "hola"**: Necesito que compartas:
   - Screenshot del Navbar
   - Output completo de la Console
   - Output de `node check-users.js`

2. **Sigue redirigiendo a login**: Necesito que compartas:
   - Output completo de la Console (incluyendo errores)
   - Screenshot del Network tab (pestaña XHR) mostrando la petición a /api/auth/user
   - Response de esa petición

3. **Todo funciona**: 🎉 Podemos proceder con:
   - Quitar logs de debugging (para producción limpia)
   - Hacer commit y push
   - Deploy a producción
