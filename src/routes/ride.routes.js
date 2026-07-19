const express = require('express')
const {requestRideController,acceptRideController,startRideController,completeRideController,getRideHistoryController} = require('../controllers/ride.controller')
const {authenticate,authorize} = require('../middlewares/auth.middleware')
const { validate } = require('../middlewares/validate.middleware')
const { rideRequestSchema, rideActionSchema } = require('../utils/schemas')


const router = express.Router()

router.post('/request',authenticate,authorize("RIDER"),validate(rideRequestSchema),requestRideController)
router.patch('/accept',authenticate,authorize("DRIVER"),validate(rideActionSchema),acceptRideController)
router.patch('/start',authenticate,authorize("DRIVER"),validate(rideActionSchema),startRideController)
router.patch('/complete',authenticate,authorize("DRIVER"),validate(rideActionSchema),completeRideController)
router.get('/history',authenticate,getRideHistoryController)

module.exports = router