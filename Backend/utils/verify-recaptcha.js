const axios = require('axios');

async function verify_recaptcha(req, res) {
  try {
    const { token } = await req.json();
    
    if (!token) {
      return res.json(
        { success: false, message: 'reCAPTCHA token is required' },
        { status: 400 }
      );
    }

    // Verify the token with Google's reCAPTCHA API
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    const { success, score } = response.data;

    return res.json({
      success,
      score,
      message: success ? 'reCAPTCHA verification successful' : 'reCAPTCHA verification failed',
    });
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return res.json(
      { success: false, message: 'Error verifying reCAPTCHA' },
      { status: 500 }
    );
  }
} 

module.exports = {verify_recaptcha};