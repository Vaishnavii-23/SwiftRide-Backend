const {Worker} = require('bullmq')
const{redisConnection} = require('../config/redis')
const {updateSurgeZone} = require('../services/surge.service')

const surgeWorker = new Worker('surge-pricing',async(job)=>{
    if(job.name === 'update-sruge'){
        const {zoneId} = job.data
        const result = await updateSurgeZone(zoneId)
        console.log(`Surge zone updated: `,result)
    }
},{connection:redisConnection})
surgeWorker.on('completed',(job)=>{
    console.log(`Surge job completed ${job.id} completed`)
})
surgeWorker.on('failed',(job,error)=>{
    console.log(`Surge job failed ${job.id} failed:`,error.message)
})

module.exports = {surgeWorker}