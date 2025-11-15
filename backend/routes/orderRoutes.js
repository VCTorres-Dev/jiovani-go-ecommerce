const express = require('express');
const router = express.Router();
const { 
  addOrderItems, 
  updateOrderStatus, 
  getAllOrders, 
  getMyOrders 
} = require('../controllers/orderController');
const { auth } = require('../middleware/authMiddleware');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
router.post('/', auth, addOrderItems);

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', auth, getMyOrders);

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin
// @access  Private (Admin)
router.get('/admin', auth, getAllOrders);

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
router.put('/:id/status', auth, updateOrderStatus);

module.exports = router;
