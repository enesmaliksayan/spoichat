const express = require('express');
const _ = require('lodash');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

const User = require('../models/userModel.js');

router.post('/register', (req, res, next) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let userName = req.body.userName;
  let email = req.body.email;
  let password = req.body.password;

  let newUser = new User({
    firstName,
    lastName,
    userName,
    email,
    password
  });

  User.registerUser(newUser, (err, user) => {
    if (err) {
      switch (err.code) {
        case 11000:
          res.json({ ok: false, errors: 'Kullanıcı adı veya email zaten kayıtlı!', err });
          break;
        default:
          res.status(500).json({ ok: false, errors: 'Saptanamayan bir problem meydana geldi!' });
      }
    } else {
      res.status(200).json({ ok: true });
    }
  })
});

// Login post
router.post('/login', (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;

  console.log(req.body);

  User.getUserByEmail(email, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ ok: false, message: 'Kullanıcı bulunamadı' });
    }
    else {
      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          let token = jwt.sign({ user }, 'spoichatEnesMalikSayan', {
            expiresIn: 604800 // 1 week
          });

          res.status(200).json({
            ok: true,
            token: 'JWT ' + token,
            user: {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              userName: user.userName
            }
          });
        } else {
          return res.json({ ok: false, message: 'Yanlış Şifre' })
        }
      });
    }
  });
});

// Local Strategy
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = 'spoichatEnesMalikSayan';

passport.use(new JwtStrategy(jwtOptions, function (jwt_payload, done) {
  User.getUserById(jwt_payload.user._id, (err, user) => {
    if (err) return done(err, false);
    if (user) return done(null, user);
    else return done(null, false);
  })
})
);

passport.serializeUser((user, next) => {
  next(null, user.id);
});

passport.deserializeUser((id, next) => {
  User.getUserById(id, (err, user) => {
    next(err, user);
  })
});

module.exports = router;