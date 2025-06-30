const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  avatar: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Friend', FriendSchema);