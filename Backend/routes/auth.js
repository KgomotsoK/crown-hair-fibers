const express = require('express');
const { registerCustomer, loginCustomer, forgotPasswordRequest, updateCustomerDetails, resetPassword } = require('../controllers/authController');
const router = express.Router();

// Register New Customer
router.post('/register', registerCustomer);

// Login Existing Customer
router.post('/login', loginCustomer);

router.post('/forgot-password', forgotPasswordRequest);

router.post('/reset', resetPassword);

router.put('/edit-customer/:customerId', updateCustomerDetails);

module.exports = router;
