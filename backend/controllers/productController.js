const asyncHandler = require('../middleware/asyncHandler');
const Product = require('../models/productModel.js');
const { merge } = require('../routes/productRoute.js');

// @description retrieve all products
// @route GET /api/products/
// @acess PUBLIC 

const getAllProducts = asyncHandler(async (req,res) => {
    const products = await Product.find({});
    res.json(products);
});

// @description Get a specific product
// @route GET /api/products/
// @acess PUBLIC 

const getSingleProduct = asyncHandler(async (req,res) => {

    const product = await Product.findById(req.params.id);

    if(product) { 
        return res.status(200).json(product); 
    }

    res.status(404);
    throw new Error('Resource Not Found');
});

// @description create a sample product
// @route POST /api/products/
// @acess PRIVATE/ADMIN 

const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        user: req.user_id,
        name: 'Sample',
        image: '/images/sample.jpg',
        description: 'Sample Desc',
        brand: 'Sample Brand',
        category: 'Sample Category',
        countInStock: 0,
        price: 0,
        numReviews: 0,
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
});

// @description create a sample product
// @route PUT /api/products/:id
// @acess PRIVATE/ADMIN 

const editProduct = asyncHandler(async(req,res) => {
    const {name, image, description, countInStock, brand, category, price} = req.body;
    const product = await Product.findById(req.params.id);
    
    if(product) {
        product.name = name;
        product.image = image;
        product.description = description,
        product.countInStock = countInStock;
        product.brand = brand;
        product.category = category;
        product.price = price;

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);

    } else{
        res.status(404);
        throw new Error('Product Not Found');
    }

})

// @description delete product
// @route DELETE /api/products/:id
// @acess PRIVATE/ADMIN 

const deleteProduct = asyncHandler(async(req,res) => {
    const product = await Product.deleteOne({_id: req.params.id});
    if(product) {
        res.status(200).json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }

});

module.exports = {getAllProducts, getSingleProduct, createProduct, editProduct, deleteProduct};