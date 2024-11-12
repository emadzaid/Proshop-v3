const User = require('../models/userModel');
const asyncHandler = require('../middleware/asyncHandler');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const generateTokens = require('../utils/generateTokens');

// @desc Authenticate user and get token
// @route POST/api/users/login
// @access Public
const authUser = asyncHandler(async (req,res) => {

    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))) {
        generateTokens(res, user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc Register user
// @route POST/api/users/
// @access Public
const registerUser = asyncHandler(async (req,res) => {
    const {name, email, password} = req.body;
    const userExist = await User.findOne({email});
   
    if(userExist) {
        res.status(409);
        throw new Error('User already exists');
    } 
        
    const user = await User.create({name, email, password});

    if(user) {
        generateTokens(res, user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(422)
        throw new Error("Invalid form data");
    }
    
});


// @desc Logut user
// @route POST/api/users/logout
// @access Private

const logoutUser = asyncHandler(async (req, res) => {
    // Set the jwt cookie to an empty string and expire it immediately
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0), // This expires the cookie immediately
    });

    // Send a success response or a message indicating the user is logged out
    res.status(200).json({ message: 'User is logged out' });
});

// @desc Get user profile
// @route GET/api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user._id);
    if(user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404).json({message: "User not found"});
    }
});

// @desc Update user profile
// @route PUT/api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req,res) => {

    const user = await User.findById(req.user._id);
    
    if(user) {
        
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404).json({message: "User not found"});
    }
    
});

// @desc Get all users
// @route GET/api/users/
// @access Private/Admin
const getUsers = asyncHandler(async (req,res) => {
    const users = await User.find({}).select('-password');
    res.send(users);
});

// @desc Get single user (by ID)
// @route GET/api/users/:id
// @access Private/Admin
const getUserbyID = asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id).select('-password');
    if(user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
})


// @desc Delete user
// @route Delete/api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id);
    if(user && user.isAdmin) {
        res.status(400);
        throw new Error("Cannot delete Admin User");
    } else {
        await User.deleteOne({_id: user._id});
        res.status(200).json({message: 'User deleted successfully'});
    }

});

// @desc Update user
// @route PUT/api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id);
    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);
        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('Product not found with given ID');
    }

});


module.exports = {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    updateUser,
    deleteUser,
    getUserbyID 
}

// 1. auth user
// 2. register user
// 3. logut user
// 4. get user profile
// 5. update user profile
// admin controllers:
    // 6. get all users
    // 7. delete a user
    // 8. update a user
    // 9. get user by id