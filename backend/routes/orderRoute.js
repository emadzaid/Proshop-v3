const express = require('express');
const router = express.Router();
const {protect, admin} = require('../middleware/authMiddleware');

const {
    addOrderItems,
    getMyOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDeliver,
    getOrders,

} = require('../controllers/orderController');

// routes

router.post('/', protect, addOrderItems);
router.get('/', protect, admin, getOrders); //admin
router.get('/myorders', protect, getMyOrderItems);
router.put('/:id/pay', protect, updateOrderToPaid); 
router.put('/:id/deliver', protect, admin, updateOrderToDeliver); //admin
router.get('/:id', protect, getOrderById);

module.exports = router;



