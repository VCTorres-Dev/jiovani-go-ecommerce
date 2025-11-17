// Script para actualizar el rol de un usuario específico a 'admin'
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dejoaromas';

async function setAdminRole(email) {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const user = await User.findOne({ email });
  if (!user) {
    console.log(`[ERROR] Usuario no encontrado: ${email}`);
    process.exit(1);
  }
  user.role = 'admin';
  await user.save();
  console.log(`[OK] Usuario ${email} ahora es admin.`);
  await mongoose.disconnect();
}

setAdminRole('juan@juan.com').catch(err => {
  console.error('[ERROR]', err);
  process.exit(1);
});
