const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const protect = async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            const user = await User.findById(decoded.id).select('-password')
            if (!user) {
                return res.status(401).json({ message: 'User no longer exists' })
            }
            req.user = user

            return next()
        } catch (error) {
            console.log(error)
            return res.status(401).json({ message: 'No Authorization' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'No Authorization' });
    }
}

module.exports = { protect }