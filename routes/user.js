const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');

// Tweet model
const User     = require('../models/User');

// Get user by id
router.get('/:id', (req, res, next) => {
  User.findById(req.params.id)
    .then(user => { res.status(200).json(user) })
    .catch(err => { res.status(500).json(err) })
})

// Update auth-user's profile.
router.put('/:id', (req, res, next) => {
  if(req.isAuthenticated()) {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    const { name, bio, city } = req.body;

    User.findByIdAndUpdate( userId, { name, bio, city })
      .then(home => {
        return res.json({ message: "User successfully updated" });
      })
      .catch(error => next(error));
    return;
  }

  res.status(403).json({ message: "Not Authorized" });
});

// Get user following
router.get('/:id/following', (req, res, next) => {
  User.findById(req.params.id).populate('following')
    .then(user => { res.status(200).json(user) })
    .catch(err => { res.status(500).json(err) })
});

// Get user followers
router.get('/:id/followers', (req, res, next) => {
  User.findById(req.params.id).populate('followers')
    .then(user => { res.status(200).json(user) })
    .catch(err => { res.status(500).json(err) })
});

// Get user liked
router.get('/:id/liked', (req, res, next) => {
  User.findById(req.params.id).populate('liked')
    .then(user => { res.status(200).json(user) })
    .catch(err => { res.status(500).json(err) })
});


module.exports = router;