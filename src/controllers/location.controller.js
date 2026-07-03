const {updateDriverLocation,findNearestDrivers,goOnline,goOffline} = require('../services/location.service')
const prisma = require('../config/db')

const updateLocation = async (req,res) =>{
    try {
        const {latitude,longitude} = req.body
        const userId = req.user.userId
        console.log('req.user:', req.user)
        console.log('userId:', userId)
        if(!latitude||!longitude){
            return res.status(400).json({message:'Latitude and longitude are required'})
        }
        const driver = await prisma.driver.findUnique({
            where:{userId}
        })

        if(!driver){
            return res.status(404).json({message:'Driver profile not found'})
        }

        if(!driver.isVerified){
            return res.status(403).json({message:'Driver is not verified yet'})
        }

        const location = await updateDriverLocation(driver.id,latitude,longitude)
        return res.status(200).json({
            message:'Location updated successfully',
            location
        })
    }
    catch(error){
        return res.status(500).json({message:error.message})
    }

}

const getNearestDrivers = async (req,res)=>{
    try{
        const {latitude,longitude,radius} = req.query

        if(!latitude||!longitude){
            return res.status(400).json({message:'Latitude and longitude are required'})
        }

        let drivers = await findNearestDrivers(
            parseFloat(latitude),
            parseFloat(longitude),
            radius ? parseFloat(radius):5
        )

        if(drivers.length === 0){
            drivers = await findNearestDrivers(
                parseFloat(latitude),
                parseFloat(longitude),
                10
            )
        }
        return res.status(200).json({
            message:`Found ${drivers.length} drivers nearby`,
            drivers
        })
    }
    catch(error){
        return res.status(500).json({message:error.message})
    }
}

const driverGoOnline = async(req,res)=>{
    try{
        const userId = req.user.userId
        const driver = await prisma.driver.findUnique({
            where:{userId}
        })
        if(!driver){
            return res.status(404).json({message:'Driver profile not found'})
        }
        await goOnline(userId)
        return res.status(200).json({message:'Driver is now online'})
    }
    catch(error){
        return res.status(400).json({message:error.message})
    }
}

const driverGoOffline = async(req,res)=>{
    try{
        const userId = req.user.userId
        const driver = await prisma.driver.findUnique({
            where:{userId}
        })
        if(!driver){
            return res.status(404).json({message:'Driver profile not found'})
        }
        await goOffline(userId)
        return res.status(200).json({message:'Driver is now offline'})
    }
    catch(error){
        return res.status(400).json({message:error.message})
    }
}

module.exports ={updateLocation,getNearestDrivers,driverGoOnline,driverGoOffline}