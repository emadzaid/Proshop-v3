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
// @route: GET /api/orders/myorders
// @acces: Private

const getMyOrderItems = asyncHandler(async (req, res) => {
    const orders = await Order.find({user: req.user._id});
    console.log(orders);
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
// @acces: Private/Admin

const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if(order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };

        const updatedOrder = order.save();
        res.status(200).json(updatedOrder);

    } else {
        res.status(404);
        throw new Error("Order Not Found");
    }
});

// @desc: Update order to deliver
// @route: PUT /api/orders/:id/deliver
// @acces: Private/Admin

const updateOrderToDeliver = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if(order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.save();
        res.status(200).json(order);
    } else {
        res.status(404).send('Order not found');
    }
});


// @desc: Retrieve all orders
// @route: GET /api/orders
// @acces: Private/Admin

const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'name email');
    res.status(200).json(orders);
});

module.exports =  {
    addOrderItems,
    getMyOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDeliver,
    getOrders,
};