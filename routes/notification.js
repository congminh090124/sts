const express = require('express');
const {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification
} = require('../controllers/notification');

const router = express.Router();

// Route để tạo thông báo
router.post('/create', createNotification);

// Route để lấy tất cả thông báo của người dùng
router.get('/:userId', getUserNotifications);

// Route để đánh dấu thông báo đã đọc
router.put('/mark-as-read/:notificationId', markNotificationAsRead);

// Route để xóa một thông báo
router.delete('/delete/:notificationId', deleteNotification);

module.exports = router;
