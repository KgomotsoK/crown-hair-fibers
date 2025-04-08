const express = require('express');
const router = express.Router();
const { 
  createPaymentIntent, 
  handleStripeWebhook, 
  getOrderByNumber, 
  makePayment 
} = require('../controllers/paymentsController');

// Create payment intent
router.post('/create-payment-intent', createPaymentIntent);

// Make direct payment
router.post('/make-payment', makePayment);

// Stripe webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = router; 