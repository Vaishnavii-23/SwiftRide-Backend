const express =  require('express')
const {getAllUsers,banUser,unbanUser,analytics,getActiveRides} = require('../controllers/admin.controller')
const {authenticate,authorize} = require('../middlewares/auth.middleware')

const router = express.Router()
router.use(authenticate)
router.use(authorize('ADMIN'))

router.get('/users',getAllUsers)
router.patch('/ban/:userId',banUser)
router.patch('/unban/:userId',unbanUser)
router.get('/analytics',analytics)
router.get('/active-rides',getActiveRides)

module.exports = router