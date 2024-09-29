const CartSchema = require('../models/Cart');
const ProductSchema = require('../models/Product');
const userSchema = require('../models/User');
const mongoose = require('mongoose');

exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, unit } = req.body;

    // Kiểm tra nếu sản phẩm tồn tại
    const product = await ProductSchema.findById(productId);
    const user = await userSchema.findById(userId);
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Kiểm tra số lượng và đơn vị tính
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Số lượng phải lớn hơn 0' });
    }

    if (!['kg', 'con'].includes(unit)) {
      return res.status(400).json({ message: "Đơn vị tính phải là 'kg' hoặc 'con'" });
    }

    // Tạo một đối tượng giỏ hàng mới
    const newCartItem = new CartSchema({
      userId, 
      username: user.username, // Thêm username vào đây
      product: productId,
      nameProduct: product.nameProduct,
      quantity,
      unit
    });

    // Lưu giỏ hàng vào cơ sở dữ liệu
    const savedCartItem = await newCartItem.save();

    // Trả về phản hồi thành công
    res.status(201).json({ 
      message: 'Sản phẩm đã được thêm vào giỏ hàng thành công', 
      cartItem: savedCartItem,
      nameProduct: product.nameProduct // Thêm nameProduct vào phản hồi
    });
  } catch (error) {
    // Xử lý lỗi
    res.status(500).json({ message: 'Lỗi khi thêm sản phẩm vào giỏ hàng', error: error.message });
  }
};
exports.showCart =async(req, res) =>{
    try {
        const cartItems = await CartSchema.find().populate('product');
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
}
exports.deleteProduct = async (req, res) => {
    try {
        const { userId } = req.body; // Lấy userId từ body request
        const cartItemId = req.params.id; // ID của mục giỏ hàng cần xóa

        // Tìm mục giỏ hàng theo ID
        const cartItem = await CartSchema.findById(cartItemId);

        if (!cartItem) {
            return res.status(404).json({ message: 'Không tìm thấy mục trong giỏ hàng' });
        }

        // Kiểm tra nếu người dùng có quyền xóa mục này
        if (cartItem.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Bạn không có quyền xóa mục này' });
        }

        // Xóa mục giỏ hàng
        await CartSchema.findByIdAndDelete(cartItemId);
        res.json({ message: 'Đã xóa mục khỏi giỏ hàng' });
    } catch (error) {
        console.error('Lỗi khi xóa mục khỏi giỏ hàng:', error);
        res.status(500).json({ message: 'Lỗi server khi xóa mục', error: error.message });
    }
};
exports.updateQuantity = async (req, res) => {
  try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
          return res.status(400).json({ message: 'Số lượng phải lớn hơn 0' });
      }

      const updatedCartItem = await CartSchema.findByIdAndUpdate(
          id,
          { quantity: quantity },
          { new: true }
      ).populate('product');

      if (!updatedCartItem) {
          return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
      }

      res.status(200).json({ message: 'Cập nhật số lượng thành công', cartItem: updatedCartItem });
  } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
      res.status(500).json({ message: 'Lỗi server khi cập nhật số lượng', error: error.message });
  }
};