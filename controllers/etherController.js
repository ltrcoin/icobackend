const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var ether = require('../server/util/ether');
var bcrypt = require('bcrypt');
const config = require('../server/config');
var UserWallet = mongoose.model('UserWallet');
var UserToken = mongoose.model('UserToken');
var UserTokenLog = mongoose.model('UserTokenLog');

// API Tạo ví
var create_wallet_ether = (req, res) => {
    var token = req.body.token;
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                req.decoded = decoded;
                var email = decoded.email;
                ether.create_ether_account(email, (data) => {
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
var getwallet = (req, res) => {
    var token = req.param('token');
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                req.decoded = decoded;
                var email = decoded.email;
                UserWallet.findOne({ email: email }, function (err, result) {
                    if (err) {
                        res.json(err);
                    } else {
                        var arr = [];
                        arr.push(result);
                        res.json([{
                            wallet_type: arr[0].wallet_type,
                            description: arr[0].description,
                            wallet_address: arr[0].wallet_address,
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
async function buytoken(req, res) {
    if (req.isAuthenticated()) {
        var numofeth = req.body.numofeth;
        var _email = req.user.email
        var usrwallt = await getinfo(_email);
        var getblleth = await (ether.get_balance_eth(usrwallt.wallet_address)) / 1000000000000000000;
        var d = new Date();
        if (parseFloat(numofeth) > parseFloat(getblleth)) {
            res.json('0');
        } else {
            ether.transaction_ether(_email, config.WalletFreze, numofeth, (dataETH) => {
                if (dataETH) {
                    ether.transaction_LTR(_email, numofeth, (dataLTR) => {
                        var buytokenlog = new UserTokenLog({
                            email: _email,
                            value_ETH: numofeth,
                            value_LTR: dataLTR.valueltr,
                            txhash_ETH: dataETH,
                            txhash_LTR: dataLTR.hash,
                            create_at: new Date()
                        });
                        buytokenlog.save(function (err) {
                            if (err) throw err;
                        });
                        res.json(dataLTR.hash);
                    });
                }
            });
        }
    } else {
        res.render('sign-in');
    }
};

async function withdraw(req, res) {
    if (req.isAuthenticated()) {
        var _address = req.body.address;
        var _value = req.body.value;
        var _type = req.body.type;
        var _email = req.user.email

        // Lấy balance ETH
        var usrwallt = await getinfo(_email); // Lấy ví từ email
        var getblleth = await (ether.get_balance_eth(usrwallt.wallet_address)) / 1000000000000000000; // lấy eth

        //Tính phí
        var get_gasprice = await ether.GetGasPrice(); // tính gasprice
        var fee_withdraw = (51191 * parseFloat(get_gasprice)) / 1000000000000000000; // phí quy ra ETH

        var d = new Date();

        if (parseFloat(fee_withdraw) > parseFloat(getblleth)) {
            res.json('0');
        } else {
            if (_type == 'ltr') { // RÚT LTR TOKEN
                ether.withdraw_LTR(_email, _address, _value, (txHashLTR) => {
                    if (txHashLTR) {
                        res.json(txHashLTR);
                    }
                });
            } else if (_type == 'eth') { // Rút ETH
                ether.transaction_ether(_email, _address, _value, (txHashETH) => {
                    if (txHashETH) {
                        res.json(txHashETH);
                    }
                });
            }
        }
    } else {
        res.render('sign-in', { message: req.flash('loginMessage') });
    }
};

async function getinfo(_email) {
    var info = await UserWallet.findOne({ email: _email });
    return info;
}

// API Chuyển tiền LTR
function sendLTR(req, res) {
    if (req.isAuthenticated()) {
        var token = req.body.token;
        var numofeth = req.body.numofeth;
        if (token) {
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    req.decoded = decoded;
                    var email = decoded.email;
                    ether.transaction_LTR(email, numofeth, (data) => {
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
    } else {
        res.render('sign-in', { message: req.flash('loginMessage') });
    }
};

// API Chuyển tiền LTR
function admin_send_LTR(req, res) {
    if (req.isAuthenticated()) {
        var addressReceive = req.body.addressReceive;
        var numofeth = req.body.numofeth;
        ether.admin_send_LTR(addressReceive, numofeth, (data) => {
            res.json(data);
        });
    } else {
        res.render('sign-in', { message: req.flash('loginMessage') });
    }
};

// API Lấy thông tin token
var get_token_wallet = (req, res) => {
    if (req.isAuthenticated()) {
        var token = req.param('token');
        if (token) {
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    req.decoded = decoded;
                    var email = decoded.email;
                    UserToken.findOne({ email: email }, function (err, result) {
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
    } else {
        res.render('sign-in', { message: req.flash('loginMessage') });
    }
};


// API Lấy balance
var get_balance_eth = (req, res) => {
    if (req.isAuthenticated()) {
        var address = req.param('address');
        var token = req.param('token');
        if (token) {
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    req.decoded = decoded;
                    ether.get_balance_eth(address, (data) => {
                        (data) ? res.json(data) : res.json(0);
                    });
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    } else {
        res.render('sign-in', { message: req.flash('loginMessage') });
    }
};

// API Lấy balance
async function get_balance_token(req, res) {
    if (req.isAuthenticated()) {
        var address = req.param('address');
        var data = await ether.get_balance_token(address);
        (data) ? res.json(data) : res.json(0);
    } else {
        res.render('sign-in', { message: req.flash('loginMessage') });
    }
};

var get_info_transaction = (req, res) => {
    if (req.isAuthenticated()) {
        var transactionhash = req.param('transactionhash');
        ether.gettransaction_info(transactionhash, (data) => {
            res.json(data);
        });
        // var transactionhash = req.get('transactionhash');
        // ether.gettransaction_info(transactionhash,(data)=>{
        //     res.json(data);
        // });
    } else {
        res.render('sign-in', { message: req.flash('loginMessage') });
    }
}

async function eth_to_usd(req, res) {
    var val = await ether.eth_to_usd();
    res.json(val);
}

async function cal_token_subfee(req, res) {
    var eth = req.param('eth');
    console.log('controller' + eth);
    var val = await ether.cal_token_subfee(eth);
    res.json(val);
}

async function getTransactionReceipt(req, res) {
    if (req.isAuthenticated()) {
        var txhash = req.param('txhash');
        ether.getTransactionReceipt(txhash);
        res.json('ok');
    } else {
        res.render('sign-in', { message: req.flash('loginMessage') });
    }
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
    getTransactionReceipt,
    withdraw,
    admin_send_LTR
};