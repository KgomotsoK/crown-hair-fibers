const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendContactMessage(req, res) {
    const { name, email, message } = req.body;

    // Validate input fields
    if (!name || !email || !message) {
        return res.status(400).send('All fields are required.');
    }

    try {
        // Configure transporter
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
            from: `"${name}" <${process.env.MAIL_USER}>`, // Sender's email address
            to: process.env.MAIL_TO, // Recipient email address
            subject: `Crown USA Contact Form Enquiry from ${name}`,
            text: `Message from ${name} (${email}):\n\n${message}`,
        });

        transporter.verify(function (error, success) {
            if (error) {
                console.error('SMTP Connection Error:', error);
            } else {
                return;
            }
        });

        res.status(200).send('Message sent successfully.');
    } catch (error) {
        console.error('Error sending message:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { sendContactMessage };
