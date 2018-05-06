const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;


mongoose.connect('mongodb://spoichat:spoichat@ds021046.mlab.com:21046/spoichat');
const bcrypt = require('bcrypt');

const MovieSchema = mongoose.Schema({
    movieName: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String, default: 'public/images/nophoto.jpg' },
    messages: [{
        sender: { type: String, default: 'Anonymous' },
        message: { type: String }
    }]
});

const Movie = module.exports = mongoose.model('Movie', MovieSchema);

module.exports.getMovies = (callback) => {
    Movie.find(callback);
}

module.exports.getMovieById = (id, callback) => {
    let oId = ObjectId(id);
    Movie.findById(oId, callback);
}

module.exports.getMovieByQuery = (query, callback) => {
    Movie.find({ movieName: new RegExp(query, "igm") }).sort({ createdAt: -1 }).exec(callback);
}

module.exports.addMovie = (newMovie, callback) => {
    n = new Movie(newMovie);
    n.save(callback);
}

module.exports.addMessageToMovie = (id, message, callback) => {
    let oId = ObjectId(id);
    Movie.findByIdAndUpdate(oId, { $push: { messages: message } }, { 'new': true }, callback);
}