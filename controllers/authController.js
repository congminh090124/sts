const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

// Cấu hình nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Hàm tạo mã OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

exports.register = async (req, res) => {
  const { companyname, username, email, phoneNumber, password } = req.body;

  try {
    // Kiểm tra xem username hoặc email đã tồn tại chưa
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: existingUser.username === username ? 'Username đã tồn tại' : 'Email đã tồn tại'
      });
    }

    const user = await User.create({ companyname, username, email, phoneNumber, password });
    
    // Tạo và lưu OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Gửi email chứa OTP
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: 'Xác minh tài khoản của bạn',
      text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 10 phút.`
    });

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP.',
    });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(400).json({ 
      success: false, 
      error: 'Đăng ký thất bại', 
      details: error.message 
    });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy người dùng' });
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, error: 'OTP không hợp lệ hoặc đã hết hạn' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      success: true,
      token: generateToken(user._id),
      message: 'Xác minh thành công',
    });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Xác minh thất bại' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res.status(401).json({ success: false, error: 'Tài khoản chưa được xác minh' });
      }
      res.json({
        success: true,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, error: 'Thông tin đăng nhập không hợp lệ' });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: 'Đăng nhập thất bại' });
  }
};

exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy người dùng' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: 'Mã OTP mới',
      text: `Mã OTP mới của bạn là: ${otp}. Mã này sẽ hết hạn sau 10 phút.`
    });

    res.json({
      success: true,
      message: 'Đã gửi lại mã OTP. Vui lòng kiểm tra email của bạn.',
    });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Gửi lại OTP thất bại' });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};