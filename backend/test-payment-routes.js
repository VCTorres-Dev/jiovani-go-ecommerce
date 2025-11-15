// Test de las rutas de pago
const http = require('http');

function testPaymentRoutes() {
  console.log('🧪 Probando rutas de pago...');

  // Test health check
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/payments/health',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('✅ Health check exitoso:');
        console.log('   Status:', res.statusCode);
        console.log('   Response:', response);
      } catch (error) {
        console.log('❌ Error parseando respuesta:', error.message);
        console.log('   Raw data:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Error en request:', error.message);
    console.log('💡 Asegúrate de que el servidor esté ejecutándose en puerto 5000');
  });

  req.end();
}

// Ejecutar test
if (require.main === module) {
  testPaymentRoutes();
}

module.exports = { testPaymentRoutes };
