const express = require('express');
const router = express.Router();
const { sendMeetingRequest, updateMeetingStatus, getMeetings } = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');
const { validateMeeting, checkValidation } = require('../middleware/validationMiddleware');

router.use(protect); // Protect all meeting routes

router.route('/')
  .post(validateMeeting, checkValidation, sendMeetingRequest)
  .get(getMeetings);

router.route('/:id')
  .put(updateMeetingStatus);

module.exports = router;
