// Test con configuración SMTP manual (sin service: 'gmail')
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'vicente.cancino.torres@gmail.com',
    pass: 'pcxidlxucvtijnji'
  },
  tls: {
    rejectUnauthorized: true
  },
  debug: true,
  logger: true
});

async function testManualSMTP() {
  try {
    console.log('🧪 Testing with MANUAL SMTP config...');
    const result = await transporter.verify();
    console.log('✅ MANUAL SMTP test SUCCESS!', result);
    
    // Si funciona, enviar email de prueba
    console.log('📧 Sending test email...');
    const emailResult = await transporter.sendMail({
      from: '"Test Dejo Aromas" <vicente.cancino.torres@gmail.com>',
      to: 'vicente.cancino.torres@gmail.com',
      subject: '🎉 ¡Gmail funciona con SMTP manual!',
      html: '<h1>¡Éxito!</h1><p>El email está funcionando correctamente.</p>',
      text: '¡Éxito! El email está funcionando correctamente.'
    });
    
    console.log('🎉 Test email sent successfully!');
    console.log('📨 Message ID:', emailResult.messageId);
    
  } catch (error) {
    console.error('❌ MANUAL SMTP test FAILED:', error.message);
    console.error('🔍 Error details:', error);
  }
}

testManualSMTP();
