const Movie = require('../models/movieModel');

module.exports = function (io) {

    io.on('connection', function (socket) {
        console.log("connected");
        
        socket.on('newMovie', function (movie) {
            socket.emit('newMovie', {
                movie
            });
        });

        socket.on('joinRoom', (data) => {
            console.log("joined");
            socket.join(data.id);
        })

        socket.on('leaveRoom', (data) => {
            socket.leave(data.id);
        })

        socket.on('addMessageToMovie', function (data) {
            Movie.addMessageToMovie(data.id, data.message, (err, message) => {
                socket.to(data.id).emit('newMessage', { message });
            })
        });

    });
};