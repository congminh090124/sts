const Invoice = require('../models/Invoice');
const Cart = require('../models/Cart'); // Import model giỏ hàng
const userSchema = require('../models/User');
exports.createInvoice = async (req, res) => {
    const { userId, cartItems, tinhTrang } = req.body;
    const user = await userSchema.findById(userId);
    // Kiểm tra nếu thiếu dữ liệu
    if (!userId || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Thiếu userId hoặc giỏ hàng rỗng' });
    }
        
    try {
      // Tạo hóa đơn mới
      const newInvoice = new Invoice({
        userId,
       username:user.username,
        cartItems,
        tinhTrang: tinhTrang || 'Đang xử lý',
      });
  
      // Lưu hóa đơn vào cơ sở dữ liệu
      await newInvoice.save();

      // Xóa tất cả các mục giỏ hàng của người dùng
      await Cart.deleteMany({ userId });

      // Trả về kết quả thành công
      res.status(201).json({
        success: true,
        message: 'Hóa đơn đã được tạo và giỏ hàng đã được xóa thành công',
        invoice: newInvoice,
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo hóa đơn',
        error: error.message,
      });
    }
};

exports.showInvoice = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.params.userId })
        .populate('userId', 'username') // Populate với trường username từ mô hình User
        .exec();
    res.json(invoices);
} catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Error fetching invoices', error: error.message });
}
};
exports.showCTHoaDon = async (req, res) => {
  try {
      const invoice = await Invoice.findById(req.params.invoiceId)
          .populate('userId', 'username') // Populate với trường username từ mô hình User
          .populate({
              path: 'cartItems.product',
              select: 'name price description' // Thêm các trường cần thiết từ mô hình Product
          });
          
      if (!invoice) {
          return res.status(404).json({ message: 'Invoice not found' });
      }

      res.json(invoice);
  } catch (error) {
      console.error('Error fetching invoice detail:', error);
      res.status(500).json({ message: 'Error fetching invoice detail', error: error.message });
  }
};
