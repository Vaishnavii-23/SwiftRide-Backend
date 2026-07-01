const {updateSurgeZone} = require('../services/surge.service')
const prisma =require('../config/db')

const getSurgeZone = async(req,res)=>{
    try{
        const {zoneId}= req.params
        const surgeZone = await prisma.surgeZone.findUnique
            ({
                where:{zoneId}
            }) 
            if(!surgeZone){
                return res.status(404).json({
                    message:'Surge Zone not found'
                })
            }  
            return res.status(201).json({
                surgeZone: surgeZone
            })  
                
    }
    catch(error){
        return res.status(500).json({message:error.message})
    }
}

const updateSurgeManually = async(req,res)=>{
    try{
            const {zoneId} = req.params
            const {surgeMulti} = req.body
            const surgeZone = await prisma.surgeZone.update({
                where:{zoneId},
                data:{surgeMulti}
            })
            if(!surgeZone){
                return res.status(404).json({message:'Surge Zone not found for update'})
            }
            return res.status(200).json({surgeZone})
        }
        catch(error){
            return res.status(500).json({message: error.message})
        }
}

module.exports = {getSurgeZone, updateSurgeManually}