const { uploadDocument, getDriverDocuments, reviewDocument } = require('../services/kyc.service')
const prisma = require('../config/db')

const uploadDoc = async (req, res) => {
  try {
    const { type } = req.body
    const userId = req.user.userId

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const fileUrl = req.file.path

    const driver = await prisma.driver.findUnique({ where: { userId } })

    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' })
    }

    const document = await uploadDocument(driver.id, type, fileUrl)

    return res.status(201).json({
      message: 'Document uploaded successfully',
      document
    })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

const getDocs = async (req, res) => {
  try {
    const userId = req.user.userId

    const driver = await prisma.driver.findUnique({
      where: { userId }
    })
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' })
    }

    const documents = await getDriverDocuments(driver.id)
    return res.status(200).json({ documents })
  }
  catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

const reviewDoc = async (req, res) => {
  try {
    const { documentId, status, rejectionReason } = req.body
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Status must be APPROVED or REJECTED' })
    }
    const document = await reviewDocument(documentId, status, rejectionReason)

    return res.status(200).json({
      message: `Document ${status.toLowerCase()} successfully`,
      document
    })
  }
  catch (error) {
    return res.status(400).json({ message: error.message })
  }
}
const getPendingDocs = async (req, res) => {
  try {
    const documents = await prisma.kycDocument.findMany({
      where: { status: 'PENDING' },
      include: { driver: { include: { user: true } } }
    })
    return res.status(200).json({ documents })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

module.exports = { uploadDoc, getDocs, reviewDoc, getPendingDocs }