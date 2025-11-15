const { WebpayPlus, IntegrationCommerceCodes, IntegrationApiKeys } = require('transbank-sdk');

// Configuración para ambiente de integración (sandbox)
// Según la documentación oficial de Transbank
const INTEGRATION_COMMERCE_CODE = IntegrationCommerceCodes.WEBPAY_PLUS;
const INTEGRATION_API_KEY = IntegrationApiKeys.WEBPAY;

// Construir la instancia de transacción para integración
const transaction = WebpayPlus.Transaction.buildForIntegration();

console.log('✅ Transbank configurado para ambiente de integración');
console.log(`📋 Código de comercio: ${INTEGRATION_COMMERCE_CODE}`);
console.log(`🔑 API Key configurada correctamente`);

module.exports = {
  transaction,
  WebpayPlus,
  INTEGRATION_COMMERCE_CODE,
  INTEGRATION_API_KEY
};
