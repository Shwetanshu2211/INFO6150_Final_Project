const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { auth, isAdmin } = require('../middleware/auth');

// Protected routes
router.post('/', auth, createOrder);
router.get('/my-orders', auth, getUserOrders);
router.get('/:id', auth, getOrder);
router.put('/:id/status', auth, isAdmin, updateOrderStatus);
router.post('/:id/cancel', auth, cancelOrder);

module.exports = router; 