const User = require('../models/userModel')
const bcrypt = require('bcryptjs')

const updateProfile = async (req, res, next) => {
    try {
        const { name } = req.body
        const user = req.user._id

        const updatedUser = await User.findByIdAndUpdate(user,
            { name: name },
            { returnDocument: 'after' }
        )

        if (!updatedUser) {
            res.status(404)
            throw new Error('Profile not found!')
        }

        res.status(200).json({ message: 'Profile updated successfully!', user: updatedUser })
    } catch (error) {
        next(error)
    }
}

const updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body
        const userId = req.user._id

        const user = await User.findById(userId);

        if (!user) {
            res.status(404);
            throw new Error('User not found!');
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            res.status(400)
            throw new Error('Incorrect current password!')
        }

        const salt = await bcrypt.genSalt(10)
        const hashNewPassword = await bcrypt.hash(newPassword, salt)

        const updatedUser = await User.findByIdAndUpdate(userId,
            { password: hashNewPassword },
            { returnDocument: 'after' }
        ).select('-password')

        if (!updatedUser) {
            res.status(404)
            throw new Error('Profile not found!')
        }

        res.status(200).json({ message: 'Password updated successfully!', user: updatedUser })
    } catch (error) {
        next(error)
    }
}

const updateAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error('No file uploaded!');
        }

        const userId = req.user._id;
        // Kiểm tra link ảnh từ Cloudinary (v2 thường dùng .url hoặc .secure_url)
        const avatarUrl = req.file.path || req.file.url || req.file.secure_url;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { avatar: avatarUrl },
            { returnDocument: 'after' }
        ).select('-password');

        res.status(200).json({
            message: 'Avatar updated successfully!',
            user: updatedUser
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { updateProfile, updatePassword, updateAvatar }

