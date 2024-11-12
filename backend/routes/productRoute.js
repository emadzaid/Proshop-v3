const express = require('express');
const router = express.Router();
const {protect, admin} = require('../middleware/authMiddleware');
const {getAllProducts, getSingleProduct, createProduct, editProduct, deleteProduct} = require('../controllers/productController');

        
router.get('/', getAllProducts);
router.post('/', protect, admin, createProduct),
router.put('/:id', protect, admin, editProduct),
router.get('/:id', getSingleProduct);
router.delete('/:id', deleteProduct);

module.exports = router;