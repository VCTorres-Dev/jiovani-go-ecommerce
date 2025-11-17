// Test simple: ¿Se carga userRoutes.js sin errores?
try {
  const userRoutes = require('./routes/userRoutes');
  console.log('[LOAD TEST] ✅ userRoutes.js cargado exitosamente');
  console.log('[LOAD TEST] userRoutes es:', typeof userRoutes);
  console.log('[LOAD TEST] userRoutes._router:', userRoutes._router ? 'Tiene router' : 'No tiene router');
} catch (error) {
  console.error('[LOAD TEST] ❌ Error cargando userRoutes.js:');
  console.error(error);
}
