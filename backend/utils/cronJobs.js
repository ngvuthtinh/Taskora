const cron = require('node-cron');
const Card = require('../models/cardModel');
const { createNotification } = require('./notificationHelper');

const initCronJobs = () => {
    // Chạy mỗi phút (để bạn dễ kiểm tra tính năng)
    // Cấu trúc: giây phút giờ ngày tháng thứ_trong_tuần
    cron.schedule('0 * * * *', async () => {
        console.log('--- Checking for upcoming deadlines... ---');
        
        try {
            const now = new Date();
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h tới

            // Tìm những card sắp đến hạn trong vòng 24h mà chưa thông báo
            const expiringCards = await Card.find({
                dueDate: { $gt: now, $lt: tomorrow },
                isCompleted: false,
                deadlineNotified: false
            });

            if (expiringCards.length > 0) {
                console.log(`Found ${expiringCards.length} cards expiring soon!`);
                
                for (const card of expiringCards) {
                    // Gửi thông báo cho tất cả thành viên trong card đó
                    if (card.memberIds && card.memberIds.length > 0) {
                        for (const memberId of card.memberIds) {
                            await createNotification(
                                memberId,
                                memberId, // Tự nhắc mình (hoặc có thể để System ID nếu bạn muốn)
                                'DEADLINE_REMINDER',
                                'Deadline Approaching!',
                                `The task "${card.title}" is due within 24 hours. Don't forget!`,
                                card.boardId,
                                card._id
                            );
                        }
                    }

                    // Đánh dấu là đã thông báo xong để lần sau không nhắc lại nữa
                    card.deadlineNotified = true;
                    await card.save();
                }
            }
        } catch (error) {
            console.error('Error in deadline cron job:', error);
        }
    });
};

module.exports = { initCronJobs };
