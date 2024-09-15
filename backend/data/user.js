const bcrypt = require('bcrypt');

const users = 
[
    {
        name: "Admin",
        email: "admin@gmail.com",
        password: bcrypt.hashSync("123456",10),
        isAdmin: true,
    },

    {
        name: "John Doe",
        email: "john@gmail.com",
        password: bcrypt.hashSync("123456",10),
        isAdmin: false,
    },

    {
        name: "Jane Doe",
        email: "jane@gmail.com",
        password: bcrypt.hashSync("123456",10),
        isAdmin: false,
    }
]

module.exports = users;