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

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(cors({ credentials: true, origin: true }));
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
  cookie: { maxAge: 60000 * 48 }
}));

// Init Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/user', users);
app.use('/movie', passport.authenticate('jwt'), movie);



const Movie = require('./models/movieModel');


io.on('connection', function (socket) {
  console.log("connected");

  socket.on('newMovie', function (movie) {
    socket.emit('newMovie', {
      movie
    });
  });

  socket.on('joinRoom', (id) => {
    console.log(id);
    socket.join(id);
  })

  socket.on('leaveRoom', (data) => {
    socket.leave(data);
  })

  socket.on('addMessageToMovie', function (id, data) {
    console.log(id);
    Movie.addMessageToMovie(id, data, (err, message) => {
      console.log(data);
      io.to(id).emit('newMessage', { data });
    })
  });

});


module.exports = app;
