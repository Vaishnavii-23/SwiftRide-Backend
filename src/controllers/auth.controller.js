const {register, login,refreshAccessToken} = require('../services/auth.service')

const registerUser = async (req,res) =>{
    try{
        const {email,phone,password,role} = req.body

        if(!email || !phone || !password || !role){
            return res.status(400).json({message:'Email,phone and password are required '})
        }
        const user  = await register(email,phone,password,role)
        return res.status(201).json({message:'User registered successfully',
            user:{
                id:user.id,
                email:user.email,
                phone:user.phone,
                role:user.role
            }
        })
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const loginUser = async(req,res)=>{
    try{
        const{email,password} = req.body
        if(!email || !password){
            return res.status(400).json({message:'Email and password are required'})
        }
        const {user,accessToken,refreshToken} = await login(email,password)
        return res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user:{
                id:user.id,
                email:user.email,
                phone:user.phone,
                role:user.role
            }
        })
    } catch (error){
        return res.status(400).json({message: error.message})
    }
}

const refreshTokenController = async(req,res)=>{
    try{
        const {refreshToken} = req.body
        if(!refreshToken){
            return res.status(400).json({message:'Refresh token is required'})
        }
        const {user,accessToken} = await refreshAccessToken(refreshToken)
        return res.status(200).json({
            message: 'Access token refreshed successfully',
            accessToken,
            user:{
                id:user.id,
                email:user.email,
                phone:user.phone,
                role:user.role
            }
        })
    } catch (error){
        return res.status(400).json({message: error.message})
    }
}

module.exports = {registerUser, loginUser, refreshTokenController}