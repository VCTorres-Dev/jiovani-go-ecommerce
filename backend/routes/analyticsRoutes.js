const express = require('express');
const router = express.Router();
const { 
  getAnalyticsSummary,
  getSalesOverTime,
  getTopProducts
} = require('../controllers/analyticsController');
const { auth, adminAuth } = require('../middleware/authMiddleware');

// Todas las rutas de analíticas requieren autenticación de administrador
router.use(auth, adminAuth);

// @desc    Get analytics summary (KPIs)
// @route   GET /api/analytics/summary
router.get('/summary', getAnalyticsSummary);

// @desc    Get sales data for charts
// @route   GET /api/analytics/sales-over-time
router.get('/sales-over-time', getSalesOverTime);

// @desc    Get top 5 selling products
// @route   GET /api/analytics/top-products
router.get('/top-products', getTopProducts);

module.exports = router;
