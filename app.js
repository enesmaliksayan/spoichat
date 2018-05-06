const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors')
const fileUpload = require('express-fileupload');
const _ = require('lodash');
const http = require('http');


const movie = require('./routes/movie');
const users = require('./routes/users');

const app = express();
const server = http.createServer(app);

const socketIO = require('socket.io');
const io = socketIO(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

// Express Session
app.use(session({
  secret: 'spoichatEnesMalikSayan',
  saveUninitialized: false,
  resave: true,
  cookie: { maxAge: 60000 * 48 }
}));

// Init Passport
app.use(passport.initialize());
app.use(passport.session());


app.use('/user', users);
app.use('/', passport.authenticate('jwt', { session: false }), movie);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
