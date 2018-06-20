$(document).ready(function() { 
    
});

var email = jQuery.cookie('email');
var token = jQuery.cookie('token');

load(email,token);
loadtoken();

$('#createETHWallet').click(function() {
    $.post(`/api/create_wallet_ether`,{token:token}, function (data, status) {
        if(data){
            load(email,token);
        }
    })
});

function load(email,token){
    $('#wallet').empty();
    $.get(`/api/getwallet?token=${token}`, function (data, status) {
        if(!status == 'success') return;
        var rendercoin = jQuery('#renderwallet').html();
        console.log(data);
        data.forEach(function (datainside,idx) {
            loadtoken(datainside.wallet_address);
            var balance = 0;
            var convertUSD = 0;
            switch(datainside.wallet_type) {
                case 'ETH':
                    $.get(`/api/get_balance_eth?token=${token}&address=${datainside.wallet_address}`, function (data, status) {
                        if(data){
                            balance = data / 1000000000000000000;
                            $.get(`https://api.coinmarketcap.com/v2/ticker/1027/`, function (data, status) {
                                if(data != null || data != ""){
                                    convertUSD = parseFloat(data.data.quotes.USD.price) * parseFloat(balance);
                                    var html = Mustache.render(rendercoin, {
                                        type: datainside.wallet_type,
                                        description: datainside.description,
                                        address: datainside.wallet_address,
                                        balance: balance.toFixed(4),
                                        exchangeUSD: convertUSD.toFixed(4)
                                    });
                                    jQuery('#wallet').append(html);
                                }
                            });
                        }
                    });
                    break;
                case 'BTC':
                    break;
                default:
                    return;
            }
        })
    });
}

function loadtoken(address){
    $.get(`/api/get_balance_token?address=${address}`, function (data, status) {
        console.log(data);
        $('#numtoken').empty();
        $('#numtoken').append(`<i class="icon-layers"></i> ${numberWithCommas(data)} LTR`);
        $('#numusd').empty();
        var d = new Date();
        var month = d.getMonth() + 1;
        var priceofmomth;
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
        $('#numusd').empty();
        $('#numusd').append(`<i class="cc USDT-alt"></i> ${numberWithCommas(parseFloat(data) * parseFloat(priceofmomth))} USD`);
        $('#numtokenbig').text(`${numberWithCommas(data)} LTR`);
    })
}

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }