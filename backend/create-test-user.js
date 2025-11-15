// Script para crear un usuario de prueba
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createTestUser() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dejoaromas', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Conectado a MongoDB');

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: 'test@test.com' });
    if (existingUser) {
      console.log('⚠️ Usuario de prueba ya existe');
      console.log('📧 Email:', existingUser.email);
      console.log('👤 Username:', existingUser.username);
      console.log('🔐 Contraseña de prueba: 123456');
      return;
    }

    // Crear usuario de prueba
    const testUser = new User({
      username: 'Test User',
      email: 'test@test.com',
      password: '123456', // Se encriptará automáticamente
      role: 'user'
    });

    await testUser.save();
    
    console.log('🎉 Usuario de prueba creado exitosamente');
    console.log('📧 Email: test@test.com');
    console.log('🔐 Contraseña: 123456');
    console.log('👤 Username: Test User');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createTestUser();
}

module.exports = createTestUser;
