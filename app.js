require('dotenv').config();

const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const express       = require('express');
const favicon       = require('serve-favicon');
const hbs           = require('hbs');
const mongoose      = require('mongoose');
const logger        = require('morgan');
const path          = require('path');
const session       = require('express-session');
const MongoStore    = require('connect-mongo')(session);
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('./models/User');
const bcrypt        = require('bcrypt');

// DB connection
mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/twitterback', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'twitter',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 6000000 },
  store: new MongoStore( { mongooseConnection: mongoose.connection }),
  ttl: 24 * 60 * 60 // 1 day
}));

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      next(err);
      return;
    }

    if (!foundUser) {
      next(null, false, { message: 'Incorrect username-password combination' });
      return;
    }

    if (!bcrypt.compareSync(password, foundUser.password)) {
      next(null, false, { message: 'Incorrect username-password combination' });
      return;
    }

    next(null, foundUser);
  });
}));

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

passport.deserializeUser((sessionUserId, cb) => {
  User.findById(sessionUserId, (err, userDocument) => {
    if (err) { return cb(err); }
    cb(null, userDocument);
  });
});

app.use(passport.initialize());
app.use(passport.session());

// Express View engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// Routes
const index       = require('./routes/index');
const authRoutes  = require('./routes/auth');
const userRoutes  = require('./routes/user');
const tweetRoutes = require('./routes/tweet');
app.use('/', index);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/tweet', tweetRoutes);

// This will be the default route is nothing else is caught
app.use(function(req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

module.exports = app;
