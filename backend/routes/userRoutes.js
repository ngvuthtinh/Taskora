const express = require ('express')
const router = express.Router()
const { updateProfile, updatePassword, updateAvatar } = require('../controller/userController');
const { protect } = require('../middlewares/authMiddleware');
const uploadCloud = require('../config/cloudinaryConfig');

router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.put('/avatar', protect, uploadCloud.single('avatar'), updateAvatar);

module.exports = router;
