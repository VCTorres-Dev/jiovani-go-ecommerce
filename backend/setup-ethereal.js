// Configurar Ethereal Email automáticamente
const nodemailer = require('nodemailer');

async function createEtherealAccount() {
  try {
    console.log('🔧 Creando cuenta de prueba Ethereal...');
    
    // Crear cuenta de prueba automáticamente
    const testAccount = await nodemailer.createTestAccount();
    
    console.log('✅ Cuenta Ethereal creada:');
    console.log('📧 Email:', testAccount.user);
    console.log('🔑 Password:', testAccount.pass);
    console.log('🌐 SMTP Host:', testAccount.smtp.host);
    console.log('🔌 SMTP Port:', testAccount.smtp.port);
    
    // Crear transporter con la cuenta de prueba
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Probar enviando un email
    console.log('📨 Enviando email de prueba...');
    
    const result = await transporter.sendMail({
      from: '"Dejo Aromas Test" <test@dejoaromas.cl>',
      to: 'cliente@test.com',
      subject: '✅ ¡Email de Prueba Funcionando!',
      html: `
        <h1>🎉 ¡Éxito!</h1>
        <p>El sistema de emails de Dejo Aromas está funcionando correctamente.</p>
        <p>Este email fue enviado usando <strong>Ethereal Email</strong> para pruebas.</p>
        <hr>
        <p><small>Orden #12345 - $25.990</small></p>
      `,
      text: '¡Éxito! El sistema de emails está funcionando.',
    });

    console.log('🎉 Email enviado exitosamente!');
    console.log('📨 Message ID:', result.messageId);
    
    // URL para ver el email en Ethereal
    const previewURL = nodemailer.getTestMessageUrl(result);
    console.log('👀 Ver email en navegador:', previewURL);
    
    return {
      user: testAccount.user,
      pass: testAccount.pass,
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      previewURL
    };
    
  } catch (error) {
    console.error('❌ Error con Ethereal:', error);
  }
}

createEtherealAccount();
