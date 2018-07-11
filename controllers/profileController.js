var mongoose = require('mongoose');
var User = mongoose.model('User');
const config = require('../server/config');
var UserWallet = mongoose.model('UserWallet');
var UserToken = mongoose.model('UserToken');
var UserTokenLog = mongoose.model('UserTokenLog');
var ether = require('../server/util/ether');

async function profile(req, res){
    if(req.isAuthenticated()){
        var _email = req.user.email;
        var usrwallt = await getinfo(_email);
        var userinfo = await getUserinfo(_email);
        var getblleth = await (ether.get_balance_eth(usrwallt.wallet_address))/1000000000000000000; // lấy eth
        var get_gasprice = await ether.GetGasPrice(); // tính gasprice
        var fee_withdraw = (51191 * parseFloat(get_gasprice)) / 1000000000000000000; // tính phí rút
        var d = new Date()
        var usrwallt = await getinfo(_email);
        var getblleth = await (ether.get_balance_eth(usrwallt.wallet_address))/1000000000000000000;
        var ethtousd = await ether.eth_to_usd();
        var gettokenbalance = await ether.get_balance_token(usrwallt.wallet_address);
        gettokenbalance = parseFloat(gettokenbalance)/1000000000000000000;
        var tktousd = tokentousd(gettokenbalance);
        res.render(`profile`,{
            email:_email,
            wallet_type:usrwallt.wallet_type,
            description:usrwallt.description,
            wallet_address:usrwallt.wallet_address,
            balanceeth: getblleth.toFixed(4),
            exchangeUSD: (getblleth*ethtousd).toFixed(4),
            tokenbalance: parseFloat(gettokenbalance).toFixed(4),
            tokentousd: tktousd.toFixed(4),
            id:         userinfo._id,
            firstname:  userinfo.firstname,
            lastname:   userinfo.lastname,
            cmnd_front: userinfo.cmnd_front,
            cmnd_front_confimed: userinfo.cmnd_front_confimed,
            cmnd_back:  userinfo.cmnd_back,
            cmnd_back_confimed: userinfo.cmnd_back_confimed,
            cmnd_self:  userinfo.cmnd_self,
            cmnd_self_confimed: userinfo.cmnd_self_confimed,
            reason_not_confirm: userinfo.reason_not_confirm,
            title: 'Profile',
            i18n: res,
            messageupload: req.flash('messageupload'),
            messageprofile: req.flash('messageprofile')
        });
    }else{
        res.render('sign-in',{message: req.flash('loginMessage')});
    }
}

async function getinfo(_email){
    var info = await UserWallet.findOne({email:_email});
    return info;
}

async function getUserinfo(_email){
    var info = await User.findOne({email:_email});
    return info;
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

module.exports = {profile};