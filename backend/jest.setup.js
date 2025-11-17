// Configuración global de Jest
require('dotenv').config({ path: '.env.test' });

// Timeout extendido para operaciones de BD
jest.setTimeout(30000);

// Silenciar logs durante tests (opcional, puedes descomentar si quieres)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: console.warn,
//   error: console.error,
// };
