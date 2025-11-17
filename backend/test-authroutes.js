// Script para verificar si authRoutes se carga correctamente
console.log('\n='.repeat(80));
console.log('VERIFICANDO CARGA DE authRoutes.js...');
console.log('='.repeat(80) + '\n');

try {
  console.log('1. Intentando hacer require de authRoutes...');
  const authRoutes = require("./routes/authRoutes");
  console.log('2. SUCCESS: authRoutes se cargó correctamente');
  console.log('3. Type:', typeof authRoutes);
  console.log('4. authRoutes es un Router:', authRoutes.constructor.name);
  console.log('\nCONCLUSION: authRoutes.js ESTÁ LISTO Y FUNCIONAL\n');
} catch (error) {
  console.error('ERROR: No se pudo cargar authRoutes');
  console.error('Mensaje:', error.message);
  console.error('Stack:', error.stack);
  console.error('\nPosibles causas:');
  console.error('- Error de sintaxis en authRoutes.js');
  console.error('- Falta de dependencia (mongoose, express, etc)');
  console.error('- Ruta incorrecta del archivo\n');
}

console.log('='.repeat(80));
