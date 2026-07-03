const { z } = require('zod')

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['RIDER', 'DRIVER', 'ADMIN', 'SUPER_ADMIN'])
})

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

const rideRequestSchema = z.object({
  pickupLat: z.number(),
  pickupLng: z.number(),
  dropoffLat: z.number(),
  dropoffLng: z.number(),
  pickupAddress: z.string().min(1, 'Pickup address is required'),
  dropoffAddress: z.string().min(1, 'Dropoff address is required'),
  routeType: z.enum(['FASTEST', 'SAFEST']).optional()
})

module.exports = { registerSchema, loginSchema, rideRequestSchema }