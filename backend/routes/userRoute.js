const express = require('express');
const router = express.Router();
const {protect, admin} = require('../middleware/authMiddleware');


const {
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
    = require('../controllers/userController');

    // admin routes

    router.post('/logout', logoutUser);
    router.post('/login',  authUser)
    
    router.get('/profile', protect, getUserProfile)
    router.put('/profile', protect, updateUserProfile)

    router.get('/', protect, admin ,getUsers); // admin only 
    router.post('/', registerUser);

    router.put('/:id', protect, admin, updateUser);  // admin only 
    router.delete('/:id', protect, admin, deleteUser);  // admin only 
    router.get('/:id', protect, admin, getUserbyID);  // admin only 


    module.exports = router;
    







    