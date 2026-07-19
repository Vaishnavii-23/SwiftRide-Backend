const express = require('express');

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/auth.routes')
const kycRoutes = require('./routes/kyc.routes')
const locationRoutes = require('./routes/location.routes')
const rideRoutes = require('./routes/ride.routes')
const surgeRoutes = require('./routes/surge.routes')
const ratingRoutes = require('./routes/rating.routes')
const adminRoutes = require('./routes/admin.routes')
const safetyRoutes = require('./routes/safety.routes')
const { globalLimiter } = require('./config/rateLimit')

const app = express();

app.use(cors({
  origin: ['https://swift-ride-backend-ecku.vercel.app/', 'http://localhost:5173'],
  credentials: true
}));

app.use(globalLimiter);
app.use(helmet());
app.use(morgan('dev'));
// app.options('*', cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/kyc', kycRoutes)
app.use('/api/location', locationRoutes)
app.use('/api/ride', rideRoutes)
app.use('/api/surge', surgeRoutes)
app.use('/api/rating', ratingRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/safety', safetyRoutes)

module.exports = app;
