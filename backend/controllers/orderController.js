const asyncHandler = require('../middleware/asyncHandler');
const Order = require('../models/orderModel');

// @desc: create orders items
// @route: POST /api/orders/myorders
// @acces: Private

const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice

    } = req.body

    if(orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items found');
    } else {
        // create new order
        const order = new Order({
            user: req.user._id,
            orderItems: orderItems.map((x) => ({
               ...x,
               product: x._id,
               _id: undefined,
            })),

            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        // Send the created order back to the client
        res.status(201).json(createdOrder);
    }

});

// @desc: Retrieve all my orders
// @route: GET /api/orders
// @acces: Private

const getMyOrderItems = asyncHandler(async (req, res) => {
    const orders = await Order.find({user: req.user_id});
    if(orders) {
        res.status(200).json(orders);
    } else {
        res.status(404);
        throw new Error('No orders');
    }
});

// @desc: Get order by id
// @route: GET /api/orders/:id
// @acces: Private

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if(order) {
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error('Order not Found');
    }
});

// ---- Admin Controllers ------

// @desc: update order status to paid
// @route: PUT /api/orders/:id/pay
// @acces: Private

const updateOrderToPaid = asyncHandler(async (req, res) => {
    res.send("Update order to paid ");
});

// @desc: Update order to deliver
// @route: PUT /api/orders
// @acces: Private

const updateOrderToDeliver = asyncHandler(async (req, res) => {
    res.send("Update order to delivered (admin)");
});


// @desc: Retrieve all orders
// @route: GET /api/orders
// @acces: Private

const getOrders = asyncHandler(async (req, res) => {
    res.send("Get all orders (admin)");
});

module.exports =  {
    addOrderItems,
    getMyOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDeliver,
    getOrders,
};