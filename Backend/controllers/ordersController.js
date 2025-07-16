const wooCommerceAPI = require('../config/wooCommerce');

async function createOrder(req, res) {
    try {
        const orderData = req.body;
        const orderResponse = await wooCommerceAPI.post('/orders', orderData);
        res.json({
            message: 'Order created successfully.',
            orderId: orderResponse.data.id,
            orderNumber: orderResponse.data.number,
            orderTotal: orderResponse.data.total
        });
    } catch (error) {
        console.error('Error creating order:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

async function getOrderById(req, res) {
    try {
        const { orderId } = req.params;
        const response = await wooCommerceAPI.get(`/orders/${orderId}`);
        
        if (response.data.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching order:', error.message);
        res.status(500).send('Internal Server Error');
    }
}
// Get Order
async function getOrderByNumber(req, res) {
    try {
        const { orderNumber } = req.params;
        const response = await wooCommerceAPI.get(`/orders`);
        
        if (response.data.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const customerOrder = response.data.filter(order => order.number === orderNumber)[0];
        res.json(customerOrder);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
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

async function getOrders(req, res) {
    console.log("Fetching all orders");
    try {
        const response = await wooCommerceAPI.get(`/orders`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

// Update order status in WooCommerce
async function updateOrderStatus(req, res) {
    try {
        const updateData = req.body;
        
        if (!updateData.orderNumber || !updateData.status) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const response = await wooCommerceAPI.get(`/orders`);
        
        if (response.data.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const Order = response.data.filter(order => order.number === updateData.orderNumber)[0];
        
        // Update order status
        const updateResponse = await wooCommerceAPI.put(`/orders/${Order.id}`, {
            status: updateData.status
        });

        res.json({
            success: true,
            order: updateResponse.data
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
}

module.exports = { createOrder, getOrderById, getCustomerOrders, getOrderByNumber, getOrders, updateOrderStatus };