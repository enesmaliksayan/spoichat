var createMovieTemplate = (data) => {
    let template = `
    <div class="card p-3 col-12 col-md-6 col-lg-2" onclick="detail('${data._id}')">
                    <div class="card-wrapper">
                        <div class="card-img">
                            <img src="${data.photo}">
                        </div>
                        <div class="card-box">
                            <h4 class="card-title pb-3 mbr-fonts-style display-7">
                                ${data.movieName}
                            </h4>
                            <p class="mbr-text mbr-fonts-style display-7">
                                ${data.description}
                            </p>
                            
                        </div>
                    </div>
                </div>
    `;
    return template;
}
var socket;


$(document).ready(() => {
    socket = io.connect('http://localhost:3000/');

    socket.on('newMovie', (movie) => {
        alert("ge", movie);
        $('#movies').append(createMovieTemplate(movie.movie));
    })

    $.ajax({
        method: "GET",
        url: "http://localhost:3000/movie/",
        success: (data) => {
            if (data.ok) {
                data.movies.forEach(movie => {
                    $('#movies').append(createMovieTemplate(movie));
                });
            }
        },
        error: (e) => {
            window.location.href = "login.html";
        },
        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', localStorage.getItem('token')); }

    })
})

var logout = () => {
    window.localStorage.clear();
    window.location.href = "login.html";
}


var search = () => {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/search?q=" + $('#searchMovie').val(),
        success: (data) => {
            $('#movies').html("");
            data.movies.forEach(movie => {
                $('#movies').append(createMovieTemplate(movie));
            });
        },
        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', localStorage.getItem('token')); }

    })
}


var detail = (id) => {
    window.location.href = "movie.html?id=" + id;
}