const {Queue} = require('bullmq')
const {redisConnection} = require('../config/redis')

const surgeQueue = new Queue('surge-pricing',{connection : redisConnection})

const scheduleSurgeUpdate = async () =>{
    await surgeQueue.add(
        'update-surge',
        {zoneId:'pune-central'},
        {
            repeat:{every:5*60*1000},
            jobId : 'surge-update'
        }
    )
    console.log('Surge pricing update job scheduled')
}

module.exports = {scheduleSurgeUpdate}