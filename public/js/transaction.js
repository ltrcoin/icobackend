var tk = jQuery.cookie('token');
load(tk);
function load(token){
    $.get(`/api/getwallet?token=${token}`, function (data, status) {
        if(!status == 'success') return;
        var rendertransaction = jQuery('#rendertransaction').html();
        $.get(`http://api.etherscan.io/api?module=account&action=tokentx&address=${data[0].wallet_address}&startblock=0&endblock=99999999&sort=desc&apikey=YourApiKeyToken`, function (datares, status) {
            datares.result.forEach(function (datainsideetherscan,idx) {
                var _type,_class;
                if(hex2a(datainsideetherscan.from)==hex2a(data[0].wallet_address)){
                    _type="Withdrawal";
                    _class="warning";
                }else{
                    _type="Deposit";
                    _class="success"
                }
                (async () => {
                    var html = Mustache.render(rendertransaction, {
                        hash: datainsideetherscan.hash,
                        type: _type,
                        class: _class,
                        from: datainsideetherscan.from,
                        to: datainsideetherscan.to,
                        value: numberWithCommas(datainsideetherscan.value)
                    });
                    jQuery('#transactiontable').append(html);
                })();
            })
        })
    })
}
const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}