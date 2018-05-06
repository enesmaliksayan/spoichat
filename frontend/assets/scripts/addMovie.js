var socket;
var movie = {
    movieName: "",
    description: "",
    photo: "",
    messages: []
}


$(document).ready(() => {
    socket = io.connect('http://localhost:3000/');
})

var addMovie = () => {
    movie.movieName = $('#name').val();
    movie.description = $('#description').val();
    movie.photo = $('#photo').val();

    $.ajax({
        method: "POST",
        url: "http://localhost:3000/movie/addMovie",
        data: movie,
        success: (data) => {
            emit(data);
        },
        error: (e) => {
            console.log(e);
        },
        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', localStorage.getItem('token')); }
    })
};

emit = (data) => {
    console.log(data);
    socket.emit('newMovie', data);
}
