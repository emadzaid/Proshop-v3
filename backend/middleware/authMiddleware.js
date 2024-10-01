const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const asyncHandler = require('./asyncHandler');
const dotenv = require('dotenv');
dotenv.config();


const protect = asyncHandler(async (req,res,next) => {
    let token;

    // get JWT from the cookie
    token = req.cookies.jwt;

    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = await userModel.findById(decoded.userID).select('-password');
            next();
    
        } catch(e) {
            console.log(e)
            res.status(401); // 401 stands for not authorized
            throw new Error('User Not Authorized, token failed');
        }
        
    } else {
        res.status(401); // 401 stands for not authorized
        throw new Error('User Not Authorized');
    }

})

// Admin middleware
const admin = asyncHandler((req,res,next) => {

    if(req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error("Not an authoized admin!");
    }
})
 
module.exports = {protect, admin};

