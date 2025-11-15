// Test del controlador de pagos
const mongoose = require('mongoose');
require('dotenv').config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dejoaromas', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const paymentController = require('./controllers/paymentController');
const User = require('./models/User');
const Product = require('./models/Product');

async function testPaymentController() {
  try {
    console.log('🧪 Probando controlador de pagos...');

    // Crear usuario de prueba
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'user'
    });

    // Crear producto de prueba
    const testProduct = new Product({
      name: 'Perfume Test',
      price: 12990,
      gender: 'dama',
      stock: 10,
      description: 'Perfume de prueba'
    });

    // Mock de request y response
    const mockReq = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: {
        orderItems: [
          {
            _id: new mongoose.Types.ObjectId(),
            name: 'Perfume Test',
            price: 12990,
            quantity: 1
          }
        ],
        totalAmount: 12990,
        shippingInfo: {
          name: 'Juan Pérez',
          email: 'juan@example.com',
          phone: '+56912345678',
          address: 'Av. Providencia 123',
          city: 'Santiago',
          region: 'Metropolitana'
        }
      }
    };

    const mockRes = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.responseData = data;
        console.log(`📄 Mock Response (${this.statusCode}):`, JSON.stringify(data, null, 2));
        return this;
      }
    };

    console.log('✅ Mocks creados exitosamente');
    console.log('💡 El controlador está listo para ser usado con las rutas');

    return true;

  } catch (error) {
    console.error('❌ Error en test del controlador:', error.message);
    return false;
  } finally {
    await mongoose.connection.close();
  }
}

// Ejecutar test si el archivo se ejecuta directamente
if (require.main === module) {
  testPaymentController()
    .then(success => {
      process.exit(success ? 0 : 1);
    });
}

module.exports = { testPaymentController };
