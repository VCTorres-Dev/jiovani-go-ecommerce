// Test del modelo Order actualizado
const mongoose = require('mongoose');
require('dotenv').config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dejoaromas', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Order = require('./models/Order');

async function testOrderModel() {
  try {
    console.log('🧪 Probando modelo Order actualizado...');

    // Test 1: Generar buy order y session ID
    const userId = new mongoose.Types.ObjectId();
    const buyOrder = Order.generateBuyOrder(userId);
    const sessionId = Order.generateSessionId();

    console.log('✅ Generación de IDs:');
    console.log(`   Buy Order: ${buyOrder}`);
    console.log(`   Session ID: ${sessionId}`);

    // Test 2: Crear una orden de prueba
    const testOrder = new Order({
      user: userId,
      products: [
        {
          product: new mongoose.Types.ObjectId(),
          quantity: 2,
          price: 12990,
          name: 'Perfume Test'
        }
      ],
      totalAmount: 25980,
      transbank: {
        buyOrder: buyOrder,
        sessionId: sessionId
      },
      shippingInfo: {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '+56912345678',
        address: 'Av. Providencia 123',
        city: 'Santiago',
        region: 'Metropolitana'
      }
    });

    // Validar que el modelo es válido
    await testOrder.validate();
    console.log('✅ Validación del modelo exitosa');

    // Test 3: Probar métodos personalizados
    console.log('✅ Métodos personalizados:');
    console.log(`   Estado del pago: ${testOrder.getPaymentStatusText()}`);
    console.log(`   ¿Pago exitoso?: ${testOrder.isPaymentSuccessful()}`);

    // Test 4: Simular pago exitoso
    testOrder.transbank.responseCode = 0;
    testOrder.status = 'paid';
    console.log(`   Después del pago: ${testOrder.getPaymentStatusText()}`);
    console.log(`   ¿Pago exitoso?: ${testOrder.isPaymentSuccessful()}`);

    console.log('🎉 Todos los tests del modelo Order pasaron exitosamente!');
    return true;

  } catch (error) {
    console.error('❌ Error en test del modelo Order:', error.message);
    return false;
  } finally {
    await mongoose.connection.close();
  }
}

// Ejecutar test si el archivo se ejecuta directamente
if (require.main === module) {
  testOrderModel()
    .then(success => {
      process.exit(success ? 0 : 1);
    });
}

module.exports = { testOrderModel };
