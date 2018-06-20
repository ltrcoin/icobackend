$('#send_checkbalaneth').click(function(){
    $.get(`/get_balance_eth?address=${$('#addsend').val()}`, function (data, status) {
        $('#stltr').text('');
        $('#stltr').append(
            `<code class="prettyprint">
                    ${parseFloat(data)/10000000000000000000}
             </code>`
        );
    })
})

$('#send_checkbalanltr').click(function(){
    $.get(`/getbalancetoken?address=${$('#addsend').val()}`, function (data, status) {
        $('#stltr').text('');
        $('#stltr').append(
            `<code class="prettyprint">
                    ${data}
             </code>`
        );
    })
})


$('#recei_checkbalaneth').click(function(){
    $.get(`/get_balance_eth?address=${$('#senderaddress').val()}`, function (data, status) {
        $('#stltr').text('');
        $('#stltr').append(
            `<code class="prettyprint">
                ${parseFloat(data)/1000000000000000000}
             </code>`
        );
    })
})

$('#recei_checkbalanltr').click(function(){
    $.get(`/getbalancetoken?address=${$('#senderaddress').val()}`, function (data, status) {
        $('#stltr').text('');
        $('#stltr').append(
            `<code class="prettyprint">
                    ${data}
             </code>`
        );
    })
})


// send LTR
$('#sendLTR').click(function(){
    $.post(`/send_LTR`,{ ltr_balance:$('#numvalue').val(),add_des:$('#senderaddress').val() }, function (data, status) {
        $('#txhash').text(data);
    })
})

// send ETH
$('#sendETH').click(function(){
    $.post(`/send_ether`,{ ltr_balance:$('#numvalue').val(),add_des:$('#senderaddress').val() }, function (data, status) {
        $('#txhash').text(data);
    })
})


$('#statusltr').click(function(){
    $.get(`/get_info_transaction?transactionhash=${$('#txhash').val()}`, function (data, status) {
        $('#stltr').append(
            `
                <code class="prettyprint">
                ${JSON.stringify(data)}
                </code>

            `
        );
    })
})

$('#checketherltr').click(function(){
    window.location = `https://etherscan.io/tx/${$('#txhash').val()}`;
})