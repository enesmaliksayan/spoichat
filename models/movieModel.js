const mongoose = require('mongoose');

mongoose.connect('mongodb://spoichat:spoichat@ds021046.mlab.com:21046/spoichat');
const bcrypt = require('bcrypt');

const MovieSchema = mongoose.Schema({
    movieName: { type: String, required: true },
    description: { type: String, required: true },
    releaseDate: { type: Date, default: Date.now() },
    photo: { type: String, default: 'public/images/nophoto.jpg' },
    messages: [{
        senderName: { type: String, default: 'Anonymous' },
        text: { type: String }
    }]
});

const Movie = module.exports = mongoose.model('Movie', MovieSchema);

module.exports.getMovies = (callback) => {
    Movie.find(callback);
}

module.exports.getMovieById = (id, callback) => {
    let oId = mongoose.Types.ObjectId(id);
    Movie.findById(oId, callback);
}

module.exports.getMovieByQuery = (query, callback) => {
    Movie.find({ name: { $in: query } }).sort({ createdAt: -1 }).exec(callback);
}

module.exports.addMovie = (newMovie, callback) => {
    n = new Movie(newMovie);
    n.save(callback);
}

module.exports.addMessageToMovie = (id, message, callback) => {
    Movie.findByIdAndUpdate(id, { $push: { messages: message } }, { 'new': true }, callback);
}