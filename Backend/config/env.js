const dotenv = require('dotenv');
const path = require('path');

// Load environment-specific configuration
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });


module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'production',
  DATABASE: {
    WC_BASE_URL: process.env.WC_BASE_URL,
    WC_CONSUMER_KEY: process.env.WC_CONSUMER_KEY,
    WC_CONSUMER_SECRET: process.env.WC_CONSUMER_SECRET,
  },
  JWT: {
    SECRET: process.env.JWT_SECRET,
    EXPIRY: process.env.JWT_EXPIRY || '1h',
  },
  EMAIL: {
    HOST: process.env.MAIL_HOST,
    PORT: process.env.MAIL_PORT,
    USER: process.env.MAIL_USER,
    PASS: process.env.MAIL_PASS,
  },
  FRONTEND_URL: process.env.FRONTEND_URL,
};