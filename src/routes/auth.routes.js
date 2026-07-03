const express = require('express')
const { registerUser, loginUser, refreshTokenController } = require('../controllers/auth.controller')
const { authenticate, authorize } = require('../middlewares/auth.middleware')
const { validate } = require('../middlewares/validate.middleware')
const { registerSchema, loginSchema } = require('../utils/schemas')

const router = express.Router()

router.post('/register', validate(registerSchema), registerUser)
router.post('/login', validate(loginSchema), loginUser)
router.get('/me', authenticate, (req, res) => {
  res.status(200).json({ message: 'You are authenticated', user: req.user })
})
router.get('/admin-only', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), (req, res) => {
  res.status(200).json({ message: 'Welcome admin' })
})
router.post('/refresh', refreshTokenController)

module.exports = router