// Backend/server.js
const express = require('express');
require('dotenv').config({ path: '../.env' });
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
//const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { error } = require('console');
const errorHandler = require('./middlewares/error-handler');
const { handleStripeWebhook } = require('./controllers/paymentsController');

const app = express();
// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://js.stripe.com', 'https://www.google.com', 'https://www.gstatic.com', "https://fonts.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://cuvvahairfibers.com"],
      mediaSrc: ["'self'", "https://cuvvahairfibers.com"],
      connectSrc: ["'self'", 'https://api.stripe.com', 'https://www.google.com'],
      frameSrc: ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com', 'https://www.google.com'],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'https://www.crowntwentyone.com',
    'http://localhost:8000',
    'https://crown-hair-fibers-0f1c08080a59.herokuapp.com',
    'http://localhost:3000',
  ],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Compression
app.use(compression());

// Logging
//app.use(morgan('dev'));
app.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);
// Regular body parsing for other routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/orders', require('./routes/orders'));
app.use('/contact', require('./routes/contact'));
app.use('/payments', require('./routes/payments'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Error handling
app.use(errorHandler);

module.exports = app;
/*const port = process.env.PORT || 8000;
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});*/ 
