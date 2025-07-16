const axios = require('axios');
require('dotenv').config({ path: '../.env' });


const wooCommerceAPI = axios.create({
    baseURL: `${process.env.WC_BASE_URL}/wp-json/wc/v3`,
    auth: {
        username: process.env.WC_CONSUMER_KEY,
        password: process.env.WC_CONSUMER_SECRET,
    },
});

module.exports = wooCommerceAPI;
