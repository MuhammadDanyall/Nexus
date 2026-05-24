const User = require('../models/User');

// @desc    Get all users (excluding current user)
// @route   GET /api/users
// @access  Private
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('name email role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile/:id
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile/:id
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Basic fields
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.profileImage = req.body.profileImage || user.profileImage;
      
      // Update password if provided
      if (req.body.password) {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }
      
      // Entrepreneur specific fields
      if (user.role === 'entrepreneur') {
        user.startupName = req.body.startupName !== undefined ? req.body.startupName : user.startupName;
        user.pitchSummary = req.body.pitchSummary !== undefined ? req.body.pitchSummary : user.pitchSummary;
        user.fundingNeeded = req.body.fundingNeeded !== undefined ? req.body.fundingNeeded : user.fundingNeeded;
        user.industry = req.body.industry !== undefined ? req.body.industry : user.industry;
        user.location = req.body.location !== undefined ? req.body.location : user.location;
        user.foundedYear = req.body.foundedYear !== undefined ? req.body.foundedYear : user.foundedYear;
        user.teamSize = req.body.teamSize !== undefined ? req.body.teamSize : user.teamSize;
      }
      
      // Investor specific fields
      if (user.role === 'investor') {
        user.investmentInterests = req.body.investmentInterests !== undefined ? req.body.investmentInterests : user.investmentInterests;
        user.investmentStage = req.body.investmentStage !== undefined ? req.body.investmentStage : user.investmentStage;
        user.portfolioCompanies = req.body.portfolioCompanies !== undefined ? req.body.portfolioCompanies : user.portfolioCompanies;
        user.minimumInvestment = req.body.minimumInvestment !== undefined ? req.body.minimumInvestment : user.minimumInvestment;
        user.maximumInvestment = req.body.maximumInvestment !== undefined ? req.body.maximumInvestment : user.maximumInvestment;
        user.totalInvestments = req.body.totalInvestments !== undefined ? req.body.totalInvestments : user.totalInvestments;
      }

      const updatedUser = await user.save();

      // Ensure we don't send the password back
      const userResponse = updatedUser.toObject();
      delete userResponse.password;
      
      res.json(userResponse);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserProfile,
  updateUserProfile
};
