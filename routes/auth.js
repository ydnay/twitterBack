const express       = require('express');
const authRoutes    = express.Router();
const passport      = require('passport');

// User model
const User          = require('../models/User');

// Bcrypt to encrypt passwords
const bcrypt        = require('bcrypt');
const bcryptSalt    = 10;

// Post Sign up
authRoutes.post('/signup', (req, res, next) => {
  const { name, email, username, password } = req.body;

  // Check required fields
  if (!name || !email || !username || !password) {
    res.status(400).json({ message: 'Provide username and password' });
    return;
  }

  // Check if email exists in DB
  User.findOne({ email }, '_id', (err, foundUser) => {
    if (foundUser) {
      res.status(400).json({ message: `This email ${email} is already linked to an account` });
      return;
    }
  });

  // Check if username exists in DB
  User.findOne({ username }, '_id', (err, foundUser) => {
    if (foundUser) {
      res.status(400).json({ message: `This username ${username} already exists` });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    // Define user
    const theUser = new User({
      username,
      password: hashPass,
      name,
      email,
    });

    // Save user to DB
    theUser.save((err) => {
      if (err) {
        res.status(400).json({ message: `Something went wrong, err ${err}` });
        return;
      }

      // Login saved user
      req.login(theUser, (err) => {
        if (err) {
          res.status(500).json({ message: `Something went wrong, err ${err}` });
          return;
        }

        res.status(200).json(req.user);
      });
    });
  });
});

module.exports = authRoutes;