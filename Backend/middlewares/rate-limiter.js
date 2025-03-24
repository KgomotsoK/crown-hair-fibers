const rateLimit = require('express-rate-limit');

const createLimiter = (windowMs = 15 * 60 * 1000, max = 100) => 
  rateLimit({
    windowMs,
    max,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  module.exports = createLimiter;