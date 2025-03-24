const wooCommerceAPI = require('../config/wooCommerce');

async function createOrder(req, res) {
    try {
        const orderData = req.body;
        const orderResponse = await wooCommerceAPI.post('/orders', orderData);
        res.json({
            message: 'Order created successfully.',
            paymentUrl: orderResponse.data.payment_url,
        });
    } catch (error) {
        console.error('Error creating order:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

// Get Customer Orders
async function getCustomerOrders(req, res) {
    const { customerId } = req.params;
    try {
        const response = await wooCommerceAPI.get(`/orders`);
        const userOrders = response.data.filter(order => order.customer_id === parseInt(customerId, 10));
        console.log("we are here")
        res.json(userOrders);
    } catch (error) {
        console.error('Error fetching customer orders:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { createOrder, getCustomerOrders };
