const {requestRide} = require('../services/ride.service')


const requestRideController = async(req,res)=>{
    try{
        const {pickupLat,pickupLng,dropoffLat,dropoffLng,pickupAddress,dropoffAddress} = req.body
        const riderId = req.user.userId
        

        const newRide = await requestRide(riderId,pickupLat,pickupLng,dropoffLat,dropoffLng,pickupAddress,dropoffAddress)
        return res.status(201).json({
            message:'Ride Requested Successfully',
            ride:newRide
        })
    }
    catch(error){
        return res.status(400).json({message:error.message})    }
} 

module.exports = {requestRideController}