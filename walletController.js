var mongoose = require('mongoose');
var User = mongoose.model('User');
const config = require('../server/config');
var UserWallet      = mongoose.model('UserWallet');
var UserToken       = mongoose.model('UserToken');
var ether           = require('../server/util/ether');

async function wallet(req, res){
    if(req.isAuthenticated()){
        var usrwallt = await getinfo(req.user.email);
        var getblleth = await (ether.get_balance_eth(usrwallt.wallet_address))/1000000000000000000;
        var ethtousd = await ether.eth_to_usd();
        var gettokenbalance = await ether.get_balance_token(usrwallt.wallet_address);
        var tktousd = tokentousd(gettokenbalance);
        res.render(`wallet`,{
            email:req.user.email,
            wallet_type:usrwallt.wallet_type,
            description:usrwallt.description,
            wallet_address:usrwallt.wallet_address,
            balance: getblleth.toFixed(4),
            exchangeUSD: (getblleth*ethtousd).toFixed(4),
            tokenbalance: parseFloat(gettokenbalance).toFixed(4),
            tokentousd: tktousd,
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
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function tokentousd(numoftoken){
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
        result = parseFloat(numoftoken) * parseFloat(priceofmomth);
        return result;
}



module.exports = {wallet};