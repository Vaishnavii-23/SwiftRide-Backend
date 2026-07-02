const express = require('express');

const cors = require ('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/auth.routes')
const kycRoutes = require('./routes/kyc.routes')
const locationRoutes = require('./routes/location.routes')
const rideRoutes = require('./routes/ride.routes')
const surgeRoutes = require('./routes/surge.routes')
const ratingRoutes  = require('./routes/rating.routes')

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/kyc',kycRoutes)
app.use('/api/location', locationRoutes)
app.use('/api/ride',rideRoutes)
app.use('/api/surge',surgeRoutes)
app.use('/api/rating',ratingRoutes)

module.exports = app;