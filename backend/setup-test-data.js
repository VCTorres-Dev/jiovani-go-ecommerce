// Script para verificar y crear datos de prueba
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

async function setupTestData() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dejoaromas', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Conectado a MongoDB');

    // Verificar productos existentes
    const productCount = await Product.countDocuments();
    console.log(`📦 Productos en base de datos: ${productCount}`);

    if (productCount === 0) {
      console.log('🔧 Creando productos de prueba...');
      
      const testProducts = [
        {
          name: 'Perfume Elegante Dama',
          price: 25000,
          gender: 'dama',
          stock: 10,
          description: 'Un perfume elegante para dama con notas florales',
          image: '/images/dama_01.webp'
        },
        {
          name: 'Fragancia Sensual Dama',
          price: 30000,
          gender: 'dama',
          stock: 15,
          description: 'Fragancia sensual con toques de vainilla y sándalo',
          image: '/images/dama_02.webp'
        },
        {
          name: 'Perfume Masculino Clásico',
          price: 28000,
          gender: 'varon',
          stock: 12,
          description: 'Perfume masculino con notas amaderadas',
          image: '/images/varon_01.webp'
        },
        {
          name: 'Fragancia Deportiva Varón',
          price: 22000,
          gender: 'varon',
          stock: 20,
          description: 'Fragancia fresca ideal para el día a día',
          image: '/images/varon_02.webp'
        }
      ];

      await Product.insertMany(testProducts);
      console.log(`✅ ${testProducts.length} productos creados`);
    }

    // Verificar usuario de prueba
    const userCount = await User.countDocuments();
    console.log(`👤 Usuarios en base de datos: ${userCount}`);

    const testUser = await User.findOne({ email: 'test@test.com' });
    if (!testUser) {
      console.log('👤 Creando usuario de prueba...');
      const newUser = new User({
        username: 'Test User',
        email: 'test@test.com',
        password: '123456',
        role: 'user'
      });
      await newUser.save();
      console.log('✅ Usuario de prueba creado (email: test@test.com, password: 123456)');
    } else {
      console.log('✅ Usuario de prueba ya existe (email: test@test.com, password: 123456)');
    }

    // Mostrar resumen
    const finalProductCount = await Product.countDocuments();
    const finalUserCount = await User.countDocuments();
    
    console.log('\n📊 RESUMEN:');
    console.log(`📦 Total productos: ${finalProductCount}`);
    console.log(`👤 Total usuarios: ${finalUserCount}`);
    console.log('🔐 Usuario de prueba: test@test.com / 123456');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupTestData();
}

module.exports = setupTestData;
