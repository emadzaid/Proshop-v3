const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require("cookie-parser");

const cors = require('cors')


dotenv.config();
connectDB();
const app = express();

app.use(cors('*'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8000;
const {notFound, errorHandler} = require('./middleware/errorHandler');

const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const orderRoute = require('./routes/orderRoute');
const uploadRoute = require('./routes/uploadRoutes');

app.use('/api/products', productRoute);
app.use('/api/users', userRoute);
app.use('/api/orders', orderRoute);
app.use('/api/uploads', uploadRoute);

const _dirname = path.resolve();
app.use('/uploads', express.static(path.join(_dirname, '/uploads')));

// console.log(path.join(_dirname, '/uploads'))

app.get('/api/config/paypal', (req, res) =>
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
  );

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


