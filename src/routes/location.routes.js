const express = require('express')
const {updateLocation,getNearestDrivers} = require('../controllers/location.controller')
const {authenticateDriver} = require('../middlewares/auth.middleware')
const { authenticate, authorize } = require('../middlewares/auth.middleware')

const router = express.Router()

router.patch('/update', authenticate,authorize('DRIVER'),updateLocation)
router.get('/nearest',authenticate,authorize("RIDER"),getNearestDrivers)

module.exports = router