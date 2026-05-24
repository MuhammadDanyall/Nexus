const { check, validationResult } = require('express-validator');

// Validation rules for user registration
const validateRegistration = [
  check('name', 'Name is required').not().isEmpty().trim().escape(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('role', 'Role is required').isIn(['investor', 'entrepreneur']),
  check('bio').optional().trim().escape(),
];

// Validation rules for meeting creation
const validateMeeting = [
  check('title', 'Title is required').not().isEmpty().trim().escape(),
  check('receiver', 'Receiver ID is required').not().isEmpty(),
  check('startTime', 'Valid start time is required').isISO8601(),
  check('endTime', 'Valid end time is required').isISO8601(),
];

// Middleware to check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateMeeting,
  checkValidation
};
