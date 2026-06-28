const express = require('express')
const {requestRideController} = require('../controllers/ride.controller')
const {authenticate,authorize} = require('../middlewares/auth.middleware')


const router = express.Router()

router.post('/request',authenticate,authorize("RIDER"),requestRideController)

module.exports = router