
var message = {
    sender: JSON.parse(localStorage.getItem('user')).userName,
    message: ""
}
var id;
var socket;

var msgTemplate = (data) => {
    let tmp = `<div class="mbr-text col-12 col-md-12 mbr-fonts-style">
                  <blockquote>
                   <strong>${data.sender}</strong>
                   <span style="font-style: normal;">${data.message}</span>
                  </blockquote>
                </div>`;

    return tmp;
}

$(document).ready(() => {

    id = new RegExp(/id=(.*)/).exec(window.location)[1];

    socket = io.connect('http://localhost:3000/');
    socket.emit('joinRoom', id);
    socket.on('newMessage', (data) => {
        $('#messages').append(msgTemplate(data.data));

    })
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/movie/movie/" + id,
        success: (data) => {
            $('#title').text(data.movie.movieName);
            $('#moviePhoto').attr('src', data.movie.photo);
            data.movie.messages.forEach(msg => {
                $('#messages').append(msgTemplate(msg));
            })

            $("#messages").animate({ scrollTop: $(this).height() }, "slow");
        },
        error: (data) => {
            alert("false", data);
        },
        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', localStorage.getItem('token')); }
    })

})

var sendMessage = () => {
    message.message = $('#message').val();
    socket.emit('addMessageToMovie', id, message);
}