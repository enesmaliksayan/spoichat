var express = require('express');
var router = express.Router();
const _ = require('lodash');
const fs = require('fs');

const Movie = require('../models/movieModel.js');

router.get('/', function (req, res, next) {
  Movie.getMovies((err, movies) => {
    if (err) res.status(400).json({ ok: false, err });
    else {
      res.json({ ok: true, movies });
    }
  })
});

module.exports = router;
