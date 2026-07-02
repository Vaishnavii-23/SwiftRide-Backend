const  prisma  = require('../config/db')

const getAllUsers  = async ( req,res) =>{
    try{
        const {role} = req.query
        const where = role ? {role}:{}
        const user = await prisma.user.findMany({
            where,
            select:{
                id:true,
                email:true,
                phone:true,
                role:true,
                isActive:true,
                isBanned:true,
                rating:true,
                createdAt:true,
                
            }
        })
        res.status(200).json({message:'Users fetched successfully',data:user})
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
}

const banUser = async(req,res)=>{
    try{
        const {userId} = req.params
        const user = await prisma.user.update({
            where:{id:userId},
            data:{isBanned:true}
        })
        res.status(200).json({message:'User banned successfully',data:user})
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
}

const unbanUser = async(req,res)=>{
    try{
        const {userId} = req.params
        const user = await prisma.user.update({
            where:{id:userId},
            data:{isBanned:false}
        })
        res.status(200).json({message:'User unbanned successfully',data:user})
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
}

const analytics = async(req,res)=>{
    try{
        const revenueData =await prisma.ride.aggregate({
            _sum:{fare:true},
            _avg:{fare:true},
            _count:{fare:true},
            where:{status:'COMPLETED'}
        })
        const activeDrivers =await prisma.driver.count({
            where:{isOnline:true}
        })
        res.status(200).json({
            message:'Analytics fetched successfully',
            data:{
                totalRevenue:revenueData._sum.fare ||0,
                totalCompletedRides: revenueData._count.fare,
                averageFare:Math.round(revenueData._avg.fare ||0),
                activeDrivers
            
            }
        })
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
}

module.exports = {getAllUsers,banUser,unbanUser,analytics}