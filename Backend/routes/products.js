const express = require('express');
const { getProducts, getProductReviews, addReview, getCustomerReviews, editReview, getProduct, getProductBySlug } = require('../controllers/productsController');
const router = express.Router();

router.get('/', getProducts);

router.get('/:product_id', getProduct);

router.get('/:slug', getProductBySlug);

router.get('/product-reviews/:product_id', getProductReviews);

router.post('/add-review/:product_id', addReview);

router.get('/customer-reviews/:review_id', getCustomerReviews);

router.put('/edit-review/:review_id', editReview);

router.delete('/delete-review/:review_id', editReview);
module.exports = router;
