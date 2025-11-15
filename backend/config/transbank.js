const { WebpayPlus, Environment, Options } = require('transbank-sdk');

// 1. Lee las credenciales de las variables de entorno de Railway
const commerceCode = process.env.TRANSBANK_COMMERCE_CODE;
const apiKey = process.env.TRANSBANK_API_KEY;
const env = process.env.TRANSBANK_ENV || 'integration'; // 'integration' por defecto

// 2. Valida que existan
if (!commerceCode || !apiKey) {
  console.error('❌ Error: Faltan variables de entorno TRANSBANK_COMMERCE_CODE o TRANSBANK_API_KEY');
  // Lanzar un error aquí detendrá la app si faltan las llaves, lo cual es bueno.
  throw new Error('Missing Transbank environment variables');
}

// 3. Configura el ambiente (Integración o Producción)
const transbankEnv = env === 'production' 
  ? Environment.Production 
  : Environment.Integration;

console.log(`✅ Transbank configurando para ambiente: ${env}`);

// 4. Configura las opciones con tus llaves y el ambiente
const options = new Options(commerceCode, apiKey, transbankEnv);

// 5. Construye la transacción usando tus opciones
const transaction = new WebpayPlus.Transaction(options);

console.log(`📋 Código de comercio: ${commerceCode.substring(0, 4)}...`);
console.log('🔑 API Key configurada.');

module.exports = {
  transaction,
  WebpayPlus
};