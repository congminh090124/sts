const express = require('express');
const { register, login, resendOTP, verifyOTP,resetPass,forgotPassword } = require('../controllers/authController');


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPass', resetPass);
module.exports = router;
