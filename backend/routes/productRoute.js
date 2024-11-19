const express = require('express');
const router = express.Router();
const {protect, admin} = require('../middleware/authMiddleware');
const {getAllProducts, getSingleProduct, createProduct, editProduct, deleteProduct, createProductReview, getTopProducts} = require('../controllers/productController');

        
router.get('/', getAllProducts);
router.post('/', protect, admin, createProduct),
router.get('/top', getTopProducts),
router.put('/:id', protect, admin, editProduct),
router.get('/:id', getSingleProduct);
router.delete('/:id', deleteProduct);
router.post('/:id/review', protect, createProductReview);


module.exports = router;