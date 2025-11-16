const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkUsers = async () => {
  try {
    console.log('🔍 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    const users = await User.find({}).select('-password');
    
    console.log(`📊 Total de usuarios en la base de datos: ${users.length}\n`);
    
    users.forEach((user, index) => {
      console.log(`Usuario ${index + 1}:`);
      console.log(`  - ID: ${user._id}`);
      console.log(`  - Username: ${user.username}`);
      console.log(`  - Email: ${user.email}`);
      console.log(`  - Role: ${user.role}`);
      console.log(`  - Fecha Registro: ${user.fechaRegistro}`);
      console.log('');
    });

    await mongoose.disconnect();
    console.log('✅ Desconectado de MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkUsers();
