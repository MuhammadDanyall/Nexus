const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyOTP } = require('../controllers/authController');
const { validateRegistration, checkValidation } = require('../middleware/validationMiddleware');

router.post('/register', validateRegistration, checkValidation, registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);

module.exports = router;
