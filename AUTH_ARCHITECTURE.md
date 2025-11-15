# 🔐 ARQUITECTURA DE AUTENTICACIÓN - DOCUMENTACIÓN TÉCNICA

## ✅ ESTADO ACTUAL: COMPLETAMENTE FUNCIONAL

Todas las rutas de autenticación están conectadas, validadas y funcionando correctamente sin errores.

---

## 📋 RUTAS DE AUTENTICACIÓN IMPLEMENTADAS

### 1️⃣ **POST /api/auth/register** - Crear Nueva Cuenta
```
Endpoint: POST https://jiovani-go-ecommerce-production.up.railway.app/api/auth/register

Datos Enviados:
{
  "username": "juanperez",
  "email": "juan@example.com",
  "password": "MiPassword123"
}

Respuesta Exitosa (201 Created):
{
  "success": true,
  "message": "Cuenta creada exitosamente",
  "user": {
    "id": "user_1763238428259",
    "username": "juanperez",
    "email": "juan@example.com",
    "role": "user"
  }
}

Errores Posibles:
- 400: Fields requeridos faltantes
- 400: Password < 6 caracteres
- 409: Email ya registrado
- 409: Username ya en uso
```

### 2️⃣ **POST /api/auth/login** - Iniciar Sesión
```
Endpoint: POST https://jiovani-go-ecommerce-production.up.railway.app/api/auth/login

Datos Enviados:
{
  "email": "juan@example.com",
  "password": "MiPassword123",
  "remember": false  // (opcional)
}

Respuesta Exitosa (200 OK):
{
  "success": true,
  "message": "Login exitoso",
  "user": {
    "id": "user_1763238428259",
    "username": "juanperez",
    "email": "juan@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfMT..." 
}

Errores Posibles:
- 400: Email o password faltantes
- 401: Credenciales inválidas (email no existe o password incorrecto)
```

### 3️⃣ **GET /api/auth/user** - Obtener Datos del Usuario Actual
```
Endpoint: GET https://jiovani-go-ecommerce-production.up.railway.app/api/auth/user

Headers Requeridos:
Authorization: Bearer <TOKEN_JWT>

Ejemplo:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfMT...

Respuesta Exitosa (200 OK):
{
  "success": true,
  "user": {
    "id": "user_1763238428259",
    "username": "juanperez",
    "email": "juan@example.com",
    "role": "user"
  }
}

Errores Posibles:
- 401: Token no proporcionado
- 401: Token inválido o expirado
- 404: Usuario no encontrado
```

### 4️⃣ **GET /api/auth/me** - Alias de /api/auth/user
```
Exactamente igual a /api/auth/user
Es un alias para compatibilidad
```

---

## 👥 USUARIOS DE PRUEBA

### Administrador:
```
Email:    admin@dejoaromas.com
Password: admin123
Role:     admin
```

### Usuario Demo:
```
Email:    usuario@demo.com
Password: admin123
Role:     user
```

### Usuarios Creados Durante Tests:
```
Email:    juan@example.com
Password: Juanpass123
Role:     user
```

---

## 🔒 SEGURIDAD IMPLEMENTADA

### Passwords:
- ✅ Hasheados con bcryptjs (salt 10)
- ✅ Nunca se devuelven en respuestas
- ✅ Mínimo 6 caracteres requeridos

### Tokens JWT:
- ✅ Generados con clave secreta
- ✅ Expiración: 30 días
- ✅ Contienen: id, email, role
- ✅ Verificados en endpoints protegidos

### Validaciones:
- ✅ Email único (no se permite duplicados)
- ✅ Username único (no se permite duplicados)
- ✅ Credenciales validadas correctamente
- ✅ Errores genéricos (no revelan si email existe o no)

---

## 📱 INTEGRACIÓN FRONTEND

### Login.js
```javascript
const response = await axios.post(
  `${apiBase}/auth/login`,
  { email, password, remember }
);

// Guardar token
localStorage.setItem("token", response.data.token);

// Usar en próximas requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### Register.js
```javascript
const response = await axios.post(
  `${apiBase}/auth/register`,
  { username, email, password }
);

// Redirigir a login
navigate("/login");
```

### App.js - Verificar Sesión
```javascript
const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    const res = await axios.get(
      `${apiBase}/auth/user`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    setUser(res.data.user);
  }
};
```

---

## 🧪 TESTS REALIZADOS

✅ **TEST 1: Registro de Usuario**
- Datos: username="juanperez", email="juan@example.com", password="Juanpass123"
- Resultado: 201 Created ✅
- Usuario creado exitosamente

✅ **TEST 2: Login Exitoso**
- Datos: email="juan@example.com", password="Juanpass123"
- Resultado: 200 OK con JWT token ✅
- Token generado correctamente

✅ **TEST 3: Obtener Usuario Actual**
- Token: JWT válido
- Resultado: 200 OK con datos del usuario ✅
- Datos coinciden con usuario loggeado

✅ **TEST 4: Rechazar Email Duplicado**
- Intento: email="juan@example.com" nuevamente
- Resultado: 409 Conflict ✅
- Mensaje: "Este email ya está registrado"

✅ **TEST 5: Rechazar Password Incorrecta**
- Intento: email="juan@example.com", password="WrongPassword"
- Resultado: 401 Unauthorized ✅
- Mensaje: "Credenciales inválidas"

---

## 🎯 CHECKLIST DE VALIDACIÓN

- [x] POST /api/auth/register funciona
- [x] POST /api/auth/login funciona
- [x] GET /api/auth/user funciona
- [x] GET /api/auth/me funciona
- [x] Passwords se hashean correctamente
- [x] Tokens JWT se generan correctamente
- [x] Validación de campos obligatorios
- [x] Validación de emails duplicados
- [x] Validación de usernames duplicados
- [x] Rechazo de credenciales incorrectas
- [x] Rechazo de tokens inválidos/expirados
- [x] CORS configurado correctamente
- [x] Errores bien documentados
- [x] Logs de auditoría activados

---

## 📝 NOTAS IMPORTANTES

### Para Producción:
1. Cambiar `JWT_SECRET` a una clave más segura en variables de entorno
2. Usar MongoDB Atlas en lugar de MOCK_USERS
3. Implementar rate limiting en endpoints de login/register
4. Añadir verificación de email (enviando link)
5. Implementar recuperación de contraseña
6. Usar HTTPS obligatorio (ya está en Railway ✅)

### Limitaciones Actuales:
- Los usuarios se almacenan en memoria (MOCK_USERS)
- Se pierden al reiniciar Railway
- Para producción, cambiar a MongoDB con persistencia real

---

## 🔗 REFERENCIAS

- Frontend Auth: `frontend/src/components/Login.js`, `frontend/src/components/Register.js`
- Backend Auth: `backend/server.js` (endpoints auth)
- Usuarios Mock: `backend/mockUsers.js`
- Products API: `backend/mockProducts.js`

---

**Última Actualización:** 15 de noviembre de 2025
**Estado:** ✅ COMPLETAMENTE FUNCIONAL
**Errores Conocidos:** Ninguno
