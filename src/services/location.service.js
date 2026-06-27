const prisma = require('../config/db')

const updateDriverLocation = async (driverId, latitude, longitude) => {
  return await prisma.driverLocation.upsert({
    where: { driverId },
    update: { latitude, longitude },
    create: { driverId, latitude, longitude }
  })
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

module.exports = { updateDriverLocation, findNearestDrivers }