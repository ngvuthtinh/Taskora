const Notification = require('../models/notificationModel');

// 1. Lấy danh sách thông báo của tôi
const getMyNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate('sender', 'name avatar') // Lấy cả tên và ảnh người gửi
            .sort({ createdAt: -1 }) // Thông báo mới nhất lên đầu
            .limit(20);

        res.status(200).json(notifications);
    } catch (error) {
        next(error);
    }
};

// 2. Đánh dấu một hoặc tất cả là đã đọc
const markAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (id === 'all') {
            await Notification.updateMany({ recipient: req.user._id }, { isRead: true });
        } else {
            await Notification.findByIdAndUpdate(id, { isRead: true });
        }
        res.status(200).json({ message: 'Marked as read' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getMyNotifications, markAsRead };
