const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: {
    type: String,
    required: true
  },  // Đảm bảo userId là ObjectId và tham chiếu đến bảng (collection) 'User'
  cartItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      nameProduct: { type: String, required: true },
        // Đảm bảo product là ObjectId
      quantity: { type: Number, required: true },
      unit: { type: String, required: true },
    },
  ],
  tinhTrang: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Invoice = mongoose.model('Invoice', InvoiceSchema);
module.exports = Invoice;
