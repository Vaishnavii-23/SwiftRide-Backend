const express = require('express')
const {requestRideController,acceptRideController,startRideController,completeRideController,getRideHistoryController} = require('../controllers/ride.controller')
const {authenticate,authorize} = require('../middlewares/auth.middleware')
const { validate } = require('../middlewares/validate.middleware')
const { rideRequestSchema } = require('../utils/schemas')


const router = express.Router()

router.post('/request',authenticate,authorize("RIDER"),validate(rideRequestSchema),requestRideController)
router.patch('/accept',authenticate,authorize("DRIVER"),validate(rideRequestSchema),acceptRideController)
router.patch('/start',authenticate,authorize("DRIVER"),validate(rideRequestSchema),startRideController)
router.patch('/complete',authenticate,authorize("DRIVER"),validate(rideRequestSchema),completeRideController)
router.get('/history',authenticate,validate(rideRequestSchema),getRideHistoryController)

module.exports = router