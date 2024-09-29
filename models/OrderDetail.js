const OrderDetailSchema = new Schema({
    id_chi_tiet_don_hang: { type: String, required: true },
    id_don_hang: { type: String, required: true },
    id_san_pham: { type: String, required: true },
    so_luong: { type: Number, required: true }
});

const OrderDetail = mongoose.model('OderDetail', OrderDetailSchema);
module.exports = OrderDetail;