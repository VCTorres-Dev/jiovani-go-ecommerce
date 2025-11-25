const sgMail = require('@sendgrid/mail');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

class EmailService {
  constructor() {
    this.isConfigured = false;
    this.initializeSendGrid();
  }

  /**
   * Inicializa SendGrid con la API key
   */
  initializeSendGrid() {
    try {
      if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== '') {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        this.isConfigured = true;

        console.log('✅ SendGrid configurado exitosamente');
        console.log('📧 Email desde:', process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM || 'noreply@dejoaromas.cl');

      } else {
        console.log('⚠️ SendGrid no configurado. Agregar SENDGRID_API_KEY a variables de entorno');
        this.isConfigured = false;
      }
    } catch (error) {
      console.error('❌ Error inicializando SendGrid:', error.message);
      this.isConfigured = false;
    }
  }

  /**
   * Verifica si SendGrid está configurado correctamente
   * @returns {boolean} Estado de configuración
   */
  async verifyConnection() {
    if (!this.isConfigured) {
      console.log('⚠️ SendGrid no está configurado');
      return false;
    }

    console.log('✅ SendGrid listo para enviar emails');
    return true;
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
        <h1 style="color: #333; text-align: center;">🌸 jiovaniGo Chile</h1>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #28a745;">¡Gracias por tu compra!</h2>
          <p>Hola ${data.customerName || 'Cliente'},</p>
          <p>Tu pedido ha sido procesado exitosamente.</p>
          <p><strong>Número de orden:</strong> ${data.orderNumber}</p>
          <p><strong>Total:</strong> $${data.total?.toLocaleString('es-CL') || '0'}</p>
        </div>
        <p style="text-align: center; color: #666; margin-top: 20px;">
          Este es un email automático de jiovaniGo Chile
        </p>
      </body>
      </html>
    `;
  }

  /**
   * Envía email de confirmación de pedido usando SendGrid
   * @param {string} toEmail - Email del destinatario
   * @param {object} emailData - Datos para la plantilla
   * @returns {Promise<object>} Resultado del envío
   */
  async sendOrderConfirmation(toEmail, emailData) {
    try {
      // Validar que SendGrid esté configurado
      if (!this.isConfigured) {
        throw new Error('SendGrid no está configurado. Verifica SENDGRID_API_KEY en variables de entorno');
      }

      // Validaciones previas
      if (!toEmail || !emailData) {
        throw new Error('Email de destino o datos requeridos no proporcionados');
      }

      if (!emailData.customerName || !emailData.orderNumber) {
        throw new Error('Datos del pedido incompletos');
      }

      console.log('[EMAIL] 📧 Iniciando envío a:', toEmail);
      console.log('[EMAIL] 📋 Orden:', emailData.orderNumber);

      // Preparar datos para la plantilla
      const templateData = emailData;

      // Compilar plantilla
      const htmlContent = this.loadTemplate('order-confirmation', templateData);

      // Configurar mensaje de SendGrid
      const fromEmail = process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM || 'noreply@dejoaromas.cl';

      const msg = {
        to: toEmail,
        from: {
          email: fromEmail,
          name: 'jiovaniGo Chile'
        },
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
        `,
        // Categorías para tracking en SendGrid
        categories: ['order-confirmation', 'transactional']
      };

      // Enviar email con SendGrid
      console.log('[EMAIL] 🚀 Enviando email via SendGrid...');
      const response = await sgMail.send(msg);

      console.log('✅ [EMAIL] Email enviado exitosamente!');
      console.log('📨 [EMAIL] Status Code:', response[0].statusCode);
      console.log('👤 [EMAIL] Enviado a:', toEmail);

      return {
        success: true,
        messageId: response[0].headers['x-message-id'] || 'sendgrid-success',
        recipient: toEmail,
        statusCode: response[0].statusCode
      };

    } catch (error) {
      console.error('❌ [EMAIL] Error crítico enviando email:', error);

      // Logging detallado del error de SendGrid
      if (error.response) {
        console.error('🔴 [EMAIL] SendGrid Error:', error.response.body);
      }
      if (error.code) {
        console.error('🔴 [EMAIL] Código de error:', error.code);
      }

      // Re-lanzar el error para que lo capture el controlador
      throw new Error(`Error enviando email: ${error.message}`);
    }
  }

  /**
   * Envía email de actualización de estado usando SendGrid
   * @param {object} order - Datos de la orden
   * @param {string} newStatus - Nuevo estado
   * @returns {Promise<object>} Resultado del envío
   */
  async sendOrderStatusUpdate(order, newStatus) {
    try {
      if (!this.isConfigured) {
        throw new Error('SendGrid no está configurado');
      }

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

      const fromEmail = process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM || 'noreply@dejoaromas.cl';

      const msg = {
        to: order.shippingInfo.email,
        from: {
          email: fromEmail,
          name: 'jiovaniGo Chile'
        },
        subject: `📦 Actualización de tu pedido #${templateData.orderNumber} - jiovaniGo Chile`,
        html: htmlContent,
        categories: ['order-status-update', 'transactional']
      };

      const response = await sgMail.send(msg);

      console.log('✅ Email de actualización enviado:', response[0].statusCode);

      return {
        success: true,
        messageId: response[0].headers['x-message-id'] || 'sendgrid-success',
        statusCode: response[0].statusCode
      };

    } catch (error) {
      console.error('❌ Error enviando email de actualización:', error);
      if (error.response) {
        console.error('🔴 SendGrid Error:', error.response.body);
      }
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Exportar instancia única (singleton)
module.exports = new EmailService();
