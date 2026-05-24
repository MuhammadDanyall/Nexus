const jwt = require('jsonwebtoken');
require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  const user = await User.findOne({ email: 'rockeycom0077@gmail.com' });
  
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  
  try {
    const res = await fetch('http://localhost:5000/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Data:", data);
  } catch (err) {
    console.error("Error Status:", err.message);
  }
  process.exit(0);
});
