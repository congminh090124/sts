const mongoose = require('mongoose');
const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    nameProduct: { type: String, required: true },
    username: {
        type: String,
        required: true
      },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    unit: {
        type: String,
        enum: ['kg', 'con'], // Chỉ chấp nhận 'kg' hoặc 'con'
        required: true
    },
    createdAt: { type: Date, default: Date.now }
    
});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;