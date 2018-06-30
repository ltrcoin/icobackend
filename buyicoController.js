var mongoose = require('mongoose');
var User = mongoose.model('User');
const config = require('../server/config');
var UserWallet = mongoose.model('UserWallet');
var UserToken = mongoose.model('UserToken');
var UserTokenLog = mongoose.model('UserTokenLog');
var ether = require('../server/util/ether');

async function buyico(req, res){
    if(req.isAuthenticated()){
        var usrwallt = await getinfo(req.user.email);
        var getblleth = await (ether.get_balance_eth(usrwallt.wallet_address))/1000000000000000000;
        var ethtousd = await ether.eth_to_usd();
        var gettokenbalance = await ether.get_balance_token(usrwallt.wallet_address);
        res.render(`buyico`,{
            email:req.user.email,
            wallet_address: (usrwallt.wallet_address.length>0?usrwallt.wallet_address:''),
            tokenbalance: gettokenbalance,
            exchangeUSD: (getblleth*ethtousd).toFixed(4),
            balanceeth: getblleth.toFixed(4),
            i18n: res
        });
    }else{
        res.render('login',{message: req.flash('loginMessage')});
    }
}

async function getinfo(_email){
    var info = await UserWallet.findOne({email:_email});
    return info;
}


const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {buyico};