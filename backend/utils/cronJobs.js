const cron = require('node-cron');
const Card = require('../models/cardModel');
const { createNotification } = require('./notificationHelper');

const initCronJobs = () => {
    // Runs every hour
    // Pattern: minute hour day-of-month month day-of-week
    cron.schedule('0 * * * *', async () => {
        console.log('--- Checking for upcoming deadlines... ---');
        
        try {
            const now = new Date();
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h tới

            // Find cards expiring in the next 24 hours that haven't been notified
            const expiringCards = await Card.find({
                dueDate: { $gt: now, $lt: tomorrow },
                isCompleted: false,
                deadlineNotified: false
            });

            if (expiringCards.length > 0) {
                console.log(`Found ${expiringCards.length} cards expiring soon!`);
                
                for (const card of expiringCards) {
                    // Send notification to all members of the card
                    if (card.memberIds && card.memberIds.length > 0) {
                        for (const memberId of card.memberIds) {
                            await createNotification(
                                memberId,
                                memberId, // Self-reminder
                                'DEADLINE_REMINDER',
                                'Deadline Approaching!',
                                `The task "${card.title}" is due within 24 hours. Don't forget!`,
                                card.boardId,
                                card._id
                            );
                        }
                    }

                    // Mark as notified to avoid duplicate reminders
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
