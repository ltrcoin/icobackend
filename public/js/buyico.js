$( document ).ready(function() {
    $("#txtETHF").prop('disabled', true);
});
var email = jQuery.cookie('email');
var token = jQuery.cookie('token');
var _gAddress;
loadbonus();

//Tính phí
$( "#txtbuybyETH" ).keyup(function() {
    if(parseFloat($('#myethbalance').text())< parseFloat($('#txtbuybyETH').val())){
        $("#exceednotice").text("exceed your eth available").show().fadeOut(2000);
    }
    if($('#txtbuybyETH').val() != 0 || $('#txtbuybyETH').val() != ''){
        var d = new Date();
        var month = d.getMonth() + 1;
        switch(month) {
            case 7:
                priceofmomth = 0.0005;
                break;
            case 8:
                priceofmomth = 0.0006;
                break;
            case 9:
                priceofmomth = 0.0007;
                break;
            case 10:
                priceofmomth = 0.0008;
                break;
            case 11:
                priceofmomth = 0.0009;
                break;
            case 12:
                priceofmomth = 0.00095;
                break;
            default:
                priceofmomth = 0.0005;
        }

        $.get(`http://api.coinmarketcap.com/v2/ticker/1027/`, function (data, status) {
            if(data != null || data != ""){
                var balance = $('#txtbuybyETH').val();
                convertUSD = parseFloat(data.data.quotes.USD.price) * parseFloat(balance);
                var tokens = ((parseFloat(convertUSD))/parseFloat(priceofmomth));
                $("#txtETHF").val(numberWithCommas(Math.trunc(tokens)));
            }
        });
    }else{
        $("#txtETHF").val(0);
    }
});

//Mua token
$('#btnbuy').click(function(event){
    $('#loading').show();
    $('#btnbuy').prop('disabled', true);
    $('#txtbuybyETH').prop('disabled', true);
    $('#ETH').prop('disabled', true);
    setTimeout(function(){
            $('#ETH').prop('disabled', false);
            $('#txtbuybyETH').val('');
            $('#txtbuybyETH').prop('disabled', false);
            $('#btnbuy').prop('disabled', false);
            $('#txtETHF').val('');
            $('#loading').hide();
    }, 3000);
    // $.post(`/api/buytoken`,{token:token,email:email,numofeth:$('#txtbuybyETH').val()}, function (data, status) {
    //     if(data){
    //         $('#txtbuybyETH').val('');
    //         $('#txtbuybyETH').prop('disabled', false);
    //         $('#txtETHF').val('');
    //         $('#loading').hide();
    //     }
    // });
})

var balanceETH = 0;
load(token);
function load(token){
    $.get(`/api/getwallet?token=${token}`, function (data, status) {
        var rendercoin = jQuery('#renderwallet').html();
        
        loadtokentbalance();
        loadethbalance();
        data.forEach(function (datainside,idx) {
            var balance = 0;
            var convertUSD = 0;
            switch(datainside.wallet_type) {
                case 'ETH':
                    $.get(`http://api.etherscan.io/api?module=account&action=balance&address=${datainside.wallet_address}&tag=latest&apikey=YourApiKeyToken`, function (data, status) {
                        if(data.status == 1){
                            balance = data.result / 1000000000000000000;
                            balanceETH = balance;
                            if(data != null || data != ""){
                                var html = Mustache.render(rendercoin, {
                                    type: datainside.wallet_type,
                                    description: datainside.description,
                                    address: datainside.wallet_address,
                                    balance: balance.toFixed(4)
                                });
                                (async () => {
                                    await jQuery('#wallet').append(html);
                                    setevent();
                                })();
                            }
                        }
                    });
                    break;
                case 'BTC':
                    //$('#statuslogin').text('success!');
                    break;
                default:
                    return;
            }
        })
    });
}


function setevent(){
    $("#ETH").click(function() {
        $('#txtbuybyETH').focus();
    });

    $( "#txtbuybyETH" ).keydown(function(event) {
        if (event.shiftKey == true) {event.preventDefault();}
        if ((event.keyCode >= 48 && event.keyCode <= 57) || 
            (event.keyCode >= 96 && event.keyCode <= 105) || 
            event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 ||
            event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 190) {
        } else {event.preventDefault();}
        if($(this).val().indexOf('.') !== -1 && event.keyCode == 190)event.preventDefault();
    });

    //copy to clipboard
    $('#copyETH').click(function(){
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($('#addressETH').text()).select();
        document.execCommand("copy");
        $temp.remove();
        $(".copied").text("Copied to clipboard").show().fadeOut(1200);
    })
}

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function loadtokentbalance(){
    $.get(`/api/getwallet?token=${token}`, function (datatt, status) {
        $.get(`/api/get_balance_token?address=${datatt[0].wallet_address}`, function (data, status) {
            if(data){$('#ethfbalance').text(numberWithCommas(data) + " LTR");}
            else{return '';}
        })
    })
}

function loadethbalance(){
    $.get(`/api/getwallet?token=${token}`, function (datatt, status) {
        $.get(`/api/get_balance_eth?address=${datatt[0].wallet_address}&token=${token}`, function (data, status) {
            if(data){
                $('#myethbalance').text(`${data/1000000000000000000} `);}
            else{return '';}
        })
    })
}

function loadbonus(){
    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    $('#bonus').empty();
    $('#progressSale').empty();
    $('#totalsalefromto').empty();
    var d = new Date();
    var month = d.getMonth() + 1;
    var priceofmomth,monthchar, totalSale,priceofmomth;
    switch(month) {
        case 7:
            priceofmomth = 50;
            monthchar = 'July';
            totalSale = 7000000000;
            priceofmomth = 0.0005;
            break;
        case 8:
            priceofmomth = 40;
            monthchar = 'August';
            totalSale = 6000000000;
            priceofmomth = 0.0006;
            break;
        case 9:
            priceofmomth = 30;
            monthchar = 'September';
            totalSale = 5000000000;
            priceofmomth = 0.0007;
            break;
        case 10:
            priceofmomth = 20;
            monthchar = 'October';
            totalSale = 4000000000;
            priceofmomth = 0.0008;
            break;
        case 11:
            priceofmomth = 10;
            monthchar = 'November';
            totalSale = 3000000000;
            priceofmomth = 0.0009;
            break;
        case 12:
            priceofmomth = 5;
            monthchar = 'December';
            totalSale = 5000000000;
            priceofmomth = 0.00095;
            break;
        default:
            priceofmomth = 50;
            monthchar = 'July';
            totalSale = 7000000000;
            priceofmomth = 0.0005;
    }
    $('#bonus').append(`Welcome bonus <strong>+${priceofmomth}%</strong> expires in ${monthchar}.`);
    

    $.get(`/api/get_balance_token?address=0x5382810058CaDBCaDA471c806Bb4B000d66a56Df`, function (datawallet, status) {
        if(datawallet){
            
            var percentsale = datawallet/totalSale*100;
            $('#progressSale').append(`
                <div class="progress-bar bg-warning" role="progressbar" style="width: ${percentsale}%" aria-valuenow="${percentsale}" aria-valuemin="0" aria-valuemax="100"></div>
            `);
            
            $('#totaltokennum').text(numberWithCommas(datawallet) + " LTR");

            $('#totalsalefromto').append(`
                <span class="float-left">$0</span>
                <span class="float-right">$${numberWithCommas(totalSale)}</span>
            `)

            $.get(`http://api.coinmarketcap.com/v2/ticker/1027/`, function (dataeth, status) {
                if(dataeth){
                    var result = parseFloat(datawallet)*parseFloat(priceofmomth)/parseFloat(dataeth.data.quotes.USD.price);
                    jQuery('#toETH').text(result + " ETH");
                }
            });
            $.get(`http://api.coinmarketcap.com/v2/ticker/1/`, function (databtc, status) {
                if(databtc){
                    var result = parseFloat(datawallet)*parseFloat(priceofmomth)/parseFloat(databtc.data.quotes.USD.price);
                    jQuery('#toBTC').text(result + " BTC");
                }
            });

        }
        else{return '';}
    })
}





