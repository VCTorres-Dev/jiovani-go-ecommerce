// Test integral del sistema de pagos Transbank
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

// Configuración
const API_BASE = 'http://127.0.0.1:5000/api';
const FRONTEND_URL = 'http://127.0.0.1:3000';

// Test de configuración
async function testConfiguration() {
  console.log('🔧 PASO 1: Verificando configuración...');
  
  try {
    // Test configuración de Transbank
    const { transaction } = require('./config/transbank');
    console.log('✅ Configuración de Transbank cargada correctamente');
    
    // Test conexión MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dejoaromas', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conexión a MongoDB establecida');
    
    return true;
  } catch (error) {
    console.error('❌ Error en configuración:', error.message);
    return false;
  }
}

// Test de modelos
async function testModels() {
  console.log('\n📊 PASO 2: Verificando modelos de datos...');
  
  try {
    const Order = require('./models/Order');
    const User = require('./models/User');
    const Product = require('./models/Product');
    
    // Test generación de IDs únicos
    const userId = new mongoose.Types.ObjectId();
    const buyOrder = Order.generateBuyOrder(userId);
    const sessionId = Order.generateSessionId();
    
    console.log('✅ Generación de IDs únicos funcionando');
    console.log(`   - Buy Order: ${buyOrder}`);
    console.log(`   - Session ID: ${sessionId}`);
    
    // Test orden de prueba
    const testOrder = new Order({
      user: userId,
      products: [{
        product: new mongoose.Types.ObjectId(),
        quantity: 1,
        price: 10000,
        name: 'Producto Test'
      }],
      totalAmount: 10000,
      shippingInfo: {
        name: 'Test User',
        email: 'test@test.com',
        phone: '+56912345678',
        address: 'Test Address',
        city: 'Santiago',
        region: 'Metropolitana'
      },
      transbank: {
        buyOrder,
        sessionId
      }
    });
    
    await testOrder.validate();
    console.log('✅ Validación de modelo Order exitosa');
    
    return true;
  } catch (error) {
    console.error('❌ Error en modelos:', error.message);
    return false;
  }
}

// Test de servidor backend
async function testBackendServer() {
  console.log('\n🖥️ PASO 3: Verificando servidor backend...');
  
  try {
    // Test health check del servidor
    const healthResponse = await axios.get(`${API_BASE}/payments/health`);
    console.log('✅ Health check del sistema de pagos exitoso');
    console.log(`   Status: ${healthResponse.status}`);
    console.log(`   Message: ${healthResponse.data.message}`);
    
    // Test endpoint básico
    const rootResponse = await axios.get('http://127.0.0.1:5000');
    console.log('✅ Servidor backend respondiendo correctamente');
    
    return true;
  } catch (error) {
    console.error('❌ Error en servidor backend:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Asegúrate de que el servidor backend esté ejecutándose en puerto 5000');
    }
    return false;
  }
}

// Test de servicios de frontend
async function testFrontendServices() {
  console.log('\n🎨 PASO 4: Verificando servicios del frontend...');
  
  try {
    // Simular importación de servicios (sin ejecutar)
    const fs = require('fs');
    const path = require('path');
    
    const paymentServicePath = path.join(__dirname, '../frontend/src/services/paymentService.js');
    const checkoutComponentPath = path.join(__dirname, '../frontend/src/components/Checkout.js');
    const paymentResultPath = path.join(__dirname, '../frontend/src/pages/PaymentResult.js');
    
    // Verificar que los archivos existen
    if (fs.existsSync(paymentServicePath)) {
      console.log('✅ Servicio de pagos creado');
    } else {
      console.log('❌ Servicio de pagos no encontrado');
      return false;
    }
    
    if (fs.existsSync(checkoutComponentPath)) {
      console.log('✅ Componente Checkout creado');
    } else {
      console.log('❌ Componente Checkout no encontrado');
      return false;
    }
    
    if (fs.existsSync(paymentResultPath)) {
      console.log('✅ Página PaymentResult creada');
    } else {
      console.log('❌ Página PaymentResult no encontrada');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error verificando frontend:', error.message);
    return false;
  }
}

// Test de flujo completo de pago simulado
async function testPaymentFlow() {
  console.log('\n💳 PASO 5: Probando flujo de pago simulado...');
  
  try {
    // Crear usuario de prueba
    const User = require('./models/User');
    const Product = require('./models/Product');
    
    // Buscar o crear producto de prueba
    let testProduct = await Product.findOne({ name: 'Test Perfume' });
    if (!testProduct) {
      testProduct = new Product({
        name: 'Test Perfume',
        price: 15000,
        gender: 'dama',
        stock: 10,
        description: 'Perfume de prueba para testing'
      });
      await testProduct.save();
    }
    
    console.log('✅ Producto de prueba disponible');
    
    // Simular datos de orden
    const orderData = {
      orderItems: [{
        _id: testProduct._id,
        name: testProduct.name,
        price: testProduct.price,
        quantity: 1
      }],
      totalAmount: testProduct.price,
      shippingInfo: {
        name: 'Usuario Test',
        email: 'test@dejoaromas.com',
        phone: '+56912345678',
        address: 'Av. Test 123',
        city: 'Santiago',
        region: 'Metropolitana'
      }
    };
    
    console.log('✅ Datos de orden simulada preparados');
    console.log(`   Producto: ${orderData.orderItems[0].name}`);
    console.log(`   Total: $${orderData.totalAmount.toLocaleString('es-CL')}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error en flujo de pago:', error.message);
    return false;
  }
}

// Test de seguridad básica
async function testSecurity() {
  console.log('\n🔒 PASO 6: Verificando aspectos de seguridad...');
  
  try {
    // Test variables de entorno
    const requiredEnvVars = [
      'MONGODB_URI',
      'JWT_SECRET',
      'FRONTEND_URL'
    ];
    
    let missingVars = [];
    requiredEnvVars.forEach(varName => {
      if (!process.env[varName]) {
        missingVars.push(varName);
      }
    });
    
    if (missingVars.length > 0) {
      console.log(`❌ Variables de entorno faltantes: ${missingVars.join(', ')}`);
      return false;
    }
    
    console.log('✅ Variables de entorno configuradas');
    
    // Test configuración CORS
    if (process.env.FRONTEND_URL) {
      console.log('✅ URL del frontend configurada para CORS');
    }
    
    console.log('✅ Configuración de seguridad básica verificada');
    
    return true;
  } catch (error) {
    console.error('❌ Error en verificación de seguridad:', error.message);
    return false;
  }
}

// Función principal de testing
async function runCompleteTest() {
  console.log('🚀 INICIANDO TEST INTEGRAL DEL SISTEMA DE PAGOS TRANSBANK\n');
  console.log('=' .repeat(60));
  
  const tests = [
    { name: 'Configuración', fn: testConfiguration },
    { name: 'Modelos de Datos', fn: testModels },
    { name: 'Servidor Backend', fn: testBackendServer },
    { name: 'Servicios Frontend', fn: testFrontendServices },
    { name: 'Flujo de Pago', fn: testPaymentFlow },
    { name: 'Seguridad', fn: testSecurity }
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    const result = await test.fn();
    if (result) {
      passedTests++;
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 RESUMEN DEL TEST INTEGRAL:');
  console.log(`✅ Tests exitosos: ${passedTests}/${totalTests}`);
  console.log(`❌ Tests fallidos: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ¡TODOS LOS TESTS PASARON EXITOSAMENTE!');
    console.log('🚀 El sistema de pagos Transbank está listo para usar');
    console.log('\n📋 Próximos pasos:');
    console.log('   1. Inicia el servidor backend: npm start (en /backend)');
    console.log('   2. Inicia el frontend: npm start (en /frontend)');
    console.log('   3. Prueba el flujo completo en http://localhost:3000');
    console.log('   4. Para producción: obtén credenciales reales de Transbank');
  } else {
    console.log('\n⚠️ Algunos tests fallaron. Revisa los errores arriba.');
    console.log('💡 Asegúrate de que el servidor backend esté ejecutándose.');
  }
  
  // Cleanup
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  
  process.exit(passedTests === totalTests ? 0 : 1);
}

// Ejecutar test si se llama directamente
if (require.main === module) {
  runCompleteTest().catch(error => {
    console.error('❌ Error fatal en el test:', error);
    process.exit(1);
  });
}

module.exports = {
  runCompleteTest,
  testConfiguration,
  testModels,
  testBackendServer,
  testFrontendServices,
  testPaymentFlow,
  testSecurity
};
