// Script para verificar la carga de rutas como lo hace server.js
console.log('\n' + '='.repeat(80));
console.log('IMITANDO CARGA DE RUTAS DE server.js');
console.log('='.repeat(80) + '\n');

try {
  console.log('[TEST] Iniciando try block...');
  
  const analyticsRoutes = require("./routes/analyticsRoutes"); 
  console.log('[TEST] analyticsRoutes cargado');
  
  const orderRoutes = require("./routes/orderRoutes"); 
  console.log('[TEST] orderRoutes cargado');
  
  const messageRoutes = require('./routes/messageRoutes'); 
  console.log('[TEST] messageRoutes cargado');
  
  const paymentRoutes = require('./routes/paymentRoutes');
  console.log('[TEST] paymentRoutes cargado');
  
  const userRoutes = require("./routes/userRoutes");
  console.log('[TEST] userRoutes cargado');
  
  console.log('\n[TEST] --- Ahora cargando authRoutes ---\n');
  const authRoutes = require("./routes/authRoutes");
  console.log('\n[TEST] authRoutes cargado correctamente\n');
  
  console.log('[TEST] Todas las rutas cargadas exitosamente');
  
} catch (error) {
  console.error('\n[ERROR] FALLO EN TRY/CATCH:');
  console.error('Mensaje:', error.message);
  console.error('Stack:', error.stack);
  console.error('\nNo se pudieron cargar algunas rutas:', error.message);
}

console.log('\n' + '='.repeat(80) + '\n');
