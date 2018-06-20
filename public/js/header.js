$("#logout").click(function() {
    $.cookie('email', null, { path: '/' });
    $.cookie('token', null, { path: '/' });
    window.location.href = "/logout";
});


$( document ).ready(function() {
    var email = jQuery.cookie('email');
    var token = jQuery.cookie('token');
    (async () => {
        await $("#headeraccountname").empty();
        $("#headeraccountname").append(`<i class="ft-award"></i>${email}`);
    })();
    $.get(`/api/getwallet?token=${token}`, function (data, status) {
        $.get(`/api/get_balance_token?address=${data[0].wallet_address}`, function (data, status) {
            if(data){$('#headernumtoken').text(numberWithCommas(data));}
            else{return '';}
        })
    })
    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});

