var email, password;

$.ajaxSetup({
    cache: false,
    beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', localStorage.getItem('token')); }
});


$(document).ready(() => {
    if(localStorage.getItem('token')) {
        $('#loginNavItem').hide();
        window.location.href = 'index.html';
    }
})


var login = () => {
    email = $('#email').val();
    password = $('#password').val();

    $.ajax({
        method: "POST",
        url: "http://localhost:3000/user/login",
        data: { email, password }
    }).done(function (resp) {
        if (resp.ok) {
            window.localStorage.clear();
            window.localStorage.setItem('token', resp.token);
            window.localStorage.setItem('user', JSON.stringify(resp.user));
            window.location.href = 'index.html';
        } else {
            alert(resp.message);
        }
    });
}