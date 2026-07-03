const prisma = require('../config/db')
const Openrouteservice = require('openrouteservice-js')

const orsDirections = new Openrouteservice.Directions({
  api_key: process.env.ORS_API_KEY
})

const orsPlaces = new Openrouteservice.Pois({
  api_key: process.env.ORS_API_KEY
})

const getSafetyScoreForArea = async (lat, lng) => {
  const nearbyRides = await prisma.$queryRaw`
    SELECT AVG("safetyScore") as avg_safety
    FROM "Ride"
    WHERE "safetyScore" IS NOT NULL
    AND ST_DWithin(
      ST_MakePoint("pickupLng", "pickupLat")::geography,
      ST_MakePoint(${lng}, ${lat})::geography,
      1000
    )
    AND status = 'COMPLETED'
  `
  return Number(nearbyRides[0].avg_safety) || 5
}

const getNearbyPlaces = async (lng, lat) => {
  try {
    const response = await orsPlaces.calculate({
      request: 'pois',
      geojson: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      buffer: 1000,
      filter_category_ids: [588, 218]
    })
    return response.features ? response.features.length : 0
  } catch (error) {
    return 0
  }
}

const getRouteOptions = async (pickupLat, pickupLng, dropoffLat, dropoffLng) => {
  const coordinates = [[pickupLng, pickupLat], [dropoffLng, dropoffLat]]

  let fastestDuration = '15 mins'
  let safestDuration = '20 mins'
  let fastestDistance = 0
  let safestDistance = 0

  try {
    const fastestRoute = await orsDirections.calculate({
      coordinates,
      profile: 'driving-car',
      format: 'json',
      preference: 'fastest'
    })

    const safestRoute = await orsDirections.calculate({
      coordinates,
      profile: 'driving-car',
      format: 'json',
      preference: 'shortest'
    })

    const fastestSummary = fastestRoute.routes[0].summary
    const safestSummary = safestRoute.routes[0].summary

    fastestDuration = `${Math.round(fastestSummary.duration / 60)} mins`
    safestDuration = `${Math.round(safestSummary.duration / 60)} mins`
    fastestDistance = Math.round(fastestSummary.distance / 1000 * 100) / 100
    safestDistance = Math.round(safestSummary.distance / 1000 * 100) / 100
  } catch (error) {
    console.log('ORS routing error:', error.message)
  }

  const crowdScore = await getSafetyScoreForArea(pickupLat, pickupLng)
  const nearbyPlaces = await getNearbyPlaces(pickupLng, pickupLat)
  const placeBonus = Math.min(2, nearbyPlaces * 0.5)

  const fastestSafetyScore = Math.round(crowdScore * 10) / 10
  const safestSafetyScore = Math.min(10, Math.round((crowdScore + placeBonus) * 10) / 10)

  const getSafetyLevel = (score) => {
    if (score >= 7) return 'GREEN'
    if (score >= 4) return 'YELLOW'
    return 'RED'
  }

  return {
    fastestRoute: {
      type: 'FASTEST',
      estimatedTime: fastestDuration,
      distance: fastestDistance,
      safetyScore: fastestSafetyScore,
      safetyLevel: getSafetyLevel(fastestSafetyScore),
      description: 'Shortest time route'
    },
    safestRoute: {
      type: 'SAFEST',
      estimatedTime: safestDuration,
      distance: safestDistance,
      safetyScore: safestSafetyScore,
      safetyLevel: getSafetyLevel(safestSafetyScore),
      description: 'Route with highest safety score based on police stations, hospitals and user reviews'
    }
  }
}

module.exports = { getRouteOptions }