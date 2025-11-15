// Script de diagnóstico rápido
// Ejecutar en la consola del navegador (F12 → Console)

console.log('🔍 === DIAGNÓSTICO DEL SISTEMA ===\n');

// 1. Verificar configuración
console.log('1️⃣ CONFIGURACIÓN:');
console.log('Frontend URL:', window.location.origin);
console.log('API Base URL:', process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

// 2. Verificar localStorage
console.log('\n2️⃣ LOCALSTORAGE:');
console.log('Carrito:', localStorage.getItem('cart'));
console.log('Usuario:', localStorage.getItem('user'));
console.log('Token:', localStorage.getItem('token') ? 'Existe' : 'No existe');

// 3. Probar conexión con backend
console.log('\n3️⃣ PROBANDO CONEXIÓN CON BACKEND...');
fetch('http://localhost:5000/api/products?limit=1')
  .then(res => res.json())
  .then(data => {
    console.log('✅ Backend respondiendo correctamente');
    console.log('Productos disponibles:', data.count || data.total || 'N/A');
  })
  .catch(err => {
    console.error('❌ Error conectando al backend:', err.message);
  });

// 4. Verificar CartContext
console.log('\n4️⃣ VERIFICANDO CART CONTEXT:');
setTimeout(() => {
  try {
    const cartBtn = document.querySelector('[data-cart-count]');
    if (cartBtn) {
      console.log('✅ Botón del carrito encontrado');
      console.log('Items en carrito:', cartBtn.getAttribute('data-cart-count') || '0');
    } else {
      console.log('⚠️ Botón del carrito no encontrado');
    }
  } catch (e) {
    console.log('⚠️ No se pudo verificar el carrito:', e.message);
  }
}, 1000);

console.log('\n🔍 === FIN DEL DIAGNÓSTICO ===');
console.log('Si ves errores en rojo, cópialos y compártelos.');
