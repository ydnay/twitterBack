const express = require('express');
const router  = express.Router();

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

// Get tweet by id
router.get('/:id', (req, res, next) => {
  Tweet.findById(req.params.id)
    .then(user => { res.status(200).json(user) })
    .catch(err => { res.status(500).json(err) })
});

module.exports = router;