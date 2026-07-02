const express = require('express')
const {submitRatingController} = require('../controllers/rating.controller')
const {authenticate,authorize} = require('../middlewares/auth.middleware')

const router = express.Router()

router.post('/submit',authenticate,authorize("RIDER","DRIVER"),submitRatingController)

module.exports = router