const { createClient } = require('redis');

const redis = createClient({ url: process.env.REDIS_URL });
redis.on('error', (err) => console.log('Redis error:', err));

const redisUrl = new URL(process.env.REDIS_URL || 'redis://localhost:6379');

const redisConnection = {
    host: redisUrl.hostname,
    port: Number(redisUrl.port) || 6379,
    username: redisUrl.username || undefined,
    password: redisUrl.password || undefined,
    ...(redisUrl.protocol === 'rediss:' && { tls: {} }),
};

module.exports = { redis, redisConnection };