const Notification = require('../models/notificationModel');

/**
 * Hàm tạo thông báo tiện lợi
 * @param {string} recipient - ID người nhận
 * @param {string} sender - ID người gửi
 * @param {string} type - Loại thông báo (BOARD_INVITATION, TASK_ASSIGNMENT, etc.)
 * @param {string} title - Tiêu đề ngắn
 * @param {string} message - Nội dung chi tiết
 * @param {string} relatedId - ID của Board
 * @param {string} cardId - ID của Card (tùy chọn)
 */
const createNotification = async (recipient, sender, type, title, message, relatedId, cardId = null) => {
    try {
        // Không gửi thông báo nếu người gửi và người nhận là cùng 1 người
        if (recipient.toString() === sender.toString()) return;

        await Notification.create({
            recipient,
            sender,
            type,
            title,
            message,
            relatedId,
            cardId
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

module.exports = { createNotification };
