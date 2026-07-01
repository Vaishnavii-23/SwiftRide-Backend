const {createClient} = require('redis');

const redis = createClient({url: process.env.REDIS_URL})
redis.on('error',(err)=> console.log('Redis error:',err));

const redisConnection = {
    host: 'localhost',
    port: 6379,
}



module.exports = {redis, redisConnection}