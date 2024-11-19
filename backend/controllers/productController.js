const asyncHandler = require('../middleware/asyncHandler');
const Product = require('../models/productModel.js');

// @description retrieve all products
// @route GET /api/products/
// @acess PUBLIC 

const getAllProducts = asyncHandler(async (req,res) => {

    const keyword = req.query.keyword ? ({name: {$regex: req.query.keyword, $options: 'i' }}) : {};
    const pageSize = 8;
    const page = Number(req.query.pageNumber || 1);
    const count = await Product.countDocuments({...keyword});
    const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1));
    res.json({products, page, pages: Math.ceil(count / pageSize)});
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

// @description create product review
// @route POST /api/products/:id/review
// @acess PRIVATE/ 

const createProductReview = asyncHandler(async(req,res) => {
    const product = await Product.findById(req.params.id);
    const {comment, rating} = req.body;
    if(product) {
        // check if user has already reviewed the product
        const userReview = product.review.find((r) => r.user.toString() === req.user._id.toString())
     
        if(userReview) {
            res.status(400);
            throw new Error('Product already reviewed');
        } else {

            if(comment == '' || rating == '') {
                res.status(400);
                throw new Error('Please provide both a rating and a comment');
            }

            const newReview = {
                name: req.user.name,
                comment,
                rating: Number(rating),
                user: req.user._id,
            }

            product.review.push(newReview);
            product.numReviews = product.review.length;
            product.rating = product.review.reduce((acc, r) => acc + r.rating , 0) / product.review.length;

            await product.save();
            res.status(201).json({message: 'Review added'});
        }
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @description Get top products
// @route GET /api/products/top
// @acess PUBLIC

const getTopProducts = asyncHandler(async(req,res) => {
    const products = await Product.find({}).sort({rating: -1}).limit(3);
    res.status(200).json(products);

});


module.exports = {getAllProducts, getSingleProduct, createProduct, editProduct, deleteProduct, createProductReview, getTopProducts};