const axios = require('axios');

// Fetch Trustpilot reviews for a product
async function getTrustpilotReviews(productId) {
    try {
        const response = await axios.get(`https://api.trustpilot.com/v1/product-reviews`, {
            headers: { Authorization: `Bearer ${process.env.TRUSTPILOT_API_KEY}` },
            params: { productId },
        });

        return response.data.reviews;
    } catch (error) {
        console.error('Error fetching Trustpilot reviews:', error.message);
        return [];
    }
}

module.exports = { getTrustpilotReviews };
