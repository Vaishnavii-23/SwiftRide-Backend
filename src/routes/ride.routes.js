const express = require('express')
const {requestRideController,acceptRideController,startRideController,completeRideController} = require('../controllers/ride.controller')
const {authenticate,authorize} = require('../middlewares/auth.middleware')


const router = express.Router()

router.post('/request',authenticate,authorize("RIDER"),requestRideController)
router.patch('/accept',authenticate,authorize("DRIVER"),acceptRideController)
router.patch('/start',authenticate,authorize("DRIVER"),startRideController)
router.patch('/complete',authenticate,authorize("DRIVER"),completeRideController)
module.exports = router