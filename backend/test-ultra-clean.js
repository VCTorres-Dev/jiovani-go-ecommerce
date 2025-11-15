// Test ultra limpio sin .env
const nodemailer = require('nodemailer');

// Hardcoded sin ninguna variable externa
const testCredentials = {
  user: 'vicente.cancino.torres@gmail.com',
  pass: 'pcxi dlxu cvti jnji'  // CON espacios como viene de Google
};

console.log('🧪 Ultra-clean test...');
console.log('User:', testCredentials.user);
console.log('Pass:', testCredentials.pass);

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: testCredentials,
  debug: true,
  logger: true
});

async function ultraTest() {
  try {
    console.log('🔍 Verifying...');
    await transporter.verify();
    console.log('✅ SUCCESS!');
  } catch (error) {
    console.error('❌ FAILED:', error.message);
  }
}

ultraTest();
