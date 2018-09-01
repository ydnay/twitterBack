// models/User.js
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  name:       { type: String, required: true },
  email:      { type: String, unique: true, required: true },
  username:   { type: String, unique: true, required : true },
  password:   { type: String, required: true },
  profileImg: { type: String, default: '' },
  headerImg:  { type: String, default: '' },
  followers:  { type: Array, default: [] }, // list of followers ids
  following:  { type: Array, default: [] }, // list of following ids
  liked:      { type: Array, default: [] }, // list of liked tweets ids
  bio:        { type: String, default: '' },
  city:       { type: String, default: '' },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;