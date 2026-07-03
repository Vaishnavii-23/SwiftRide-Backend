const express = require('express')
const {updateLocation,getNearestDrivers,driverGoOnline,driverGoOffline} = require('../controllers/location.controller')
const { authenticate, authorize } = require('../middlewares/auth.middleware')

const router = express.Router()

router.patch('/update', authenticate,authorize('DRIVER'),updateLocation)
router.get('/nearest',authenticate,authorize("RIDER"),getNearestDrivers)
router.patch('/online',authenticate,authorize("DRIVER"),driverGoOnline)
router.patch('/offline',authenticate,authorize("DRIVER"),driverGoOffline)

module.exports = router