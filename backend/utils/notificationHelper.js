const Notification = require('../models/notificationModel');

/**
 * Helper to create a notification
 * @param {string} recipient - Recipient ID
 * @param {string} sender - Sender ID
 * @param {string} type - Notification type (BOARD_INVITATION, TASK_ASSIGNMENT, etc.)
 * @param {string} title - Short title
 * @param {string} message - Detailed content
 * @param {string} relatedId - Board ID
 * @param {string} cardId - Card ID (optional)
 */
const createNotification = async (recipient, sender, type, title, message, relatedId, cardId = null) => {
    try {
        // Don't notify if sender is the same as recipient (except for reminders)
        if (sender.toString() === recipient.toString() && type !== 'DEADLINE_REMINDER') {
            return null;
        }

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
