const Invoice = require('../models/Invoice');
const Cart = require('../models/Cart');
const userSchema = require('../models/User');
const { createNotification } = require('./notification');

exports.createInvoice = async (req, res) => {
  const { userId, cartItems, tinhTrang } = req.body;
  const user = await userSchema.findById(userId);
  
  if (!userId || !cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: 'Thiếu userId hoặc giỏ hàng rỗng' });
  }
      
  try {
    const newInvoice = new Invoice({
      userId,
      username: user.username,
      cartItems,
      tinhTrang: tinhTrang || 'Đang xử lý',
    });

    await newInvoice.save();
    await Cart.deleteMany({ userId });

    // Tạo thông báo cho người dùng
    const notificationTitle = 'Hóa đơn mới';
    const notificationMessage = `Hóa đơn mới đã được tạo với ID: ${newInvoice._id}`;
    const notificationType = 'order';
    await createNotification(userId, notificationMessage, notificationTitle, notificationType);

    res.status(201).json({
      success: true,
      message: 'Hóa đơn đã được tạo, giỏ hàng đã được xóa và thông báo đã được gửi',
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
