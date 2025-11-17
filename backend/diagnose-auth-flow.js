/*
  DIAGNÓSTICO COMPLETO DEL FLUJO DE AUTENTICACIÓN
  
  Este script simula exactamente lo que está pasando en producción:
  1. Frontend hace POST /login → obtiene token
  2. Frontend hace GET /auth/user → valida token, obtiene usuario
  3. Frontend hace GET /users (con auth) → intenta listar usuarios
  
  Si algo falla, lo identificaremos exactamente aquí.
*/

const axios = require('axios');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';

async function diagnose() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 DIAGNÓSTICO COMPLETO DEL FLUJO DE AUTENTICACIÓN');
  console.log('='.repeat(80) + '\n');

  // Paso 1: Conectar a MongoDB
  console.log('📦 Paso 1: Conectando a MongoDB...');
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dejoaromas', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB conectado\n');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }

  // Paso 2: Verificar que exista un usuario admin
  console.log('👤 Paso 2: Buscando usuario admin...');
  let adminUser = await User.findOne({ role: 'admin' });
  if (!adminUser) {
    console.log('⚠️  No hay usuario admin. Creando uno de prueba...');
    adminUser = new User({
      username: 'admin-test',
      email: 'admin-test@test.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('✅ Usuario admin creado: admin-test@test.com\n');
  } else {
    console.log(`✅ Usuario admin encontrado: ${adminUser.username} (${adminUser.email})\n`);
  }

  // Paso 3: Simular LOGIN (POST /api/auth/login)
  console.log('🔐 Paso 3: Simulando POST /api/auth/login...');
  let token = null;
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: adminUser.email,
      password: 'admin123'
    });
    token = response.data.token;
    console.log(`✅ Login exitoso. Token: ${token.substring(0, 30)}...\n`);
  } catch (error) {
    console.error('❌ Error en login:', error.response?.data?.message || error.message);
    process.exit(1);
  }

  // Paso 4: Verificar el token decodificado
  console.log('🔑 Paso 4: Verificando token...');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token válido. Contenido:');
    console.log('   ', JSON.stringify(decoded, null, 2) + '\n');
  } catch (error) {
    console.error('❌ Error verificando token:', error.message);
    process.exit(1);
  }

  // Paso 5: GET /api/auth/user (verificar que el usuario se devuelva)
  console.log('👁️  Paso 5: GET /api/auth/user...');
  try {
    const response = await axios.get(`${API_URL}/auth/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    console.log('✅ Usuario obtenido:');
    console.log('   ', JSON.stringify(response.data.user, null, 2));
    console.log('   Rol:', response.data.user.role + '\n');
  } catch (error) {
    console.error('❌ Error GET /auth/user:', error.response?.data?.message || error.message);
    process.exit(1);
  }

  // Paso 6: GET /api/users (validación de admin)
  console.log('📋 Paso 6: GET /api/users (requiere admin)...');
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      params: { page: 1, limit: 10 }
    });
    console.log(`✅ Lista de usuarios obtenida. Total: ${response.data.totalUsers}`);
    console.log(`   Usuarios devueltos: ${response.data.users.length}\n`);
  } catch (error) {
    console.error('❌ Error GET /api/users:', error.response?.data?.message || error.message);
    if (error.response?.status === 403) {
      console.error('   → El usuario NO es admin en la BD!');
      const user = await User.findOne({ email: adminUser.email });
      console.error('   → Rol en BD:', user.role);
    }
    process.exit(1);
  }

  console.log('='.repeat(80));
  console.log('✅ ¡DIAGNÓSTICO COMPLETADO EXITOSAMENTE!');
  console.log('='.repeat(80) + '\n');

  await mongoose.disconnect();
  process.exit(0);
}

diagnose().catch(error => {
  console.error('❌ Error no capturado:', error);
  process.exit(1);
});
