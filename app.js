const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const product = require('./routes/product');
const category = require('./routes/category');

const hoaDon = require('./routes/hoaDon');
const cart = require('./routes/cart');
const dotenv = require('dotenv');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.get('/', (req, res) => {
    res.send('hello');
  });
  
app.use('/api/auth', authRoutes);
app.use('/api/product', product);
app.use('/api/category', category);

app.use('/api/hoaDon', hoaDon);
app.use('/api/cart', cart);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
