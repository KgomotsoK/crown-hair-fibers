const express = require('express');
const { createOrder, getCustomerOrders } = require('../controllers/ordersController');
const router = express.Router();

router.post('/', createOrder);
router.get('/getUserOrders/:customerId', getCustomerOrders);

module.exports = router;
