$('#register').click(function(event) {
    event.preventDefault();
    var email = $('#email').val();
    $.post("/register", { email: email}, function( data ) {
        switch(data.result) {
            case 'wronguserpass':
                $('#statuslogin').css("color", "red");
                $('#statuslogin').text('Wrong Password!');
                break;
            case 'success':
                window.location.href = "/wallet?token="+data.token+"&email="+data.email;
                break;
            default:
                return;
        }
    }, "json");
}); 