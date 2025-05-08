const wooCommerceAPI = require('../config/wooCommerce');
const bcrypt = require('bcrypt');
const axios = require('axios');
const cache = require('../utils/cache');
const nodemailer = require('nodemailer'); // For email functionality
const crypto = require('crypto');
const { console } = require('inspector');
require('dotenv').config();

let resetTokens = {}; // Temporary in-memory store for password reset tokens

// Register New Customer
async function registerCustomer(req, res) {
    const { username, first_name, last_name, email, password } = req.body;
    
    if (!email || !password || !first_name || !last_name || !username) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const response = await wooCommerceAPI.post('/customers', {
            username,
            first_name,
            last_name,
            email,
            password
        });

        res.status(201).json({ 
            message: 'Customer registered successfully', 
            data: response.data 
        });
    } catch (error) {
        console.error('Error registering customer:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Internal Server Error',
            details: error.response?.data || error.message
        });
    }
}

// Login Existing Customer
async function loginCustomer(req, res) {
    console.log('Login request received');
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    
    try {
        // Authenticate the user via WordPress REST API
        const authResponse = await axios.post(
            `${process.env.WC_BASE_URL}/wp-json/jwt-auth/v1/token`, 
            {
                username: email,
                password,
            }
        );
        
        if (!authResponse.data || !authResponse.data.token) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        // Get customer data from WooCommerce
        const customerResponse = await wooCommerceAPI.get(`/customers?email=${email}`);
        if (!customerResponse.data || customerResponse.data.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Cache the response
        cache.set('customer', customerResponse.data[0]);

        // Send response to client
        res.json({
            user: customerResponse.data[0],
            token: authResponse.data.token
        });

    } catch (error) {
        console.error('Error logging in customer:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Internal Server Error',
            details: error.response?.data || error.message
        });
    }
}

// Forgot Password Request
async function forgotPasswordRequest(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send('Email is required.');
    }

    try {
        // Check if customer exists
        const response = await wooCommerceAPI.get(`/customers?email=${email}`);
        const customer = response.data[0];

        if (!customer) {
            return res.status(404).send('Customer not found.');
        }

        // Generate a secure token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

        // Save the token and expiry to the customer metadata
        await wooCommerceAPI.put(`/customers/${customer.id}`, {
            meta_data: [
                {
                    key: 'reset_token',
                    value: resetToken,
                },
                {
                    key: 'reset_token_expiry',
                    value: resetTokenExpiry,
                },
            ],
        });

        // Generate reset password link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;

        // Send email with reset link (using Nodemailer)
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST, // Use your mail server host
            port: process.env.MAIL_PORT, // Usually 587 for TLS or 465 for SSL
            secure: process.env.MAIL_SECURE === 'true', // true for SSL, false for TLS
            auth: {
                user: process.env.MAIL_USER, // Email username
                pass: process.env.MAIL_PASS, // Email password
            },
        });

        // Send the email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <p>Hello ${customer.first_name},</p>
                <p>You requested to reset your password. Click the link <a href="${resetLink}">Here</a> to reset it</p>
                <br/>
                <p>If you did not request this, please ignore this email.</p>
            `,
        });

        res.json({ message: 'Password reset email sent.' });
    } catch (error) {
        console.error('Error requesting password reset:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

// Reset Password
async function resetPassword(req, res) {
    const { token, newPassword, email } = req.body;
    ;
    if (!token || !newPassword) {
        return res.status(400).send('Token and new password are required.');
    }
    
    try {
        // Find customer by token
        const response = await wooCommerceAPI.get(`/customers?email=${email}`);
        
        const customer = response.data[0];
        
        const resetTokenMeta = customer.meta_data.find(meta => meta.key === 'reset_token_expiry');
        const tokenExpiryTimestamp = parseInt(resetTokenMeta.value);
        const isExpired = Date.now() > tokenExpiryTimestamp;

        if (isExpired) {
            return res.status(400).send('Invalid or expired token.');
        }

        // Update customer's password
        await wooCommerceAPI.put(`/customers/${customer.id}`, {
            password: newPassword,
            meta_data: [
                { key: 'reset_token', value: '' }, // Clear token
                { key: 'reset_token_expiry', value: '' }, // Clear expiry
            ],
        });
        console.log('Password reset successful.');
        res.json({ message: 'Password reset successful.' });
    } catch (error) {
        console.error('Error resetting password:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

// Update Customer Details
async function updateCustomerDetails(req, res) {
    const { customerId } = req.params; // Customer ID from the URL
    const updateData = req.body; // Fields to update (e.g., email, first_name, last_name, etc.)

    if (!customerId) {
        return res.status(400).send('Customer ID is required.');
    }

    try {
        // Update customer data in WooCommerce
        const response = await wooCommerceAPI.put(`/customers/${customerId}`, updateData);

        // Respond with updated customer data
        res.json({
            message: 'Customer details updated successfully.',
            data: response.data,
        });
    } catch (error) {
        console.error('Error updating customer details:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { 
    registerCustomer, 
    loginCustomer, 
    forgotPasswordRequest, 
    resetPassword, 
    updateCustomerDetails 
};
