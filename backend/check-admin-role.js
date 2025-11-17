// Script para verificar rol del usuario admin en Atlas
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dejoaromas';

async function checkAdminRole() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  
  console.log('[CHECK ADMIN] Verificando usuarios admin en la base de datos...\n');
  
  // Buscar todos los usuarios con rol admin
  const admins = await User.find({ role: 'admin' }).select('-password');
  console.log(`[CHECK ADMIN] Total de admins encontrados: ${admins.length}\n`);
  
  if (admins.length === 0) {
    console.log('[WARNING] NO HAY USUARIOS CON ROL ADMIN');
    console.log('[INFO] Usuarios existentes:');
    const allUsers = await User.find().select('-password');
    console.table(allUsers.map(u => ({
      username: u.username,
      email: u.email,
      role: u.role,
      _id: u._id.toString()
    })));
  } else {
    console.log('[OK] Usuarios con rol admin:');
    console.table(admins.map(u => ({
      username: u.username,
      email: u.email,
      role: u.role,
      _id: u._id.toString()
    })));
  }
  
  await mongoose.disconnect();
  console.log('\n[CHECK ADMIN] Proceso completado');
}

checkAdminRole().catch(err => {
  console.error('[ERROR]', err.message);
  process.exit(1);
});
