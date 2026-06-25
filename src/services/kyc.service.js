const prisma = require('../config/db')

const uploadDocument = async (driverId,type,fileUrl)=>{
    const existingDocument = await prisma.kycDocument.findFirst({
        where:{driverId,type}
    })

    if(existingDocument){
        return await prisma.kycDocument.update({
            where:{id:existingDocument.id},
            data:{fileUrl,status:'PENDING'}
        })
    }
return await prisma.kycDocument.create({
    data:{driverId,type,fileUrl}
})
}

const getDriverDocuments = async (driverId)=>{
    return await prisma.kycDocument.findMany({
        where:{driverId}
    })
}

const reviewDocument = async (documentId,status,rejectionReason) => {
    const document = await prisma.kycDocument.update({
        where:{id:documentId},
        data:{status,rejectionReason}
    })

    if(status === "APPROVED"){
        const allDocs = await prisma.kycDocument.findMany({
            where:{driverId:document.driverId}
        })

        const allApproved = allDocs.every(doc => doc.status === 'APPROVED')

        if(allApproved && allDocs.length ===3){
            await prisma.driver.update({
                where:{id:document.driverId},
                data:{kycStatus:"APPROVED",isVerified:true}
            })
        }
    }
    if(status === "REJECTED"){
        await prisma.driver.update({
            where:{id:document.driverId},
            data:{kycStatus: "REJECTED"}
        })
    }
    return document
}

module.exports = {uploadDocument,getDriverDocuments,reviewDocument}