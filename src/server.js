require ('dotenv').config()
const app = require('./app')
const redis = require('./config/redis')

const PORT = process.env.PORT || 3000

async function startServer(){
    await redis.connect()
    console.log('connected to redis')
    app.listen(PORT,()=>{
        console.log(`SwiftRide server is running on port${PORT}`)
    })
}
startServer()