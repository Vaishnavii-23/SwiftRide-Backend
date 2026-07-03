const express = require('express')
const {getRouteSafety} = require('../controllers/safety.controller')
const {authenticate,authorize} = require('../middlewares/auth.middleware')

const router = express.Router()
router.get('/score', authenticate, authorize('RIDER'), getRouteSafety)

module.exports = router