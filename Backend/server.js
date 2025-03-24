// Backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const config = require('dotenv');
const errorHandler = require('./middlewares/error-handler');
const logger = require('./utils/logger');

const app = express();
config.config({ path: '../.env' });
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://cuvvahairfibers.com"],
      mediaSrc: ["'self'", "https://cuvvahairfibers.com"],
      connectSrc: ["'self'"],
    },
  },
}));
app.use(compression());
app.use(cors({
  origin: config.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/orders', require('./routes/orders'));
app.use('/contact', require('./routes/contact'));

app.use(errorHandler);

module.exports = app; // Export as module, no listen()