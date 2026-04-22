const express = require('express')
const router = express.Router()
const { register, login, googleLogin } = require('../controller/authController')
const { protect } = require('../middlewares/authMiddleware'); 

router.post('/register', register)

router.post('/login', login)

router.post('/google-login', googleLogin)

router.get('/me', protect, (req, res) => {
    res.status(200).json({
        message: 'Chào mừng bạn đến với khu vực dành riêng cho thành viên!',
        user: req.user
    });
})

module.exports = router