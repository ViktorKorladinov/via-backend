const User = require('../schemas/user')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../configs/config')

function sign (user, username, res, action) {
    const token = jwt.sign({ id: user._id, username, role: user['role'] }, config.secret, {
        expiresIn: config.expiresIn,
    })
    if (!token) {
        res.status(400).json({
            message: `User not ${action}`, error: 'Problem signing the token'
        })
    } else {
        res.cookie('jwt', token, {
            maxAge: config.expiresIn * 1000,
        })
        const status = action === 'logged' ? 200 : 201
        res.status(status).json({
            message: `User successfully ${action}`, id: user._id
        })
    }
}

exports.register = async (req, res, _) => {
    const { username, password } = req.body
    const hash = await bcrypt.hash(password, 10)
    User.create({
        username, password: hash,
    }).then((user) => sign(user, username, res, 'registered'))
        .catch((error) => {
            let message = 'There was a problem with registering the user'
            if (error.code === 11000) {
                message = 'Username already taken'
            }
            res.status(400).json({
                message, error: error.message,
            })
        })
}

exports.login = async (req, res, _) => {
    const { username, password } = req.body
    // Check if username and password is provided
    if (!username || !password) {
        return res.status(400).json({
            message: 'Username or Password not present',
            error: 'Not all required credentials were provided'
        })
    }
    try {
        const user = await User.findOne({ username })
        if (!user) {
            res.status(400).json({
                message: 'No profile with such username was found', error: 'Username not in database'
            })
        } else {
            const result = await bcrypt.compare(password, user['password'])
            if (result) {
                sign(user, username, res, 'logged')
            } else res.status(400).json({ message: 'Incorrect credentials', error: 'Wrong password' })
        }
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred', error: error.message,
        })
    }
}

exports.logout = async (req, res, _) => {
    res.clearCookie()
}
exports.auth = (req, res, next) => {
    const token = req.cookies['jwt']
    if (token) {
        jwt.verify(token, config.secret, {}, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: 'Not authorized' })
            } else {
                res.locals['username'] = decodedToken.username
                return next()
            }
        })
    } else {
        return res.status(401).json({ message: 'Not authorized, token not available' })
    }
}