const wooCommerceAPI = require('../config/wooCommerce');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

// Configure the email transporter
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST, // Use your mail server host
    port: process.env.MAIL_PORT, // Usually 587 for TLS or 465 for SSL
    secure: process.env.MAIL_SECURE === 'true', // true for SSL, false for TLS
    auth: {
        user: process.env.MAIL_USER, // Email username
        pass: process.env.MAIL_PASS, // Email password
    },
});

// Function to send review reminder emails
async function sendReviewReminders() {
    try {
        const ordersResponse = await wooCommerceAPI.get('/orders', {
            params: { status: 'completed', per_page: 100 },
        });

        const today = new Date();

        for (const order of ordersResponse.data) {
            const orderDate = new Date(order.date_created);
            const daysSinceOrder = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));

            // If 10 days have passed and no review is found, send email
            if (daysSinceOrder === 10 || daysSinceOrder === 13) {
                for (const item of order.line_items) {
                    const productReviews = await wooCommerceAPI.get(`/products/reviews?product_id=${item.product_id}&reviewer_email=${order.billing.email}`);
                    if (productReviews.data.length === 0) {
                        // Send review reminder email
                        await transporter.sendMail({
                            from: process.env.EMAIL_USER,
                            to: order.billing.email,
                            subject: `Review your recent purchase: ${item.name}`,
                            html: `
                                <p>Hi ${order.billing.first_name},</p>
                                <p>We hope you're enjoying your recent purchase of <strong>${item.name}</strong>.</p>
                                <p>We'd love to hear your feedback! Click below to leave a review:</p>
                                <a href="${process.env.FRONTEND_URL}/products/${item.product_id}/review">Leave a Review</a>
                            `,
                        });
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error sending review reminders:', error.message);
    }
}

// Schedule the task to run daily at midnight
cron.schedule('0 0 * * *', sendReviewReminders);
