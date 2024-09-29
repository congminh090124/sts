const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    nameProduct: { type: String, required: true },
    weightProduct: { type: Number },
    quantity:Number,
    donViTinh:String,
    image:String,
    categoryID: { type: mongoose.Types.ObjectId, ref: 'Category' },
});


module.exports =mongoose.model('Product', ProductSchema);