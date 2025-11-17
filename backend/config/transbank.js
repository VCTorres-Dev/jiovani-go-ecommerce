const { WebpayPlus, Environment, Options } = require('transbank-sdk');

// 1. Lee las credenciales de las variables de entorno de Railway
const commerceCode = process.env.TRANSBANK_COMMERCE_CODE;
const apiKey = process.env.TRANSBANK_API_KEY;
const env = process.env.TRANSBANK_ENV || 'integration'; // 'integration' por defecto

// 2. Valida que existan - pero solo en producción
if ((!commerceCode || !apiKey) && env === 'production') {
  console.error('❌ Error: Faltan variables de entorno TRANSBANK_COMMERCE_CODE o TRANSBANK_API_KEY en producción');
  throw new Error('Missing Transbank environment variables');
}

// Si estamos en desarrollo y faltan las variables, mostrar advertencia pero continuar
if (!commerceCode || !apiKey) {
  console.warn('⚠️ ADVERTENCIA: Variables de Transbank no configuradas. Los pagos con Transbank no funcionarán.');
  console.warn('   Para desarrollo local, esto es normal. Para producción, configura las variables de entorno.');
}

// 3. Configura el ambiente (Integración o Producción)
const transbankEnv = env === 'production' 
  ? Environment.Production 
  : Environment.Integration;

console.log(`Transbank configurando para ambiente: ${env}`);

// 4. Configura las opciones con tus llaves y el ambiente
let options = null;
let transaction = null;

// Solo crear transaction si tenemos credenciales
if (commerceCode && apiKey) {
  options = new Options(commerceCode, apiKey, transbankEnv);
  transaction = new WebpayPlus.Transaction(options);
  console.log(`Codigo de comercio: ${commerceCode.substring(0, 4)}...`);
  console.log('API Key configurada.');
} else {
  console.log('⚠️ Transbank deshabilitado: sin credenciales configuradas');
}

module.exports = {
  transaction,
  WebpayPlus
};