const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  /**
   * Inicializa el transportador de email
   * En desarrollo usa configuración simple, en producción usar SMTP dedicado
   */
  initializeTransporter() {
    try {
      if (process.env.EMAIL_ENABLED === 'true') {
        console.log('🔧 Configurando Ethereal para pruebas...');
        
        // Configuración para Ethereal (servicio de prueba)
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT),
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          },
          debug: process.env.NODE_ENV === 'development',
          logger: process.env.NODE_ENV === 'development'
        });
        
        console.log('✅ Ethereal email service configurado para pruebas');
        console.log('📧 Host:', process.env.SMTP_HOST);
        console.log('🔌 Port:', process.env.SMTP_PORT);
        
        // Verificar conexión inmediatamente
        this.verifyConnection();
        
      } else {
        console.log('⚠️ Email service deshabilitado. Configurar EMAIL_ENABLED=true para activar');
        
        // Transportador de prueba para desarrollo
        this.transporter = nodemailer.createTransport({
          streamTransport: true,
          newline: 'unix',
          buffer: true
        });
      }
    } catch (error) {
      console.error('❌ Error crítico inicializando email service:', error);
      
      // Fallback seguro
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true
      });
    }
  }

  /**
   * Verifica la conexión con el servidor de email
   */
  async verifyConnection() {
    try {
      console.log('🔍 Verificando conexión con Gmail...');
      const result = await this.transporter.verify();
      
      if (result) {
        console.log('✅ Conexión con Gmail verificada exitosamente');
        return true;
      } else {
        throw new Error('Verificación falló');
      }
    } catch (error) {
      console.error('❌ Error verificando conexión Gmail:', error.message);
      
      // Detalles específicos de errores comunes
      if (error.code === 'EAUTH') {
        console.error('🔑 Error de autenticación: Verifica EMAIL_USER y EMAIL_PASS');
      } else if (error.code === 'ECONNECTION') {
        console.error('🌐 Error de conexión: Verifica tu conexión a internet');
      } else if (error.code === 'ESOCKET') {
        console.error('🔒 Error SSL/TLS: Problema con certificados de seguridad');
      }
      
      return false;
    }
  }

  /**
   * Carga y compila una plantilla de email
   * @param {string} templateName - Nombre del archivo de plantilla
   * @param {object} data - Datos para la plantilla
   * @returns {string} HTML compilado
   */
  loadTemplate(templateName, data) {
    try {
      const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);
      return template(data);
    } catch (error) {
      console.error(`❌ Error loading template ${templateName}:`, error);
      // Fallback a plantilla básica
      return this.generateBasicTemplate(data);
    }
  }

  /**
   * Genera una plantilla básica en caso de error
   * @param {object} data - Datos básicos
   * @returns {string} HTML básico
   */
  generateBasicTemplate(data) {
    return `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">🌸 Dejo Aromas</h1>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #28a745;">¡Gracias por tu compra!</h2>
          <p>Hola ${data.customerName || 'Cliente'},</p>
          <p>Tu pedido ha sido procesado exitosamente.</p>
          <p><strong>Número de orden:</strong> ${data.orderNumber}</p>
          <p><strong>Total:</strong> $${data.total?.toLocaleString('es-CL') || '0'}</p>
        </div>
        <p style="text-align: center; color: #666; margin-top: 20px;">
          Este es un email automático de Dejo Aromas
        </p>
      </body>
      </html>
    `;
  }

  /**
   * Envía email de confirmación de pedido
   * @param {string} toEmail - Email del destinatario
   * @param {object} emailData - Datos para la plantilla
   * @returns {Promise<object>} Resultado del envío
   */
  async sendOrderConfirmation(toEmail, emailData) {
    try {
      // Validaciones previas
      if (!toEmail || !emailData) {
        throw new Error('Email de destino o datos requeridos no proporcionados');
      }

      if (!emailData.customerName || !emailData.orderNumber) {
        throw new Error('Datos del pedido incompletos');
      }

      console.log('[EMAIL] 📧 Iniciando envío a:', toEmail);
      console.log('[EMAIL] 📋 Orden:', emailData.orderNumber);

      // Preparar datos para la plantilla (usar los datos que vienen del controller)
      const templateData = emailData;

      // Compilar plantilla
      const htmlContent = this.loadTemplate('order-confirmation', templateData);

      // Configurar email con validaciones
      const mailOptions = {
        from: `"jiovaniGo Chile" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `✅ Confirmación de Compra #${templateData.orderNumber} - jiovaniGo Chile`,
        html: htmlContent,
        // Versión de texto plano como fallback
        text: `
          ¡Gracias por tu compra en jiovaniGo Chile!
          
          Orden: ${templateData.orderNumber}
          Fecha: ${templateData.orderDate}
          Total: $${templateData.total}
          Estado: ${templateData.paymentStatus}
          
          Productos:
          ${templateData.products.map(item => `- ${item.name} x${item.quantity}: $${item.subtotal}`).join('\n')}
        `
      };

      // Enviar email con logging detallado
      console.log('[EMAIL] 🚀 Enviando email...');
      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ [EMAIL] Email enviado exitosamente!');
      console.log('📨 [EMAIL] Message ID:', result.messageId);
      console.log('👤 [EMAIL] Enviado a:', toEmail);
      
      // Si es Ethereal, obtener URL de preview
      const previewURL = nodemailer.getTestMessageUrl(result);
      if (previewURL) {
        console.log('👀 [EMAIL] Ver email en navegador:', previewURL);
      }
      
      return {
        success: true,
        messageId: result.messageId,
        recipient: toEmail,
        previewURL: previewURL || null
      };

    } catch (error) {
      console.error('❌ [EMAIL] Error crítico enviando email:', error);
      
      // Logging detallado del error
      if (error.code) {
        console.error('🔴 [EMAIL] Código de error:', error.code);
      }
      if (error.response) {
        console.error('🔴 [EMAIL] Respuesta del servidor:', error.response);
      }
      
      // Re-lanzar el error para que lo capture el controlador
      throw new Error(`Error enviando email: ${error.message}`);
    }
  }

  /**
   * Envía email de actualización de estado
   * @param {object} order - Datos de la orden
   * @param {string} newStatus - Nuevo estado
   * @returns {Promise<object>} Resultado del envío
   */
  async sendOrderStatusUpdate(order, newStatus) {
    try {
      console.log('[EMAIL] Enviando actualización de estado:', order._id, newStatus);

      const statusMessages = {
        'processing': 'Tu pedido está siendo preparado',
        'shipped': 'Tu pedido ha sido enviado',
        'delivered': 'Tu pedido ha sido entregado',
        'cancelled': 'Tu pedido ha sido cancelado'
      };

      const templateData = {
        customerName: order.shippingInfo.name,
        orderNumber: order.transbank?.buyOrder || order._id.toString().slice(-8),
        status: newStatus,
        statusMessage: statusMessages[newStatus] || 'Estado actualizado',
        orderDate: new Date(order.createdAt).toLocaleDateString('es-CL'),
        total: order.totalAmount
      };

      const htmlContent = this.loadTemplate('order-status-update', templateData);

      const mailOptions = {
        from: `"Dejo Aromas" <${process.env.EMAIL_USER || 'noreply@dejoaromas.cl'}>`,
        to: order.shippingInfo.email,
        subject: `📦 Actualización de tu pedido #${templateData.orderNumber} - Dejo Aromas`,
        html: htmlContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Email de actualización enviado:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId
      };

    } catch (error) {
      console.error('❌ Error enviando email de actualización:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verifica la conexión del servicio de email
   * @returns {Promise<boolean>} Estado de la conexión
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}

// Exportar instancia única (singleton)
module.exports = new EmailService();
