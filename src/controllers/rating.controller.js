const {submitRating} = require('../services/rating.service')

const submitRatingController = async(req,res)=>{
    const {rideId,score,comment} = req.body
    const raterId = req.user.userId
    try{
        const newRating = await submitRating(rideId,raterId,score,comment)
         res.status(201).json({message:'Rating submitted Successfully',data:newRating})
        
        } catch(error){
        res.status(400).json({message:error.message})
    }
}

module.exports = {submitRatingController}