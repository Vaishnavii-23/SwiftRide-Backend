const prisma = require('../config/db')
const { clients } = require('../config/websocket')

const updateDriverLocation = async (driverId, latitude, longitude) => {
  const location =  await prisma.driverLocation.upsert({
    where: { driverId },
    update: { latitude, longitude },
    create: { driverId, latitude, longitude }
  })
  const ride = await prisma.ride.findFirst({
    where:{
      driverId,
      status:{notIn:['COMPLETED','CANCELLED']}
    }
  })
  if(ride){
    const riderWs = clients.get(ride.riderId)
  if(riderWs){
    riderWs.send(JSON.stringify({
      type:'location',
      latitude,
      longitude
    }))
  }
} return location
}

const findNearestDrivers = async (latitude, longitude, radiusKm = 5) => {
  const drivers = await prisma.$queryRaw`
    SELECT 
      d.id,
      d."userId",
      d."isVerified",
      d."isOnline",
      dl.latitude,
      dl.longitude,
      ST_Distance(
        ST_MakePoint(dl.longitude, dl.latitude)::geography,
        ST_MakePoint(${longitude}, ${latitude})::geography
      ) / 1000 AS distance_km
    FROM "Driver" d
    JOIN "DriverLocation" dl ON dl."driverId" = d.id
    WHERE 
      d."isOnline" = true
      AND d."isVerified" = true
      AND ST_DWithin(
        ST_MakePoint(dl.longitude, dl.latitude)::geography,
        ST_MakePoint(${longitude}, ${latitude})::geography,
        ${radiusKm * 1000}
      )
    ORDER BY distance_km ASC
    LIMIT 5
  `
  return drivers
}

const goOnline = async (userId) =>{
  const driver = await prisma.driver.findUnique({
    where :{userId}
  })
  if (!driver.isVerified) throw new Error('You must complete KYC verification before going online')
  await prisma.driver.update({ where: { id: driver.id }, data: { isOnline: true } })
}

const goOffline = async (userId) => {
  const driver = await prisma.driver.findUnique({ where: { userId } })
  
  // check first
  const activeRide = await prisma.ride.findFirst({
    where: {
      driverId: driver.id,
      status: { notIn: ['COMPLETED', 'CANCELLED'] }
    }
  })
  if (activeRide) throw new Error('Cannot go offline while on an active ride')
  
  // then update
  await prisma.driver.update({ where: { id: driver.id }, data: { isOnline: false } })
}

module.exports = { updateDriverLocation, findNearestDrivers, goOnline, goOffline }