const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db')

dotenv.config();
connectDB(); 

const products = require('./data/products');
const users = require('./data/user');

const User = require('./models/userModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');

const colors =  require('colors');

const importData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Order.deleteMany();

        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        const sampleProduct = products.map((product) => {
            return {...product, user: adminUser};
        }) 

        Product.insertMany(sampleProduct);
        console.log("Data Imported".green.inverse);

    } catch(e) {
        console.log(`Error Importing Data: ${e.message}`.green.inverse);
    }
}

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Order.deleteMany();

        console.log("Data Destroyed".red.inverse);

    } catch(e) {
        console.log(`Error Deleting Data: ${e.message}`.red.inverse)
        process.exit(1);
    }
 
}

process.argv[2] === '-d' ? destroyData() : importData();