const Meeting = require('../models/Meeting');

// @desc    Send a meeting request
// @route   POST /api/meetings
// @access  Private
const sendMeetingRequest = async (req, res) => {
  try {
    const { title, receiver, startTime, endTime } = req.body;
    const sender = req.user._id;

    if (!title || !receiver || !startTime || !endTime) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    // Conflict Detection Logic
    // Check if the receiver is already booked for an overlapping time slot
    const overlappingMeeting = await Meeting.findOne({
      receiver,
      status: { $ne: 'rejected' }, // Pending or accepted meetings block the slot
      $and: [
        { startTime: { $lt: end } },
        { endTime: { $gt: start } }
      ]
    });

    if (overlappingMeeting) {
      return res.status(409).json({ message: 'Receiver is already booked for this time slot' });
    }

    const meeting = await Meeting.create({
      title,
      sender,
      receiver,
      startTime: start,
      endTime: end,
    });

    res.status(201).json(meeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update meeting status
// @route   PUT /api/meetings/:id
// @access  Private
const updateMeetingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const meetingId = req.params.id;

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Ensure that only the receiver can accept/reject the meeting
    if (meeting.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this meeting' });
    }

    meeting.status = status;
    const updatedMeeting = await meeting.save();

    res.json(updatedMeeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Fetch all meetings for a user (sender or receiver)
// @route   GET /api/meetings
// @access  Private
const getMeetings = async (req, res) => {
  try {
    const userId = req.user._id;

    const meetings = await Meeting.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
    .populate('sender', 'name email role')
    .populate('receiver', 'name email role')
    .sort({ startTime: 1 });

    res.json(meetings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  sendMeetingRequest,
  updateMeetingStatus,
  getMeetings
};
