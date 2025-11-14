const { transaction } = require('../config/transbank');
const Order = require('../models/Order');
const Product = require('../models/Product');
const EmailService = require('../services/emailService');
const User = require('../models/User');

/**
 * @desc    Iniciar transacción de pago con Transbank
 * @route   POST /api/payments/init
 * @access  Private
 */
const initPayment = async (req, res) => {
  try {
    console.log('🚀 [PAYMENT] Iniciando proceso de pago...');
    console.log('📥 [PAYMENT] Request body:', JSON.stringify(req.body, null, 2));
    
    // Usuario opcional (puede venir del token JWT o del body)
    const userEmail = req.user?.email || req.body.userEmail || 'guest@example.com';
    console.log('👤 [PAYMENT] Usuario:', userEmail);
    
    const { orderItems, totalAmount, shippingInfo } = req.body;

    // Validación de datos de entrada
    if (!orderItems || orderItems.length === 0) {
      console.log('❌ [PAYMENT] Error: No hay artículos en la orden');
      return res.status(400).json({ 
        success: false,
        message: 'No se han proporcionado artículos para la orden' 
      });
    }

    if (!shippingInfo || !shippingInfo.name || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address) {
      console.log('❌ [PAYMENT] Error: Información de envío incompleta');
      return res.status(400).json({ 
        success: false,
        message: 'Información de envío incompleta' 
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      console.log('❌ [PAYMENT] Error: Monto total inválido:', totalAmount);
      return res.status(400).json({ 
        success: false,
        message: 'Monto total inválido' 
      });
    }

    console.log(`📝 [PAYMENT] Validando stock para ${orderItems.length} productos...`);
    console.log('🔍 [PAYMENT] Items recibidos:', orderItems.map(item => ({
      id: item._id,
      name: item.name,
      imageURL: item.imageURL,
      hasImageURL: !!item.imageURL
    })));

    // Verificar stock y validar productos antes de proceder
    const validatedProducts = [];
    for (const item of orderItems) {
      const product = await Product.findById(item._id);
      if (!product) {
        return res.status(404).json({ 
          success: false,
          message: `Producto no encontrado: ${item.name || 'Desconocido'}` 
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false,
          message: `Stock insuficiente para ${product.name}. Stock disponible: ${product.stock}` 
        });
      }
      const validatedProduct = {
        product: product._id,
        quantity: item.quantity,
        price: item.price,
        name: product.name,
        imageURL: item.imageURL || product.imageURL // Preservar imageURL del carrito o usar del producto como fallback
      };
      
      console.log('✅ [PAYMENT] Producto validado:', {
        name: validatedProduct.name,
        imageURL: validatedProduct.imageURL,
        fromCart: !!item.imageURL,
        fromDB: !!product.imageURL
      });
      
      validatedProducts.push(validatedProduct);
    }

    // Generar identificadores únicos para Transbank
    // Si viene de testing, usar un ID temporal
    const userId = req.user?._id || new Object('507f1f77bcf86cd799439011'); // MongoDB ObjectId temporal
    const buyOrder = Order.generateBuyOrder(userId);
    const sessionId = Order.generateSessionId();
    
    // Configurar URL de retorno basada en el entorno
    // IMPORTANTE: returnUrl debe apuntar al backend (accesible por Transbank)
    const backendUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
    const returnUrl = `${backendUrl}/api/payments/result`;

    console.log(`📋 Datos de transacción:
      - Buy Order: ${buyOrder}
      - Session ID: ${sessionId}
      - Amount: $${totalAmount.toLocaleString('es-CL')}
      - Return URL: ${returnUrl}
      - Usuario: ${userEmail}`);

    // Crear orden en la base de datos ANTES de contactar Transbank
    const order = new Order({
      user: userId,
      products: validatedProducts,
      totalAmount,
      shippingInfo,
      transbank: {
        buyOrder,
        sessionId
      },
      status: 'pending'
    });

    await order.save();
    console.log(`✅ Orden creada en DB con ID: ${order._id}`);

    // Crear transacción con Transbank
    try {
      const transbankResponse = await transaction.create(
        buyOrder,
        sessionId,
        Math.round(totalAmount), // Transbank requiere enteros
        returnUrl
      );

      // Actualizar orden con token de Transbank
      order.transbank.token = transbankResponse.token;
      await order.save();

      console.log(`✅ Transacción Transbank creada exitosamente`);
      console.log(`🔑 Token: ${transbankResponse.token.substring(0, 20)}...`);

      // Respuesta exitosa
      res.status(200).json({
        success: true,
        data: {
          token: transbankResponse.token,
          url: transbankResponse.url,
          orderId: order._id,
          buyOrder: buyOrder
        },
        message: 'Transacción iniciada exitosamente'
      });

    } catch (transbankError) {
      console.error('❌ Error con Transbank:', transbankError.message);
      
      // Actualizar estado de la orden
      order.status = 'failed';
      await order.save();

      // Para desarrollo, si es error 401 (dominio no autorizado), usar simulación
      if (transbankError.message.includes('401')) {
        console.log('💡 Usando simulación para desarrollo local...');
        
        // Simular respuesta de Transbank para desarrollo
        const simulatedToken = `simulated_token_${Date.now()}`;
        const frontendUrlReal = process.env.FRONTEND_URL_REAL || 'http://localhost:3000';
        const simulatedUrl = `${frontendUrlReal}/payment/simulate?token=${simulatedToken}&order=${order._id}`;
        
        order.transbank.token = simulatedToken;
        order.status = 'pending';
        await order.save();

        return res.status(200).json({
          success: true,
          data: {
            token: simulatedToken,
            url: simulatedUrl,
            orderId: order._id,
            buyOrder: buyOrder,
            isSimulation: true
          },
          message: 'Transacción iniciada en modo simulación (desarrollo)'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Error al iniciar transacción con Transbank',
        error: process.env.NODE_ENV === 'development' ? transbankError.message : 'Error interno'
      });
    }

  } catch (error) {
    console.error('❌ Error general en initPayment:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

/**
 * @desc    Confirmar transacción de pago desde Transbank
 * @route   POST /api/payments/confirm
 * @access  Public (webhook de Transbank)
 */
const confirmPayment = async (req, res) => {
  try {
    console.log('🔄 [CONFIRM] Iniciando confirmación de pago...');
    console.log('📥 [CONFIRM] Body recibido:', JSON.stringify(req.body, null, 2));
    console.log('📥 [CONFIRM] Query params:', JSON.stringify(req.query, null, 2));

    // Extraer TODAS las variables posibles según documentación Transbank
    const { 
      token_ws,           // Token normal (flujo exitoso)
      TBK_TOKEN,          // Token cuando usuario cancela
      TBK_ORDEN_COMPRA,   // Buy order cuando hay timeout o cancelación
      TBK_ID_SESION       // Session ID cuando hay timeout o cancelación
    } = { ...req.body, ...req.query }; // Soportar POST y GET

    // ==========================================
    // CASO 1: TIMEOUT (Formulario expiró - 10 min)
    // ==========================================
    if (!token_ws && !TBK_TOKEN && TBK_ORDEN_COMPRA && TBK_ID_SESION) {
      console.log('⏱️ [CONFIRM] TIMEOUT detectado - Usuario excedió tiempo en formulario');
      console.log(`   Buy Order: ${TBK_ORDEN_COMPRA}`);
      console.log(`   Session ID: ${TBK_ID_SESION}`);

      const order = await Order.findOne({ 'transbank.buyOrder': TBK_ORDEN_COMPRA });
      
      if (order) {
        order.status = 'failed';
        order.transbank.timeoutExpired = true;
        order.transbank.responseCode = -1; // Código personalizado para timeout
        await order.save();
        
        console.log('✅ [CONFIRM] Orden marcada como timeout');
      }

      return res.status(200).json({
        success: false,
        message: 'Transacción cancelada por timeout',
        reason: 'TIMEOUT',
        buyOrder: TBK_ORDEN_COMPRA
      });
    }

    // ==========================================
    // CASO 2: USUARIO CANCELÓ (Botón "Anular" en Transbank)
    // ==========================================
    if (TBK_TOKEN && TBK_ORDEN_COMPRA && TBK_ID_SESION) {
      console.log('❌ [CONFIRM] CANCELACIÓN detectada - Usuario anuló en formulario');
      console.log(`   Token: ${TBK_TOKEN.substring(0, 20)}...`);
      console.log(`   Buy Order: ${TBK_ORDEN_COMPRA}`);

      const order = await Order.findOne({ 'transbank.buyOrder': TBK_ORDEN_COMPRA });
      
      if (order) {
        // Consultar estado real con Transbank (recomendado por documentación)
        try {
          const transbankStatus = await transaction.status(TBK_TOKEN);
          console.log('📊 [CONFIRM] Estado consultado:', transbankStatus.status);
          
          order.status = 'cancelled';
          order.transbank.cancelledByUser = true;
          order.transbank.status = transbankStatus.status || 'CANCELLED';
          order.transbank.responseCode = transbankStatus.response_code || -2;
          await order.save();
          
        } catch (statusError) {
          console.log('⚠️ [CONFIRM] No se pudo consultar estado, marcando como cancelado');
          order.status = 'cancelled';
          order.transbank.cancelledByUser = true;
          await order.save();
        }
        
        console.log('✅ [CONFIRM] Orden marcada como cancelada por usuario');
      }

      return res.status(200).json({
        success: false,
        message: 'Transacción cancelada por el usuario',
        reason: 'USER_CANCELLED',
        buyOrder: TBK_ORDEN_COMPRA
      });
    }

    // ==========================================
    // CASO 3 y 4: FLUJO NORMAL (token_ws presente)
    // ==========================================
    const tokenToUse = token_ws || TBK_TOKEN;
    
    if (!tokenToUse) {
      console.log('❌ [CONFIRM] Error: No se recibió ningún token válido');
      return res.status(400).json({
        success: false,
        message: 'Token de transacción requerido'
      });
    }

    console.log(`🔑 [CONFIRM] Token recibido: ${tokenToUse.substring(0, 20)}...`);

    // Buscar la orden por el token
    const order = await Order.findOne({ 
      $or: [
        { 'transbank.token': tokenToUse },
        { 'transbank.token': token_ws }
      ]
    })
      .populate('products.product')
      .populate('user', 'username email');

    if (!order) {
      console.log('❌ [CONFIRM] Orden no encontrada para el token');
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada para el token proporcionado'
      });
    }

    console.log(`📋 [CONFIRM] Orden encontrada: ${order._id}`);
    console.log(`📊 [CONFIRM] Estado actual: ${order.status}`);

    // ==========================================
    // VALIDACIÓN: Evitar double-commit
    // ==========================================
    if (order.status === 'completed' && order.transbank.responseCode === 0) {
      console.log('⚠️ [CONFIRM] ADVERTENCIA: Orden ya fue confirmada previamente');
      return res.status(200).json({
        success: true,
        message: 'Orden ya procesada anteriormente',
        data: {
          orderId: order._id,
          authorizationCode: order.transbank.authorizationCode,
          amount: order.transbank.amount,
          warning: 'ALREADY_PROCESSED'
        }
      });
    }

    // Incrementar contador de intentos de commit
    order.transbank.commitAttempts = (order.transbank.commitAttempts || 0) + 1;
    order.transbank.lastCommitAttempt = new Date();

    // ==========================================
    // MANEJO DE SIMULACIÓN (Desarrollo)
    // ==========================================
    if (tokenToUse.startsWith('simulated_token_')) {
      console.log('🧪 [CONFIRM] Procesando pago simulado...');
      
      order.transbank = {
        ...order.transbank,
        transactionDate: new Date(),
        authorizationCode: `SIM${Date.now()}`,
        paymentTypeCode: 'VD',
        responseCode: 0,
        status: 'AUTHORIZED',
        amount: order.totalAmount,
        installmentsNumber: 1,
        cardNumber: '****1234',
        vci: 'TSY'
      };

      order.status = 'completed';
      await order.save();

      // Descontar stock
      for (const item of order.products) {
        await Product.updateOne(
          { _id: item.product._id },
          { $inc: { stock: -item.quantity } }
        );
      }

      console.log('✅ [CONFIRM] Pago simulado procesado exitosamente');

      const orderItemsForEmail = order.products.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));
      const emailResult = await sendOrderConfirmationEmail(order, order.user, orderItemsForEmail);

      return res.status(200).json({
        success: true,
        data: {
          orderId: order._id,
          authorizationCode: order.transbank.authorizationCode,
          amount: order.transbank.amount,
          isSimulation: true,
          email: emailResult
        },
        message: 'Pago simulado confirmado exitosamente'
      });
    }

    // ==========================================
    // CONFIRMAR TRANSACCIÓN REAL CON TRANSBANK
    // ==========================================
    try {
      console.log('💳 [CONFIRM] Confirmando con Transbank...');
      const transbankResponse = await transaction.commit(tokenToUse);
      
      console.log('📄 [CONFIRM] Respuesta de Transbank:', {
        status: transbankResponse.status,
        responseCode: transbankResponse.response_code,
        amount: transbankResponse.amount,
        authCode: transbankResponse.authorization_code,
        vci: transbankResponse.vci
      });

      // ==========================================
      // VALIDACIÓN CRÍTICA: response_code === 0 Y status === 'AUTHORIZED'
      // ==========================================
      const isApproved = transbankResponse.response_code === 0 && 
                         transbankResponse.status === 'AUTHORIZED';

      // Actualizar orden con TODOS los datos de Transbank
      order.transbank = {
        ...order.transbank,
        transactionDate: new Date(transbankResponse.transaction_date),
        authorizationCode: transbankResponse.authorization_code,
        paymentTypeCode: transbankResponse.payment_type_code,
        responseCode: transbankResponse.response_code,
        status: transbankResponse.status,
        amount: transbankResponse.amount,
        installmentsNumber: transbankResponse.installments_number || 0,
        cardNumber: transbankResponse.card_detail?.card_number || '',
        vci: transbankResponse.vci,
        accountingDate: transbankResponse.accounting_date,
        balance: transbankResponse.balance || 0
      };

      if (isApproved) {
        order.status = 'completed';
        
        console.log('💳 [CONFIRM] Pago APROBADO, descontando stock...');
        
        // Descontar stock de los productos
        for (const item of order.products) {
          const result = await Product.updateOne(
            { _id: item.product._id },
            { $inc: { stock: -item.quantity } }
          );
          console.log(`   ✅ Stock descontado para ${item.name}: -${item.quantity}`);
        }

        // Enviar email de confirmación
        const orderItemsForEmail = order.products.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }));
        const emailResult = await sendOrderConfirmationEmail(order, order.user, orderItemsForEmail);
        order.emailResult = emailResult;
        
        console.log('✅ [CONFIRM] Pago confirmado y procesado exitosamente');
        
      } else {
        order.status = 'failed';
        console.log(`❌ [CONFIRM] Pago RECHAZADO. Status: ${transbankResponse.status}, Code: ${transbankResponse.response_code}`);
      }

      await order.save();

      // Respuesta al cliente
      return res.status(200).json({
        success: isApproved,
        data: {
          orderId: order._id,
          authorizationCode: transbankResponse.authorization_code,
          amount: transbankResponse.amount,
          responseCode: transbankResponse.response_code,
          status: transbankResponse.status,
          paymentType: transbankResponse.payment_type_code,
          installments: transbankResponse.installments_number,
          cardNumber: transbankResponse.card_detail?.card_number,
          transactionDate: transbankResponse.transaction_date,
          email: isApproved ? order.emailResult : null
        },
        message: isApproved ? 'Pago confirmado exitosamente' : 'Pago rechazado'
      });

    } catch (transbankError) {
      console.error('❌ [CONFIRM] Error confirmando con Transbank:', transbankError.message);
      console.error('🔍 [CONFIRM] Stack:', transbankError.stack);
      
      // Marcar orden como fallida
      order.status = 'failed';
      order.transbank.responseCode = -99; // Código de error interno
      await order.save();

      return res.status(500).json({
        success: false,
        message: 'Error al confirmar pago con Transbank',
        error: process.env.NODE_ENV === 'development' ? transbankError.message : 'Error interno'
      });
    }

  } catch (error) {
    console.error('❌ [CONFIRM] Error general en confirmPayment:', error);
    console.error('🔍 [CONFIRM] Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

/**
 * @desc    Obtener estado de una transacción desde Transbank
 * @route   GET /api/payments/transaction/status/:token
 * @access  Private (Admin)
 */
const getTransactionStatus = async (req, res) => {
  try {
    const { token } = req.params;
    
    console.log(`🔍 [STATUS] Consultando estado de transacción con token: ${token.substring(0, 20)}...`);

    // Buscar orden en BD
    const order = await Order.findOne({ 'transbank.token': token })
      .populate('products.product', 'name imageURL')
      .populate('user', 'username email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada para el token proporcionado'
      });
    }

    // Si es simulación, devolver estado de BD
    if (token.startsWith('simulated_token_')) {
      console.log('🧪 [STATUS] Token de simulación detectado');
      return res.status(200).json({
        success: true,
        source: 'database',
        data: {
          orderId: order._id,
          status: order.status,
          transbank: order.transbank,
          isSimulation: true
        },
        message: 'Estado obtenido desde base de datos (simulación)'
      });
    }

    // Consultar estado real en Transbank
    try {
      console.log('📡 [STATUS] Consultando Transbank...');
      const transbankStatus = await transaction.status(token);
      
      console.log('✅ [STATUS] Estado recibido:', {
        status: transbankStatus.status,
        responseCode: transbankStatus.response_code,
        amount: transbankStatus.amount
      });

      // Actualizar orden con información actualizada (si hay discrepancia)
      const needsUpdate = order.transbank.status !== transbankStatus.status ||
                          order.transbank.responseCode !== transbankStatus.response_code;

      if (needsUpdate) {
        console.log('⚠️ [STATUS] Discrepancia detectada, actualizando BD...');
        
        order.transbank.status = transbankStatus.status;
        order.transbank.responseCode = transbankStatus.response_code;
        order.transbank.authorizationCode = transbankStatus.authorization_code;
        order.transbank.amount = transbankStatus.amount;
        order.transbank.vci = transbankStatus.vci;
        order.transbank.accountingDate = transbankStatus.accounting_date;
        order.transbank.transactionDate = new Date(transbankStatus.transaction_date);
        order.transbank.paymentTypeCode = transbankStatus.payment_type_code;
        order.transbank.installmentsNumber = transbankStatus.installments_number || 0;
        order.transbank.balance = transbankStatus.balance || 0;
        
        if (transbankStatus.card_detail) {
          order.transbank.cardNumber = transbankStatus.card_detail.card_number;
        }

        // Actualizar estado de orden si es necesario
        if (transbankStatus.status === 'AUTHORIZED' && transbankStatus.response_code === 0) {
          if (order.status === 'pending') {
            order.status = 'completed';
            console.log('✅ [STATUS] Orden actualizada a completed');
          }
        }

        await order.save();
      }

      res.status(200).json({
        success: true,
        source: 'transbank',
        data: {
          orderId: order._id,
          orderStatus: order.status,
          transbank: {
            status: transbankStatus.status,
            responseCode: transbankStatus.response_code,
            amount: transbankStatus.amount,
            authorizationCode: transbankStatus.authorization_code,
            transactionDate: transbankStatus.transaction_date,
            paymentType: transbankStatus.payment_type_code,
            installments: transbankStatus.installments_number,
            cardNumber: transbankStatus.card_detail?.card_number,
            vci: transbankStatus.vci,
            accountingDate: transbankStatus.accounting_date,
            balance: transbankStatus.balance
          },
          updatedInDatabase: needsUpdate
        },
        message: 'Estado obtenido desde Transbank'
      });

    } catch (transbankError) {
      console.error('❌ [STATUS] Error consultando Transbank:', transbankError.message);
      
      // Si falla consulta a Transbank, devolver estado de BD
      return res.status(200).json({
        success: true,
        source: 'database_fallback',
        data: {
          orderId: order._id,
          status: order.status,
          transbank: order.transbank
        },
        message: 'Estado obtenido desde base de datos (Transbank no disponible)',
        warning: process.env.NODE_ENV === 'development' ? transbankError.message : 'Servicio temporal no disponible'
      });
    }

  } catch (error) {
    console.error('❌ [STATUS] Error general:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

/**
 * @desc    Reversar o anular una transacción
 * @route   POST /api/payments/refund
 * @access  Private (Admin)
 */
const refundTransaction = async (req, res) => {
  try {
    const { orderId, amount, reason } = req.body;

    console.log(`💰 [REFUND] Solicitando reembolso para orden: ${orderId}`);
    console.log(`   Monto: $${amount?.toLocaleString('es-CL') || 'TOTAL'}`);
    console.log(`   Razón: ${reason || 'No especificada'}`);

    // Validar que usuario sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado. Solo administradores pueden realizar reembolsos'
      });
    }

    // Buscar orden
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    // Validar que la orden esté completada
    if (order.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: `No se puede reembolsar una orden con estado: ${order.status}`
      });
    }

    // Validar que no esté ya reembolsada
    if (order.transbank.refunded) {
      return res.status(400).json({
        success: false,
        message: 'Esta orden ya fue reembolsada anteriormente',
        data: {
          refundDate: order.transbank.refundDate,
          refundAmount: order.transbank.refundAmount,
          refundType: order.transbank.refundType
        }
      });
    }

    // Validar que tenga token de Transbank
    if (!order.transbank.token) {
      return res.status(400).json({
        success: false,
        message: 'Orden no tiene token de Transbank válido'
      });
    }

    const token = order.transbank.token;
    const refundAmount = amount || order.transbank.amount || order.totalAmount;

    // Validar monto
    if (refundAmount <= 0 || refundAmount > order.totalAmount) {
      return res.status(400).json({
        success: false,
        message: `Monto inválido. Debe ser entre $1 y $${order.totalAmount.toLocaleString('es-CL')}`
      });
    }

    // Si es simulación, simular reembolso
    if (token.startsWith('simulated_token_')) {
      console.log('🧪 [REFUND] Simulando reembolso...');
      
      order.transbank.refunded = true;
      order.transbank.refundDate = new Date();
      order.transbank.refundAmount = refundAmount;
      order.transbank.refundType = 'SIMULADA';
      order.status = 'cancelled';
      
      await order.save();

      // Devolver stock
      for (const item of order.products) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } }
        );
        console.log(`   ✅ Stock devuelto para producto: +${item.quantity}`);
      }

      return res.status(200).json({
        success: true,
        data: {
          orderId: order._id,
          refundAmount: refundAmount,
          refundType: 'SIMULADA',
          authorizationCode: `REF${Date.now()}`,
          isSimulation: true
        },
        message: 'Reembolso simulado procesado exitosamente'
      });
    }

    // Realizar reversa/anulación real con Transbank
    try {
      console.log('📡 [REFUND] Contactando Transbank...');
      const refundResponse = await transaction.refund(token, refundAmount);
      
      console.log('✅ [REFUND] Respuesta de Transbank:', {
        type: refundResponse.type,
        authCode: refundResponse.authorization_code,
        responseCode: refundResponse.response_code,
        nullifiedAmount: refundResponse.nullified_amount
      });

      // Actualizar orden
      order.transbank.refunded = true;
      order.transbank.refundDate = new Date(refundResponse.authorization_date);
      order.transbank.refundAmount = refundResponse.nullified_amount || refundAmount;
      order.transbank.refundType = refundResponse.type; // 'REVERSA' o 'ANULACION'
      order.status = 'cancelled';
      
      await order.save();

      // Devolver stock a inventario
      for (const item of order.products) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } }
        );
        console.log(`   ✅ Stock devuelto para producto: +${item.quantity}`);
      }

      res.status(200).json({
        success: true,
        data: {
          orderId: order._id,
          refundType: refundResponse.type,
          refundAmount: refundResponse.nullified_amount,
          authorizationCode: refundResponse.authorization_code,
          authorizationDate: refundResponse.authorization_date,
          responseCode: refundResponse.response_code,
          balance: refundResponse.balance
        },
        message: `${refundResponse.type === 'REVERSA' ? 'Reversa' : 'Anulación'} procesada exitosamente`
      });

    } catch (transbankError) {
      console.error('❌ [REFUND] Error en Transbank:', transbankError.message);
      
      return res.status(500).json({
        success: false,
        message: 'Error al procesar reembolso con Transbank',
        error: process.env.NODE_ENV === 'development' ? transbankError.message : 'Error en procesamiento'
      });
    }

  } catch (error) {
    console.error('❌ [REFUND] Error general:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

/**
 * @desc    Obtener estado de una orden
 * @route   GET /api/payments/order/:id
 * @access  Private
 */
const getOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('products.product', 'name imageURL')
      .populate('user', 'username email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    // Verificar que el usuario sea el propietario de la orden o admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para ver esta orden'
      });
    }

    res.status(200).json({
      success: true,
      data: order,
      message: 'Orden obtenida exitosamente'
    });

  } catch (error) {
    console.error('❌ Error obteniendo estado de orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

/**
 * @desc    Obtener todas las órdenes del usuario autenticado
 * @route   GET /api/payments/orders
 * @access  Private
 */
const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product', 'name imageURL')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        orders,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      },
      message: 'Órdenes obtenidas exitosamente'
    });

  } catch (error) {
    console.error('❌ Error obteniendo órdenes del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

/**
 * Función helper para enviar email de confirmación de pago
 */
const sendOrderConfirmationEmail = async (order, userEmail, orderItems) => {
  try {
    // Obtener información del usuario
    const user = await User.findById(order.user);
    
    if (!user) {
      console.log('⚠️ Usuario no encontrado para envío de email');
      return;
    }

    const emailData = {
      customerName: user.username,
      orderNumber: order.transbank.buyOrder || order._id,
      orderDate: new Date(order.createdAt).toLocaleDateString('es-CL'),
      paymentStatus: 'Aprobado',
      transactionId: order.transbank.authorizationCode || order.transbank.buyOrder,
      products: orderItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price.toLocaleString('es-CL'),
        subtotal: (item.price * item.quantity).toLocaleString('es-CL')
      })),
      total: order.totalAmount.toLocaleString('es-CL'),
      shippingInfo: {
        name: order.shippingInfo.name,
        email: order.shippingInfo.email,
        phone: order.shippingInfo.phone,
        address: order.shippingInfo.address,
        city: order.shippingInfo.city,
        region: order.shippingInfo.region
      }
    };

    // Enviar email de confirmación con manejo robusto de errores
    console.log('📧 [PAYMENT] Preparando envío de email...');
    const result = await EmailService.sendOrderConfirmation(user.email, emailData);
    
    let emailResult = { success: false };
    
    if (result && result.success) {
      console.log(`✅ [PAYMENT] Email confirmación enviado exitosamente a: ${user.email}`);
      console.log(`📨 [PAYMENT] Message ID: ${result.messageId}`);
      
      emailResult = {
        success: true,
        messageId: result.messageId,
        previewURL: result.previewURL || null
      };
      
      // Si hay URL de preview (Ethereal), mostrarla
      if (result.previewURL) {
        console.log(`👀 [PAYMENT] Ver email en: ${result.previewURL}`);
      }
    } else {
      console.log('⚠️ [PAYMENT] Email no pudo ser enviado, pero el pago fue exitoso');
    }
    
    return emailResult;
    
  } catch (emailError) {
    console.error('❌ [PAYMENT] Error crítico enviando email:', emailError.message);
    console.error('🔍 [PAYMENT] Stack trace:', emailError.stack);
    
    // El pago ya fue exitoso, solo informamos del error del email
    console.log('ℹ️ [PAYMENT] El pago fue procesado correctamente, solo falló el email de confirmación');
    return { success: false, error: emailError.message };
  }
};

/**
 * @desc    Reconciliar transacciones pendientes
 * @route   POST /api/payments/reconcile
 * @access  Private (Admin)
 */
const reconcileTransactions = async (req, res) => {
  try {
    console.log('🔄 [RECONCILE] Iniciando reconciliación de transacciones...');

    // Validar que usuario sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado. Solo administradores pueden reconciliar'
      });
    }

    // Buscar órdenes pendientes con token (creadas hace más de 15 minutos)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    
    const pendingOrders = await Order.find({
      status: 'pending',
      'transbank.token': { $exists: true, $ne: null },
      createdAt: { $lt: fifteenMinutesAgo }
    }).limit(50); // Procesar máximo 50 a la vez

    console.log(`📊 [RECONCILE] Encontradas ${pendingOrders.length} órdenes pendientes`);

    const results = {
      total: pendingOrders.length,
      updated: 0,
      completed: 0,
      failed: 0,
      unchanged: 0,
      details: []
    };

    for (const order of pendingOrders) {
      const token = order.transbank.token;
      const orderId = order._id;

      // Saltar simulaciones
      if (token.startsWith('simulated_token_')) {
        console.log(`⏭️  [RECONCILE] Saltando orden simulada: ${orderId}`);
        results.unchanged++;
        continue;
      }

      try {
        console.log(`🔍 [RECONCILE] Verificando orden ${orderId}...`);
        
        // Consultar estado en Transbank
        const transbankStatus = await transaction.status(token);
        
        const isApproved = transbankStatus.response_code === 0 && 
                           transbankStatus.status === 'AUTHORIZED';

        // Actualizar orden según estado real
        order.transbank.status = transbankStatus.status;
        order.transbank.responseCode = transbankStatus.response_code;
        order.transbank.authorizationCode = transbankStatus.authorization_code;
        order.transbank.amount = transbankStatus.amount;
        order.transbank.transactionDate = new Date(transbankStatus.transaction_date);
        order.transbank.vci = transbankStatus.vci;
        order.transbank.accountingDate = transbankStatus.accounting_date;
        order.transbank.paymentTypeCode = transbankStatus.payment_type_code;
        order.transbank.installmentsNumber = transbankStatus.installments_number || 0;

        if (transbankStatus.card_detail) {
          order.transbank.cardNumber = transbankStatus.card_detail.card_number;
        }

        if (isApproved) {
          order.status = 'completed';
          
          // Descontar stock
          for (const item of order.products) {
            await Product.updateOne(
              { _id: item.product },
              { $inc: { stock: -item.quantity } }
            );
          }
          
          results.completed++;
          console.log(`✅ [RECONCILE] Orden ${orderId} marcada como completada`);
          
        } else {
          order.status = 'failed';
          results.failed++;
          console.log(`❌ [RECONCILE] Orden ${orderId} marcada como fallida`);
        }

        await order.save();
        results.updated++;
        
        results.details.push({
          orderId: orderId,
          previousStatus: 'pending',
          newStatus: order.status,
          transbankStatus: transbankStatus.status,
          responseCode: transbankStatus.response_code
        });

      } catch (statusError) {
        console.error(`❌ [RECONCILE] Error verificando orden ${orderId}:`, statusError.message);
        
        // Si el error es que la transacción no existe, marcar como fallida
        if (statusError.message.includes('404') || statusError.message.includes('not found')) {
          order.status = 'failed';
          order.transbank.responseCode = -404;
          await order.save();
          results.failed++;
          results.updated++;
          
          results.details.push({
            orderId: orderId,
            previousStatus: 'pending',
            newStatus: 'failed',
            error: 'Transaction not found in Transbank'
          });
        } else {
          results.unchanged++;
        }
      }
    }

    console.log(`✅ [RECONCILE] Reconciliación completada:`, results);

    res.status(200).json({
      success: true,
      message: 'Reconciliación completada',
      data: results
    });

  } catch (error) {
    console.error('❌ [RECONCILE] Error general:', error);
    res.status(500).json({
      success: false,
      message: 'Error en reconciliación',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

module.exports = {
  initPayment,
  confirmPayment,
  getOrderStatus,
  getUserOrders,
  getTransactionStatus,
  refundTransaction,
  reconcileTransactions
};
