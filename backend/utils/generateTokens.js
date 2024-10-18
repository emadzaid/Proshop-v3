const jwt = require('jsonwebtoken');

const generateTokens = ((res, userID) => {

    const token = jwt.sign({userID}, process.env.JWT_SECRET_KEY, {expiresIn: '30d'});
        
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development' ? true : false,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
    })

});

module.exports = generateTokens;