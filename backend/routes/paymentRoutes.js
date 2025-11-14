const express = require('express');
const router = express.Router();
const { 
  initPayment, 
  confirmPayment, 
  getOrderStatus, 
  getUserOrders,
  getTransactionStatus,
  refundTransaction,
  reconcileTransactions
} = require('../controllers/paymentController');
const { auth, adminAuth } = require('../middleware/authMiddleware');

// Middleware para logging específico de pagos
router.use((req, res, next) => {
  console.log(`[PAYMENT ROUTES] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

/**
 * @route   POST /api/payments/init
 * @desc    Iniciar proceso de pago con Transbank
 * @access  Private (requiere autenticación)
 */
router.post('/init', auth, initPayment);

/**
 * @route   POST /api/payments/init-test
 * @desc    Iniciar proceso de pago SIN autenticación (SOLO TESTING)
 * @access  Public (para testing sin token)
 */
router.post('/init-test', initPayment);

/**
 * @route   POST /api/payments/confirm
 * @desc    Confirmar pago desde Transbank (webhook)
 * @access  Public (Transbank llama a esta ruta)
 * @note    Esta ruta debe ser accesible públicamente para que Transbank pueda confirmar pagos
 */
router.post('/confirm', confirmPayment);

/**
 * @route   GET /api/payments/result
 * @desc    Recibe el retorno de Transbank y redirige al frontend
 * @access  Public (Transbank redirige el navegador del usuario aquí)
 * @note    Transbank envía los parámetros de retorno y redirigimos al frontend con ellos
 */
router.get('/result', (req, res) => {
  console.log('🔄 [RESULT] Recibiendo retorno de Transbank...');
  console.log('📥 [RESULT] Query params:', req.query);
  
  // Construir URL del frontend
  const frontendUrl = process.env.FRONTEND_URL_REAL || 'http://localhost:3000';
  const params = new URLSearchParams(req.query).toString();
  const redirectUrl = `${frontendUrl}/payment/result?${params}`;
  
  console.log(`🚀 [RESULT] Redirigiendo a: ${redirectUrl}`);
  
  // Redirigir al frontend con los parámetros
  res.redirect(redirectUrl);
});

/**
 * @route   GET /api/payments/order/:id
 * @desc    Obtener estado específico de una orden
 * @access  Private (requiere autenticación)
 */
router.get('/order/:id', auth, getOrderStatus);

/**
 * @route   GET /api/payments/orders
 * @desc    Obtener todas las órdenes del usuario autenticado
 * @access  Private (requiere autenticación)
 */
router.get('/orders', auth, getUserOrders);

/**
 * @route   GET /api/payments/transaction/status/:token
 * @desc    Consultar estado de una transacción en Transbank
 * @access  Private (Admin only)
 * @note    Útil para reconciliación y debugging
 */
router.get('/transaction/status/:token', adminAuth, getTransactionStatus);

/**
 * @route   POST /api/payments/refund
 * @desc    Reversar o anular una transacción (devolución)
 * @access  Private (Admin only)
 * @body    { orderId: string, amount?: number, reason?: string }
 */
router.post('/refund', adminAuth, refundTransaction);

/**
 * @route   POST /api/payments/reconcile
 * @desc    Reconciliar transacciones pendientes con Transbank
 * @access  Private (Admin only)
 * @note    Ejecutar diariamente para detectar pagos exitosos no confirmados
 */
router.post('/reconcile', adminAuth, reconcileTransactions);

/**
 * @route   GET /api/payments/health
 * @desc    Health check para el sistema de pagos
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Sistema de pagos Transbank funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    transbank_env: process.env.TRANSBANK_ENV || 'TEST'
  });
});
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sistema de pagos funcionando correctamente',
    timestamp: new Date().toISOString(),
    transbank: 'Configurado para integración'
  });
});

module.exports = router;
