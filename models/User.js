const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true }
}, { collection: 'users' }); // explicitly setting collection name

module.exports = mongoose.model('User', userSchema);
