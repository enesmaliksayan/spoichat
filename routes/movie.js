var express = require('express');
var router = express.Router();
const _ = require('lodash');
const fs = require('fs');

const Movie = require('../models/movieModel.js');


router.get('/', (req, res, next) => {
  Movie.getMovies((err, movies) => {
    if (err) res.json({ ok: false, err });
    else {
      res.json({ ok: true, movies });
    }
  })
});

router.get('/movie/:id', (req, res, next) => {
  let id = req.params.id;
  console.log(id);
  Movie.getMovieById(id, (err, movie) => {
    if (err) {
      res.json({ ok: false, err });
    } else {
      if (movie)
        res.json({ ok: true, movie });
      else
        res.json({ ok: false, msg: 'Kurs bulunamadı' });
    }
  })
});

router.get('/search', (req, res, next) => {
  let query = req.query.q;
  Movie.getMovieByQuery(query, (err, movies) => {
    res.json({ ok: true, movies });
  })
})

router.post('/addMovie', (req, res, next) => {
  let movieToSave = req.body;
  Movie.addMovie(movieToSave, (err, movie) => {
    if (err) res.json({ ok: false, err });
    else {
      res.json({ ok: true, movie });
    }
  })
})


module.exports = router;
