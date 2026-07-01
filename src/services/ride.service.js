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
        data:{status:"IN_PROGRESS",
            startedAt: new Date()
        }
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
    
    //calculate duratio in minutes
    const duration = (new Date()-new Date(ride.startedAt))/1000/60

    //calculate distance using PostGIS
    const distanceResult = await prisma.$queryRaw`
    SELECT ST_Distance(
    ST_MakePoint(${ride.pickupLng},${ride.pickupLat})::geography,
    ST_MakePoint(${ride.dropoffLng},${ride.dropoffLat})::geography
    )/1000 AS distance_km`
    
    const distance = Number(distanceResult[0].distance_km)

    //get surge multiplier
    const surgeZone = await prisma.surgeZone.findUnique({
        where:{zoneId: 'pune-central'}
    })
    const surgeMultiplier = surgeZone ? surgeZone.surgeMulti:1.0

    //calculate fare
    const baseFare = 50
    const perKmRate = 12
    const perMinuteRate = 2
    const fare = (baseFare+(perKmRate*distance)+(perMinuteRate*duration))*surgeMultiplier
    const updatedRide = await prisma.ride.update({
        where:{id:rideId},
        data:{
            status:"COMPLETED", 
            completedAt: new Date(),
            fare:Math.round(fare),
        distance:Math.round(distance*100)/100}
    })
    return updatedRide
}


module.exports = {requestRide, acceptRide, startRide, completeRide}