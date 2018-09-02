// models/Tweet.js
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const tweetSchema = new Schema({
  user:       { type : Schema.Types.ObjectId, ref: 'Users', required: true },
  date:       { type: Date, default: Date.now },
  hashtags:   { type: Array },
  message:    { type: String, minlength: 1, maxlength: 280 },
  retweetId:  { type: String, default: '' },
  replayId:   { type: String, default: '' },
  retweets:   { type: Number, default: 0 },
  likes:      { type: Number, default: 0 },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;