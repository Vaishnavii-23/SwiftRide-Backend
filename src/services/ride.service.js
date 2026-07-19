const prisma = require('../config/db')
const { findNearestDrivers } = require('./location.service')
const { clients } = require('../config/websocket')

const requestRide = async (riderId, pickupLat, pickupLng, dropoffLat, dropoffLng, pickupAddress, dropoffAddress, routeType = 'FASTEST') => {
    const user = await prisma.user.findUnique({
        where: { id: riderId }
    })
    if (user.isBanned) {
        throw new Error('You are banned from using this service')
    }
    const existingRide = await prisma.ride.findFirst({
        where: {
            riderId,
            status: { notIn: ['COMPLETED', 'CANCELLED'] }
        }
    })
    if (existingRide) {
        throw new Error('You already have a pending ride request')
    }

    const nearestDrivers = await findNearestDrivers(pickupLat, pickupLng)
    if (nearestDrivers.length === 0) {
        throw new Error('No drivers available in your area')
    }

    const ride = await prisma.ride.create({
        data: {
            riderId,
            driverId: nearestDrivers[0].id,
            pickupLat,
            pickupLng,
            dropoffLat,
            dropoffLng,
            pickupAddress,
            dropoffAddress,
            routeType
        }
    })

    const driverUser = await prisma.driver.findUnique({
        where: { id: nearestDrivers[0].id },
        include: { user: true }
    })
    const driverWs = clients.get(driverUser.userId)
    if (driverWs) {
        driverWs.send(JSON.stringify({
            type: 'ride_request',
            rideId: ride.id,
            pickupAddress: ride.pickupAddress,
            dropoffAddress: ride.dropoffAddress,
            pickupLat: ride.pickupLat,
            pickupLng: ride.pickupLng,
            dropoffLat: ride.dropoffLat,
            dropoffLng: ride.dropoffLng
        }))
    }

    return ride
}

const acceptRide = async (rideId, driverId) => {
    const ride = await prisma.ride.findFirst({
        where: {
            id: rideId,
            driverId,
            status: "REQUESTED"
        }
    })
    if (!ride) {
        throw new Error('Ride Not Found or Already Accepted')
    }

    const updatedRide = await prisma.ride.update({
        where: { id: rideId },
        data: { status: "ACCEPTED" }
    })
    return updatedRide
}

const startRide = async (rideId, driverId) => {
    const ride = await prisma.ride.findFirst({
        where: {
            id: rideId,
            driverId,
            status: "ACCEPTED"
        }
    })
    if (!ride) {
        throw new Error('Ride not found or not accepted yet')
    }

    const updatedRide = await prisma.ride.update({
        where: { id: rideId },
        data: {
            status: "IN_PROGRESS",
            startedAt: new Date()
        }
    })
    return updatedRide
}

const completeRide = async (rideId, driverId) => {
    const ride = await prisma.ride.findFirst({
        where: {
            id: rideId,
            driverId,
            status: "IN_PROGRESS"
        }
    })
    if (!ride) {
        throw new Error('Ride not found or not in progress yet')
    }

    const duration = (new Date() - new Date(ride.startedAt)) / 1000 / 60

    const distanceResult = await prisma.$queryRaw`
    SELECT ST_Distance(
    ST_MakePoint(${ride.pickupLng},${ride.pickupLat})::geography,
    ST_MakePoint(${ride.dropoffLng},${ride.dropoffLat})::geography
    )/1000 AS distance_km`

    const distance = Number(distanceResult[0].distance_km)

    const surgeZone = await prisma.surgeZone.findUnique({
        where: { zoneId: 'pune-central' }
    })
    const surgeMultiplier = surgeZone ? surgeZone.surgeMulti : 1.0

    const baseFare = 50
    const perKmRate = 12
    const perMinuteRate = 2
    const fare = (baseFare + (perKmRate * distance) + (perMinuteRate * duration)) * surgeMultiplier

    const updatedRide = await prisma.ride.update({
        where: { id: rideId },
        data: {
            status: "COMPLETED",
            completedAt: new Date(),
            fare: Math.round(fare),
            distance: Math.round(distance * 100) / 100
        }
    })
    return updatedRide
}

const getRideHistory = async (userId, role) => {
    let whereClause
    if (role === "RIDER") {
        whereClause = { riderId: userId }
    } else {
        const driver = await prisma.driver.findUnique({
            where: { userId }
        })
        if (!driver) {
            return []
        }
        whereClause = { driverId: driver.id }
    }
    const rideHistory = await prisma.ride.findMany({
        where: whereClause,
        include: {
            driver: {
                include: {
                    user: true
                }
            },
            rider: true
        },
        orderBy: { createdAt: 'desc' }
    })
    return rideHistory
}

module.exports = { requestRide, acceptRide, startRide, completeRide, getRideHistory }