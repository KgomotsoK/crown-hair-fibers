const wooCommerceAPI = require('../config/wooCommerce');
const cache = require('../utils/cache');
const nodemailer = require('nodemailer');

async function getProducts(req, res) {
    const cachedData = cache.get('products');
    if (cachedData) {
        return res.json(cachedData);
    }

    try {
        const response = await wooCommerceAPI.get('/products');
        cache.set('products', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

async function getProduct(req, res) {
    const { product_id } = req.params;
    const cacheKey = `product_${product_id}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return res.json(cachedData);
    }

    try {
        const response = await wooCommerceAPI.get(`/products/${product_id}`);
        cache.set(cacheKey, response.data);
        res.json(response.data);
    } catch (error) {
        console.error(`Error fetching product with ID ${product_id}:`, error.message);
        res.status(500).send('Internal Server Error');
    }
}


// Fetch Product Reviews
async function getProductReviews(req, res) {
    const { product_id } = req.params;
    try {
        const response = await wooCommerceAPI.get(`products/reviews`);
        const product_reviews = response.data.filter(product_review => product_review.product_id === product_id);
        res.json(product_reviews);
    } catch (error) {
        console.error('Error fetching product reviews:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

// Add a review for a product
async function addReview(req, res) {
    const { productId, review, rating, reviewer, reviewer_email } = req.body;

    if (!productId || !review || !rating || !reviewer || !reviewer_email) {
        return res.status(400).send('All fields are required.');
    }

    try {
        const response = await wooCommerceAPI.post('/products/reviews', {
            product_id: productId,
            review,
            reviewer: reviewer,
            reviewer_email: reviewer_email, // Assuming the customer's email is stored in `req.user`
            rating,
        });

        res.json({ message: 'Review added successfully', review: response.data });
    } catch (error) {
        console.error('Error adding review:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

// Fetch reviews made by the logged-in customer
async function getCustomerReviews(req, res) {
    const { email } = req.user; // Assuming customer is authenticated and their email is available in req.user

    try {
        const response = await wooCommerceAPI.get(`/products/reviews?reviewer_email=${email}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching customer reviews:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

async function editReview(req, res) {
    const { reviewId, newReview, newRating } = req.body;

    if (!reviewId || !newReview || !newRating) {
        return res.status(400).send('All fields are required.');
    }

    try {
        const response = await wooCommerceAPI.put(`/products/reviews/${reviewId}`, {
            review: newReview,
            rating: newRating,
        });

        res.json({ message: 'Review updated successfully', review: response.data });
    } catch (error) {
        console.error('Error updating review:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

async function deleteReview(req, res) {
    const { reviewId} = req.body;

    if (!reviewId) {
        return res.status(400).send('ID field is required.');
    }

    try {
        const response = await wooCommerceAPI.delete(`/products/reviews/${reviewId}`, {
            force: true
        });

        res.json({ message: 'Review deleted successfully', review: response.data });
    } catch (error) {
        console.error('Error deleting review:', error.message);
        res.status(500).send('Internal Server Error');
    }
}
module.exports = { getProducts, getProduct, getProductReviews, getCustomerReviews, addReview, editReview, deleteReview };
