// Test independiente de conexión Gmail
const nodemailer = require('nodemailer');
require('dotenv').config();

async function testGmailConnection() {
  console.log('🧪 Testing Gmail connection...');
  console.log('📧 Email User:', process.env.EMAIL_USER);
  console.log('🔑 Email Pass:', process.env.EMAIL_PASS ? 'Configured' : 'NOT CONFIGURED');
  console.log('✅ Email Enabled:', process.env.EMAIL_ENABLED);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    secure: true,
    tls: {
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2'
    },
    debug: true,
    logger: true
  });

  try {
    console.log('🔍 Verifying connection...');
    const result = await transporter.verify();
    console.log('✅ Connection verified successfully!', result);

    // Test sending a simple email
    console.log('📨 Sending test email...');
    const testResult = await transporter.sendMail({
      from: `"Test Dejo Aromas" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: '🧪 Test Email - Gmail Connection',
      html: '<h1>¡Conexión Gmail funcionando!</h1><p>Este es un email de prueba.</p>',
      text: '¡Conexión Gmail funcionando! Este es un email de prueba.'
    });

    console.log('🎉 Test email sent successfully!');
    console.log('📨 Message ID:', testResult.messageId);
    
  } catch (error) {
    console.error('❌ Connection/Send failed:', error);
    
    if (error.code === 'EAUTH') {
      console.error('🔑 Authentication failed - Check your credentials');
    } else if (error.code === 'ECONNECTION') {
      console.error('🌐 Connection failed - Check your internet');
    } else if (error.code === 'ESOCKET') {
      console.error('🔒 SSL/TLS error - Certificate problem');
    }
  }
}

testGmailConnection();
