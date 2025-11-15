// Test manual del flujo de pago
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testPaymentFlow() {
  try {
    console.log('🧪 INICIANDO TEST DEL FLUJO DE PAGO');
    console.log('=' .repeat(50));

    // PASO 1: Login
    console.log('\n📝 PASO 1: Haciendo login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'test@test.com',
      password: '123456'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login exitoso, token obtenido');

    // PASO 2: Obtener productos
    console.log('\n📦 PASO 2: Obteniendo productos...');
    const productsResponse = await axios.get(`${API_BASE}/products?page=1&limit=5&gender=dama`);
    const products = productsResponse.data.products;
    console.log(`✅ ${products.length} productos obtenidos`);

    if (products.length === 0) {
      throw new Error('No hay productos disponibles');
    }

    // PASO 3: Simular orden de compra
    const testProduct = products[0];
    console.log(`\n🛒 PASO 3: Preparando orden con producto: ${testProduct.name}`);
    
    const orderData = {
      orderItems: [{
        _id: testProduct._id,
        name: testProduct.name,
        price: testProduct.price,
        quantity: 1
      }],
      totalAmount: testProduct.price,
      shippingInfo: {
        name: 'Test User',
        email: 'test@test.com',
        phone: '+56912345678',
        address: 'Calle Falsa 123',
        city: 'Santiago',
        region: 'Metropolitana'
      }
    };

    console.log('📋 Datos de la orden:', JSON.stringify(orderData, null, 2));

    // PASO 4: Inicializar pago
    console.log('\n💳 PASO 4: Iniciando proceso de pago...');
    const paymentResponse = await axios.post(`${API_BASE}/payments/init`, orderData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Pago iniciado exitosamente');
    console.log('📄 Respuesta del pago:', JSON.stringify(paymentResponse.data, null, 2));

    if (paymentResponse.data.success) {
      console.log('\n🎉 TEST EXITOSO - El flujo de pago funciona correctamente');
      console.log(`🔗 URL de redirección: ${paymentResponse.data.data.url}`);
      console.log(`🎫 Token: ${paymentResponse.data.data.token}`);
    } else {
      console.log('\n❌ TEST FALLIDO - El pago no se pudo inicializar');
    }

  } catch (error) {
    console.error('\n❌ ERROR EN EL TEST:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Ejecutar test
testPaymentFlow();
