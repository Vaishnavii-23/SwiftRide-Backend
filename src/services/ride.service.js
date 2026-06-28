const prisma  = require('../config/db')
const { findNearestDrivers } = require('./location.service')


const requestRide  = async (riderId,pickupLat,pickupLng,dropoffLat,dropoffLng,pickupAddress, dropoffAddress) =>{
    const user = await prisma.user.findUnique({
        where:{id:riderId}
    })
    if (user.isBanned){
        throw new Error('You are banned from using this service')
    }
    const ride = await prisma.ride.findFirst({
        where:{
            riderId,
            status: { notIn: ['COMPLETED', 'CANCELLED'] }
        }
    })
    if(ride){
        throw new Error('You already have a pending ride request')
    }

    const nearestDrivers = await findNearestDrivers(pickupLat, pickupLng)
    if(nearestDrivers.length === 0){
        throw new Error('No drivers available in your area')
    }
    
    return await prisma.ride.create({
        data:{
            riderId,
            driverId:nearestDrivers[0].id,
            pickupLat,
            pickupLng,
            dropoffLat,
            dropoffLng,
            pickupAddress,
            dropoffAddress
        }
    }) 
}

const acceptRide = async (rideId,driverId)=>{
  const ride = await prisma.ride.findFirst({
    where:{
        id:rideId,
        driverId, 
        status : "REQUESTED"   
    }
})
    if(!ride){
        throw new Error('Ride Not Found or Already Accepted')
    }
    
    const updatedRide = await prisma.ride.update({
        where :{id:rideId},
        data:{status:"ACCEPTED"}
    })
    return updatedRide
}
 
const startRide = async (rideId,driverId)=>{
    const ride = await prisma.ride.findFirst({
        where:{
            id :rideId,
            driverId,
            status:"ACCEPTED"
        }
    })
    if(!ride){
        throw new Error('Ride not found or not accepted yet')
    }

    const updatedRide = await prisma.ride.update({
        where:{id:rideId},
        data:{status:"IN_PROGRESS"}
    })
    return updatedRide
}

const completeRide = async (rideId,driverId)=>{
    const ride = await prisma.ride.findFirst({
        where:{
            id:rideId,
            driverId,
            status:"IN_PROGRESS"
        }
    })
    if(!ride){
        throw new Error('Ride not found or not in progress yet')
    }

    const updatedRide = await prisma.ride.update({
        where:{id:rideId},
        data:{status:"COMPLETED"}
    })
    return updatedRide
}


module.exports = {requestRide, acceptRide, startRide, completeRide}