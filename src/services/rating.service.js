const prisma = require('../config/db')

const submitRating = async (rideId,raterId,rating,comment)=>{
    const ride = await prisma.ride.findUnique({
        where:{id:rideId}
    })
    if(!ride){
        throw new Error('Ride not found or not completed yet')
    }
    if(ride.status !== 'COMPLETED'){
        throw new Error ('Ride not completed yet')
    }
    const hoursSinceCompletion = (new Date() - new Date(ride.completedAt)) / 1000 / 60 / 60
    if (hoursSinceCompletion > 24) throw new Error('Rating window has expired')
    
        const existingRating = await prisma.rating.findFirst({
        where:{
            rideId,
            raterId
        }
    })
    if(existingRating){
        throw new Error('You have already rated this ride')
    }
        let rateeId
        if(ride.riderId === raterId){
            const driver = await prisma.driver.findUnique({
                where:{id:ride.driverId}
            })
            rateeId = driver.userId
        }else {
            rateeId = ride.riderId
        }
        const newRating = await prisma.rating.create({
            data:{
                rideId,
                raterId,
                rateeId,
                score: rating,
            comment
        }
    })
    const allRatings = await prisma.rating.findMany({
        where:{rateeId}
    })
    const averageRating = allRatings.reduce((sum,r)=> sum+r.score,0)/allRatings.length

    await prisma.user.update({
        where:{id:rateeId},
        data:{rating: Math.round(averageRating*10)/10}
    }
    )
    return newRating
}

module.exports = { submitRating}