const Document = require('../models/Document');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Local storage as placeholder for AWS S3 / Cloudinary
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// @desc    Upload a document
// @route   POST /api/documents/upload
// @access  Private
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const { fileName, version, esignatureStatus } = req.body;
    const uploadedBy = req.user._id;

    // Use placeholder URL pointing to the static uploads path
    // In production, this would be the URL returned from S3/Cloudinary
    const fileUrl = `/uploads/${req.file.filename}`;

    const document = await Document.create({
      fileName: fileName || req.file.originalname,
      fileUrl,
      uploadedBy,
      version: version ? Number(version) : 1,
      esignatureStatus: esignatureStatus === 'true' || esignatureStatus === true,
    });

    res.status(201).json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all documents for a user (or related to user's projects)
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch documents uploaded by the user
    // Could be expanded to fetch documents by project ID if project model exists
    const documents = await Document.find({ uploadedBy: userId })
      .populate('uploadedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Sign a document
// @route   PUT /api/documents/:id/sign
// @access  Private
const signDocument = async (req, res) => {
  try {
    const { signatureData } = req.body;
    const documentId = req.params.id;

    if (!signatureData) {
      return res.status(400).json({ message: 'Signature data is required' });
    }

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    document.esignatureStatus = true;
    document.signatureData = signatureData;
    const updatedDocument = await document.save();

    res.json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  upload,
  uploadDocument,
  getDocuments,
  signDocument
};
