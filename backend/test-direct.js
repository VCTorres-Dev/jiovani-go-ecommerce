// Test directo de variables .env
require('dotenv').config();

console.log('🔍 Testing .env variables directly...');
console.log('EMAIL_USER:', `"${process.env.EMAIL_USER}"`);
console.log('EMAIL_PASS raw:', `"${process.env.EMAIL_PASS}"`);
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'undefined');

// Probar con credenciales directas (hardcoded para test)
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vicente.cancino.torres@gmail.com',
    pass: 'pcxidlxucvtijnji'  // Directamente hardcoded para verificar
  },
  secure: true,
  tls: {
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2'
  },
  debug: true,
  logger: true
});

async function testDirect() {
  try {
    console.log('🧪 Testing with DIRECT credentials...');
    const result = await transporter.verify();
    console.log('✅ DIRECT test SUCCESS!', result);
  } catch (error) {
    console.error('❌ DIRECT test FAILED:', error.message);
  }
}

testDirect();
