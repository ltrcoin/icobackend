const mongoose      = require('mongoose');
const jwt           = require('jsonwebtoken');
var ether           = require('../server/util/ether');
var bcrypt          = require('bcrypt');
const config        = require('../server/config');
var UserWallet      = mongoose.model('UserWallet');
var UserToken       = mongoose.model('UserToken');

// API Tạo ví
var create_wallet_ether = (req,res) =>{
    var token   = req.body.token;
    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {      
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
                req.decoded = decoded;
                var email = decoded.email;
                ether.create_ether_account(email,(data) =>{
                    res.json(data);
                })
            }
        });
      } else {
        return res.status(403).send({ 
          success: false, 
          message: 'No token provided.' 
        });
    }
}

// API Lấy thông tin ví
var getwallet = (req,res) => {
    var token = req.param('token');
    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {      
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
                req.decoded = decoded;
                var email = decoded.email;
                UserWallet.findOne({email:email},function(err, result) {
                    if(err){
                        res.json(err);
                    } else {
                        var arr = [];
                        arr.push(result);
                        res.json([{
                            wallet_type:arr[0].wallet_type,
                            description:arr[0].description,
                            wallet_address:arr[0].wallet_address,
                        }]);
                    }
                });
            }
        });
      } else {
        return res.status(403).send({ 
          success: false, 
          message: 'No token provided.' 
        });
    }
};



// API Chuyển tiền LTR
function buytoken (req,res){
    var token   = req.body.token;
    var numofeth = req.body.numofeth;
    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {      
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
                req.decoded = decoded;
                var email = decoded.email;
                ether.transaction_ether(email,config.WalletFreze,numofeth,(data)=>{
                    if(data){
                        ether.transaction_LTR(email,numofeth,(data)=>{
                            res.json(data);
                        });
                    }
                });
            }
        });
      } else {
        return res.status(403).send({ 
          success: false, 
          message: 'No token provided.' 
        });
    }
};

// API Chuyển tiền LTR
function sendLTR (req,res){
    var token   = req.body.token;
    var numofeth = req.body.numofeth;
    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {      
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
                req.decoded = decoded;
                var email = decoded.email;
                ether.transaction_LTR(email,numofeth,(data)=>{
                    res.json(data);
                });
            }
        });
      } else {
        return res.status(403).send({ 
          success: false, 
          message: 'No token provided.' 
        });
    }
};

// API Lấy thông tin token
var get_token_wallet = (req,res) =>{
    var token = req.param('token');
    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {      
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
                req.decoded = decoded;
                var email = decoded.email;
                UserToken.findOne({email:email},function(err, result) {
                    if (err) throw err;
                    res.json(result);
                });
            }
        });
      } else {
        return res.status(403).send({ 
          success: false, 
          message: 'No token provided.' 
        });
    }
};


// API Lấy balance
var get_balance_eth = (req,res) =>{
    var address = req.param('address');
    var token   = req.param('token');
    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {      
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
                req.decoded = decoded;
                ether.get_balance_eth(address,(data)=>{
                    (data)?res.json(data):res.json(0);
                });
            }
        });
      } else {
        return res.status(403).send({ 
          success: false, 
          message: 'No token provided.' 
        });
    }
};

// API Lấy balance
var get_balance_token = (req,res) =>{
    var address = req.param('address');
    ether.get_balance_token(address,(data)=>{
        (data)?res.json(data):res.json(0);
    });
};

var get_info_transaction = (req,res)=>{
    var transactionhash = req.param('transactionhash');
    ether.gettransaction_info(transactionhash,(data)=>{
        res.json(data);
    });
    // var transactionhash = req.get('transactionhash');
    // ether.gettransaction_info(transactionhash,(data)=>{
    //     res.json(data);
    // });
}

async function eth_to_usd(req,res){
    var val = await ether.eth_to_usd();
    res.json(val);
}

async function cal_token_subfee(req,res){
    var eth = req.param('eth');
    console.log('controller' + eth);
    var val = await ether.cal_token_subfee(eth);
    res.json(val);
}

async function getTransactionReceipt(req,res){
    var txhash = req.param('txhash');
    ether.getTransactionReceipt(txhash);
    res.json('ok');
}

module.exports = {
                    create_wallet_ether,
                    getwallet,
                    get_token_wallet,
                    get_balance_eth,
                    get_balance_token,
                    buytoken,
                    get_info_transaction,
                    eth_to_usd,
                    cal_token_subfee,
                    sendLTR,
                    getTransactionReceipt
                };

