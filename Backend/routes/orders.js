const express = require('express');
const { createOrder, getOrderById, getOrderByNumber, getCustomerOrders, getOrders, updateOrderStatus } = require('../controllers/ordersController');
const router = express.Router();

router.post('/', createOrder);
router.get('/getOrder/:orderId', getOrderById);
router.get('/:orderNumber', getOrderByNumber);
router.get('/getUserOrders/:customerId', getCustomerOrders);
router.get('/',getOrders);
router.post('/updateOrderStatus', updateOrderStatus);

module.exports = router;
