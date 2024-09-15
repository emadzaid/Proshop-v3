const asyncHandler = require('../middleware/asyncHandler');
const Product = require('../models/productModel.js');

const getAllProducts = asyncHandler(async (req,res) => {
    const products = await Product.find({});
    res.json(products);
});

const getSingleProduct = asyncHandler(async (req,res) => {

    const product = await Product.findById(req.params.id);

    if(product) { 
        return res.status(200).json(product); 
    }

    res.statusCode(404);
    throw new Error('Resource Not Found');
})

module.exports = {getAllProducts, getSingleProduct};