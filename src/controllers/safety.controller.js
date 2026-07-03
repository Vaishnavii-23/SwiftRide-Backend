const { getRouteOptions } = require('../services/safety.service')

const getRouteSafety = async (req, res) => {
  try {
    const { pickupLat, pickupLng, dropoffLat, dropoffLng } = req.query
    const routes = await getRouteOptions(
      parseFloat(pickupLat),
      parseFloat(pickupLng),
      parseFloat(dropoffLat),
      parseFloat(dropoffLng)
    )
    return res.status(200).json({
      message: 'Route options calculated successfully',
      data: routes
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = { getRouteSafety }