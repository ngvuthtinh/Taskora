const express = require('express');
const router = express.Router();
const { getMyNotifications, markAsRead } = require('../controller/notificationController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getMyNotifications);
router.put('/:id/read', protect, markAsRead);

module.exports = router;
