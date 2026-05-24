const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    esignatureStatus: {
      type: Boolean,
      default: false,
    },
    signatureData: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
