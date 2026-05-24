const express = require('express');
const router = express.Router();
const { upload, uploadDocument, getDocuments, signDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Protect all document routes

router.route('/')
  .get(getDocuments);

// Single file upload using Multer middleware
router.route('/upload')
  .post(upload.single('file'), uploadDocument);

router.route('/:id/sign')
  .put(signDocument);

module.exports = router;
