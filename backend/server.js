const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const products = require('./data/products');

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/api/products', (req,res) => {
    res.json(products);
})

app.get('/api/products/:id', (req,res) => {
    const product = products.find(product => product._id === req.params.id)

    if(!product) {
        res.status(404).json({message: 'Product not found'});
        return;
    }
    res.status(200).json(product);
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})