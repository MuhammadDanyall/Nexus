const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['investor', 'entrepreneur'],
    required: true
  },
  bio: {
    type: String
  },
  profileImage: {
    type: String
  },
  walletBalance: {
    type: Number,
    default: 0
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  },
  // Entrepreneur specific fields
  startupName: { type: String },
  pitchSummary: { type: String },
  fundingNeeded: { type: String },
  industry: { type: String },
  location: { type: String },
  foundedYear: { type: Number },
  teamSize: { type: Number },
  
  // Investor specific fields
  investmentInterests: [{ type: String }],
  investmentStage: [{ type: String }],
  portfolioCompanies: [{ type: String }],
  minimumInvestment: { type: String },
  maximumInvestment: { type: String },
  totalInvestments: { type: Number, default: 0 }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
