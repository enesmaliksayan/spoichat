var express = require('express');
var router = express.Router();
const _ = require('lodash');
const fs = require('fs');

const Movie = require('../models/movieModel.js');

require('./socket')(io);

router.get('/', (req, res, next) => {
  Movie.getMovies((err, movies) => {
    if (err) res.status(400).json({ ok: false, err });
    else {
      res.json({ ok: true, movies });
    }
  })
});

router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Movie.getMovieById(id, (err, movie) => {
    if (err) {
      res.status(400).json({ ok: false, err });
    } else {
      if (movie)
        res.json({ ok: true, movie });
      else
        res.json({ ok: false, msg: 'Kurs bulunamadı' });
    }
  })
});

router.post('/addMovie', (req, res, next) => {
  let movieToSave = req.body;
  Movie.addMovie(movieToSave, (err, movie) => {
    if (err) res.status(400).json({ ok: false, err });
    else {
      res.json({ ok: true, movie });
    }
  })
})


module.exports = router;
