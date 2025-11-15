const mongoose = require('mongoose');
require('dotenv').config();

const verifyMongoDB = async () => {
  try {
    console.log('Conectando a MongoDB...');
    console.log('URI:', process.env.MONGODB_URI ? 'Configurada ✓' : 'NO CONFIGURADA ✗');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dejoaromas', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Conexión exitosa a MongoDB');
    
    // Verificar usuarios
    const User = require('./models/User');
    const users = await User.find({}).select('-password');
    console.log(`\n📊 USUARIOS EN BASE DE DATOS: ${users.length}`);
    users.forEach(u => {
      console.log(`  - ${u.email} (${u.role}) - Username: ${u.username}`);
    });
    
    // Verificar productos
    const Product = require('./models/Product');
    const products = await Product.find({});
    console.log(`\n📊 PRODUCTOS EN BASE DE DATOS: ${products.length}`);
    
    const dama = products.filter(p => p.gender.toLowerCase() === 'dama');
    const varon = products.filter(p => p.gender.toLowerCase() === 'varon');
    
    console.log(`  - Dama: ${dama.length}`);
    console.log(`  - Varón: ${varon.length}`);
    
    console.log('\n✅ VERIFICACIÓN COMPLETA: Base de datos poblada correctamente');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

verifyMongoDB();
