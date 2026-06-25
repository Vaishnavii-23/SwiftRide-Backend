const express = require('express')
const {registerUser,loginUser} = require('../controllers/auth.controller')
const {authenticate,authorize} = require('../middlewares/auth.middleware')


const router = express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/me',authenticate,(req,res)=>{
    res.status(200).json({message: 'You are authenticated',user:req.user})
})
router.get('/admin',authenticate,authorize('ADMIN','SUPER_ADMIN'),(req,res)=>{
    res.status(200).json({message: 'Welcome Admin'})
})

module.exports = router