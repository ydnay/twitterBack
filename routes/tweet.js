const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');

// Tweet model
const Tweet   = require('../models/Tweet');

// Add tweet to db
router.post('/', (req, res, next) => {
  const tweetCore = req.body.message;
  const hashtags = [];
  // Split tweet to look for #
  const splittedTweet = tweetCore.split(' ');

  // Look for # and push word to hashtags
  splittedTweet.forEach(word => {
    if(word[0] === '#') { hashtags.push(word); }
  });

  // Define tweet
  const theTweet = new Tweet ({
    user:     req.session.passport.user,
    hashtags: hashtags,
    message:  tweetCore,
  });

  // Save tweet to DB
  theTweet.save((err) => {
    if (err) {
      res.status(400).json({ message: `Something went wrong, err ${err}` });
      return;
    }
    
    res.status(200).json(req.user);
  });
});

// Get tweet list
router.get('/', (req, res, next) => {
  Tweet.find()
  .then((tweetList, err) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json(tweetList);
  })
  .catch(error => next(error))
});

// Get tweet by id
router.get('/:id', (req, res, next) => {
  Tweet.findById(req.params.id)
    .then(user => { res.status(200).json(user) })
    .catch(err => { res.status(500).json(err) })
});

// Delete tweet
router.delete('/:id', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Tweet.remove({ _id: req.params.id })
    .then(note => { return res.json({ note: 'Tweet has been removed!' })})
    .catch(err => next(err))
});

module.exports = router;