const prisma = require('../config/db')


const calculateMultiplier = async (demandCount,supplyCount) =>{
    const multiplier = demandCount / supplyCount
    if (multiplier > 5.0) return 3.0
    else if (multiplier > 3.0) return 2.0
    else if (multiplier > 2.0) return 1.5
    else return 1.0
}
 
const updateSurgeZone = async (zoneId,demandCount,supplyCount)=>{
    const countActiveRides = await prisma.ride.count({
        where:{
            status:'REQUESTED'
        }
    })
    const countAvailableDrivers = await prisma.driver.count({
        where:{
            isOnline:true,
            isVerified:true
        }
    })
    const multiplier = await calculateMultiplier(countActiveRides,countAvailableDrivers)
    const updatedZone = await prisma.surgeZone.upsert({
        where:{zoneId},
        update:{
            demandCount: countActiveRides,
            supplyCount : countAvailableDrivers,
            surgeMulti:multiplier
        },
        create:{
            zoneId,
            demandCount : countActiveRides,
            supplyCount : countAvailableDrivers,
            surgeMulti: multiplier
        }
    })
    return updatedZone
}

module.exports = { calculateMultiplier, updateSurgeZone }