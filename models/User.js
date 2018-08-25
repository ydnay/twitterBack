// models/User.js
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  name:       { type: String, set: capitalizeFirstLetter, required: true },
  email:      { type: String, unique: true, required: true },
  username:   { type: String, unique: true, required : true },
  password:   { type: String, required: true },
  profileImg: { type: String, default: '' },
  headerImg:  { type: String, default: '' },
  followers:  { type: Array, default: [] },
  following:  { type: Array, default: [] },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;