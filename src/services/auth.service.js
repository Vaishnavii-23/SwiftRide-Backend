const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../config/db')

const register = async (email, phone, password, role) => {
    const existingUser = await prisma.user.findFirst({
        where: {
            OR : [{email},{phone}]
        }
    })
    if(existingUser){
        throw new Error('User already exists')
    }
    const hashedPassword = await bcrypt.hash(password,10)

    const user = await prisma.user.create({
        data: {
            email,
            phone,
            password: hashedPassword,
            role
        }
    })
    if (role === 'DRIVER') {
        await prisma.driver.create({
            data: {
            userId: user.id
            }
    })
    }
    return user
} 
const login = async (email,password)=>{
    const user = await prisma.user.findUnique({
        where :{email}
    })
    if(!user){
        throw new Error('Invalid credentials')
    }
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        throw new Error('Invalid credentials')
    }
    const accessToken = jwt.sign(
        {userId : user.id,role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: '15m'}
    )
    const refreshToken = jwt.sign(
        {userId : user.id,role:user.role},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn:'7d'}
    )
    return {user,accessToken,refreshToken}
}
module.exports = {register,login}
