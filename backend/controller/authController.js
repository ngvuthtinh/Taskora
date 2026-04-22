const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400)
            throw new Error('Name, email and password are required!')
        }

        const user = await User.findOne({ email });
        if (user) {
            res.status(400)
            throw new Error('User already exists!')
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            name,
            email,
            password: hashPassword
        })

        res.status(201).json({
            message: 'Register successfully',
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })

    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400)
            throw new Error('Email and password are required!')
        }

        const user = await User.findOne({ email })
        if (!user) {
            res.status(404)
            throw new Error('Email does not exist!')
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(400)
            throw new Error('Incorrect password!')
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        res.status(200).json({
            message: 'Login successfully',
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        })

    } catch (error) {
        next(error)
    }
}

const googleLogin = async (req, res, next) => {
    try {
        const { credential } = req.body;
        
        // Verify token từ Google
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        const { email, name, picture, sub } = payload;

        // Tìm user theo email
        let user = await User.findOne({ email });

        if (!user) {
            // Nếu chưa có thì tạo mới
            // Password mặc định cho user Google (vì user ko login bằng pass)
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(sub + process.env.JWT_SECRET, salt)

            user = await User.create({
                name: name,
                email: email,
                password: hashPassword,
                avatar: picture
            });
        } else if (picture && !user.avatar) {
            // Cập nhật avatar nếu user đã có tk nhưng chưa có avatar
            user.avatar = picture;
            await user.save();
        }

        // Tạo JWT cho hệ thống của mình
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        res.status(200).json({
            message: 'Google Login successfully',
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        })

    } catch (error) {
        res.status(400)
        next(new Error('Google login failed! ' + error.message))
    }
}


module.exports = { register, login, googleLogin }