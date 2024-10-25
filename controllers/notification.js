const Notification = require('../models/Notification');
const User = require('../models/User');

// Tạo một thông báo mới cho người dùng
exports.createNotification = async (userId, message, title, type) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const notification = new Notification({
      user: userId,
      message: message,
      title: title,
      type: type
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20);

    const formattedNotifications = notifications.map((notification, index) => ({
      id: (index + 1).toString(),
      icon: getIconForNotification(notification.type),
      title: notification.title,
      description: notification.message,
      time: getTimeAgo(notification.createdAt)
    }));

    res.status(200).json(formattedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Helper function to get icon based on notification type
function getIconForNotification(type) {
  switch (type) {
    case 'order':
      return 'local-shipping';
    case 'promotion':
      return 'gift-outline';
    case 'menu':
      return 'restaurant-outline';
    case 'delivery':
      return 'local-shipping';
    case 'review':
      return 'star-border';
    case 'weekend':
      return 'weekend';
    case 'dessert':
      return 'ice-cream';
    default:
      return 'notifications-outline';
  }
}

// Helper function to format time
function getTimeAgo(date) {
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  return `${Math.floor(diffDays / 7)} weeks ago`;
}

// Đánh dấu một thông báo là đã đọc
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read', error });
  }
};

// Xóa một thông báo
exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.remove();
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error });
  }
};
