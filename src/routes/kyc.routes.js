const express = require('express')
const { uploadDoc, getDocs, reviewDoc, getPendingDocs } = require('../controllers/kyc.controller')
const { authenticate, authorize } = require('../middlewares/auth.middleware')
const { upload } = require('../config/cloudinary')

const router = express.Router()

router.post('/upload', authenticate, authorize('DRIVER'), upload.single('document'), uploadDoc)
router.get('/my-docs', authenticate, authorize('DRIVER'), getDocs)
router.post('/review', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), reviewDoc)
router.get('/pending', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), getPendingDocs)

module.exports = router