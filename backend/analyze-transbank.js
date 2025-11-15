// Análisis de la estructura del SDK de Transbank
const transbank = require('transbank-sdk');

console.log('📦 Análisis del SDK de Transbank:');
console.log('Propiedades disponibles:', Object.keys(transbank));

// Intentar acceder a WebpayPlus
if (transbank.WebpayPlus) {
  console.log('✅ WebpayPlus disponible');
  console.log('Métodos de WebpayPlus:', Object.keys(transbank.WebpayPlus));
  
  if (transbank.WebpayPlus.Transaction) {
    console.log('✅ Transaction disponible');
    console.log('Métodos de Transaction:', Object.keys(transbank.WebpayPlus.Transaction));
  }
} else {
  console.log('❌ WebpayPlus no disponible');
}

// Verificar Options
if (transbank.Options) {
  console.log('✅ Options disponible');
} else {
  console.log('❌ Options no disponible');
}

// Verificar IntegrationType
if (transbank.IntegrationType) {
  console.log('✅ IntegrationType disponible');
  console.log('Valores disponibles:', transbank.IntegrationType);
} else {
  console.log('❌ IntegrationType no disponible');
}
