const express = require('express')
const {getSurgeZone,updateSurgeManually} = require('../controllers/surge.controller')
const {authenticate,authorize} = require('../middlewares/auth.middleware')


const router = express.Router()

router.get('/:zoneId',authenticate,getSurgeZone)
router.patch('/:zoneId',authenticate,authorize('ADMIN','SUPER_ADMIN'),updateSurgeManually)

module.exports = router