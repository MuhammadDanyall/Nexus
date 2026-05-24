const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  const users = await User.find({});
  console.log(`Total users in DB: ${users.length}`);
  users.forEach(u => console.log(`- ${u.name} (${u.email}) [Role: ${u.role}]`));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
