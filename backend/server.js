const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require("cookie-parser");

dotenv.config();
connectDB();
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8000;
const {notFound, errorHandler} = require('./middleware/errorHandler');

const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');


app.use('/api/products', productRoute);
app.use('/api/users', userRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


