const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const wooCommerceAPI = require('../config/wooCommerce');

// Create a payment intent for Stripe
async function createPaymentIntent(req, res) {
    try {
        const { orderNumber, amount, billingCountry = 'US' } = req.body;
        
        if (!orderNumber || !amount) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Validate country (ISO 3166-1 alpha-2)
        const validCountries = ['US']; // Add other supported countries
        if (!validCountries.includes(billingCountry)) {
            return res.status(400).json({ error: 'Unsupported billing country' });
        }

        // Create a payment intent with billing details
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount),
            currency: 'usd',
            metadata: {
                orderNumber: orderNumber,
                billingCountry: billingCountry // Store for webhook verification
            },
            payment_method_options: {
                card: {
                    request_three_d_secure: 'any' // For SCA compliance
                }
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            billingCountry // Return for frontend validation
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
}

// Enhanced webhook handler with country validation
async function handleStripeWebhook(req, res) {
    const signature = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error('Webhook signature verification failed:', error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    // Handle payment_intent events
    if (event.type.startsWith('payment_intent.')) {
        const paymentIntent = event.data.object;
        const orderNumber = paymentIntent.metadata.orderNumber;
        const billingCountry = paymentIntent.metadata.billingCountry || 'US';

        try {
            // Verify order exists
            const response = await wooCommerceAPI.get(`/orders`, {
                number: orderNumber
            });
            
            if (!response.data || response.data.length === 0) {
                console.error(`Order ${orderNumber} not found`);
                return res.status(404).json({ error: 'Order not found' });
            }

            const order = response.data[0];
            const updateData = {
                meta_data: [
                    {
                        key: '_stripe_payment_intent_id',
                        value: paymentIntent.id
                    },
                    {
                        key: '_stripe_billing_country',
                        value: billingCountry
                    }
                ]
            };

            // Set status based on event type
            switch (event.type) {
                case 'payment_intent.succeeded':
                    updateData.status = 'processing';
                    updateData.meta_data.push({
                        key: '_stripe_payment_status',
                        value: 'succeeded'
                    });
                    break;
                    
                case 'payment_intent.payment_failed':
                    updateData.status = 'failed';
                    updateData.meta_data.push({
                        key: '_stripe_payment_status',
                        value: 'failed'
                    });
                    break;
                    
                case 'payment_intent.canceled':
                    updateData.status = 'cancelled';
                    updateData.meta_data.push({
                        key: '_stripe_payment_status',
                        value: 'canceled'
                    });
                    break;
                    
                case 'payment_intent.processing':
                    updateData.status = 'on-hold';
                    updateData.meta_data.push({
                        key: '_stripe_payment_status',
                        value: 'processing'
                    });
                    break;
            }

            await wooCommerceAPI.put(`/orders/${order.id}`, updateData);
            console.log(`Order ${orderNumber} updated for ${event.type}`);

        } catch (error) {
            console.error(`Error processing ${event.type}:`, error);
            return res.status(500).json({ error: 'Order update failed' });
        }
    }

    res.json({ received: true });
}

// Enhanced direct payment with country support
async function makePayment(req, res) {
    try {
        const { orderNumber, amount, paymentMethodId, billingCountry = 'US' } = req.body;

        // Validate inputs
        if (!orderNumber || !amount || !paymentMethodId) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Create charge with billing details
        const charge = await stripe.charges.create({
            amount: Math.round(amount),
            currency: 'usd',
            source: paymentMethodId,
            description: `Order ${orderNumber}`,
            metadata: {
                orderNumber: orderNumber,
                billingCountry: billingCountry
            },
            billing_details: {
                address: {
                    country: billingCountry
                }
            }
        });

        // Update WooCommerce order
        const response = await wooCommerceAPI.get(`/orders`, {
            number: orderNumber
        });
        
        if (!response.data || response.data.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = response.data[0];
        await wooCommerceAPI.put(`/orders/${order.id}`, {
            status: 'processing',
            meta_data: [
                {
                    key: '_stripe_charge_id',
                    value: charge.id
                },
                {
                    key: '_stripe_billing_country',
                    value: billingCountry
                },
                {
                    key: '_stripe_payment_status',
                    value: 'succeeded'
                }
            ]
        });

        res.json({
            success: true,
            charge: charge
        });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: error.message || 'Failed to process payment' });
    }
}

module.exports = {
    createPaymentIntent,
    handleStripeWebhook,
    makePayment
};