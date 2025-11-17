// Script para actualizar la contraseña del usuario admin@dejoaromas.com a 'admin123'
// Ejecuta este script con: node backend/reset-admin-password.js

const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: '../.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dejoaromas';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('[RESET] Conectado a MongoDB');

    const email = 'admin@dejoaromas.com';
    const password = 'admin123';

    const admin = await User.findOne({ email });
    if (!admin) {
      console.log(`[RESET] Usuario admin no encontrado, creándolo...`);
      const newAdmin = new User({
        email,
        password,
        name: 'Administrador',
        role: 'admin',
        active: true
      });
      await newAdmin.save();
      console.log('[RESET] Usuario admin creado con contraseña admin123');
    } else {
      admin.password = password;
      await admin.save();
      console.log('[RESET] Contraseña de admin actualizada a admin123');
    }
    await mongoose.disconnect();
    console.log('[RESET] Proceso completado.');
    process.exit(0);
  } catch (err) {
    console.error('[RESET] Error:', err);
    process.exit(1);
  }
}

run();
