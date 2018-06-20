$( document ).ready(function() {
    
});

$('#btnlogin').click(function(event) {
    $('#loading').show();
    $('#btnlogin').prop('disabled', true);
    var email = $('#email').val();
    $.post("/login", { username: email});
    $('#loading').hide();
    $.post("/api/auth", { email: email},(data)=>{
        $.cookie('email', data.email, { expires: 5 });
        $.cookie('token', data.token, { expires: 5 });
        if(data.result == 'success') {
            $('#loginsubmit').hide();
            $('#noticmore').append(`
                <div class="alert alert-success">
                    <strong>Success!</strong> We have emailed the link to login to <strong>${email}</strong>. Click on the button inside the email and you will be all set. Check spam box too if you can't find the email in your inbox..
                </div>
            `);
        }
    });
}); 