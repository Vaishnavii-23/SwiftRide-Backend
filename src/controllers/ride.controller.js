const {requestRide,acceptRide,startRide,completeRide,getRideHistory} = require('../services/ride.service')
const prisma = require('../config/db')

const requestRideController = async(req,res)=>{
    try{
        const {pickupLat,pickupLng,dropoffLat,dropoffLng,pickupAddress,dropoffAddress,routeType} = req.body
        const riderId = req.user.userId
        

        const newRide = await requestRide(riderId,pickupLat,pickupLng,dropoffLat,dropoffLng,pickupAddress,dropoffAddress,routeType)
        return res.status(201).json({
            message:'Ride Requested Successfully',
            ride:newRide
        })
    }
    catch(error){
        return res.status(400).json({message:error.message})    }
} 
const acceptRideController = async(req,res)=>{
    try{
        const {rideId} = req.body
        const userId = req.user.userId
        const driver = await prisma.driver.findUnique({ where: { userId } })
        const updatedRide =await acceptRide(rideId,driver.id)
        return res.status(201).json({
            message : 'Ride Accepted Successfully',
            ride:updatedRide
        })
    }
    catch(error){
        return res.status(400).json({message:error.message})
    }
}

const startRideController = async(req,res)=>{
    try{
        const {rideId} = req.body
        const userId = req.user.userId
        const driver = await prisma.driver.findUnique({ where: { userId } })
        const updatedRide =await startRide(rideId,driver.id)
        return res.status(201).json({
            message : 'Ride Started Successfully',
            ride:updatedRide
        })
    }
    catch(error){
        return res.status(400).json({message:error.message})
    }
}

const completeRideController = async(req,res)=>{
    try{
        const {rideId} = req.body
        const userId = req.user.userId
        const driver = await prisma.driver.findUnique({ where: { userId } })
        const updatedRide =await completeRide(rideId,driver.id)
        return res.status(201).json({
            message : 'Ride Completed Successfully',
            ride:updatedRide
        })
    }
    catch(error){
        return res.status(400).json({message:error.message})
    }
}

const getRideHistoryController = async(req,res)=>{
    try{
        const userId = req.user.userId
        const rideHistory = await getRideHistory(userId,req.user.role)
        return res.status(200).json({
            message : 'Ride History Retrieved Successfully',
            rideHistory
        })
    }
    catch(error){
        return res.status(400).json({message:error.message})
    }
}

module.exports = {requestRideController,acceptRideController,startRideController,completeRideController,getRideHistoryController}