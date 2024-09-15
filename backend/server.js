const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 8000;
const {notFound, errorHandler} = require('./middleware/errorHandler');

const productRoute = require('./routes/productRoute');

app.use('/api/products', productRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})