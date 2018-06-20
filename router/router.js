const express       = require('express');
const app           = express();
const request       = require("request");
const mongoose      = require('mongoose');
const router        = express.Router();
const cookie        = require('cookie');
const bcrypt        = require('bcrypt');
const saltRounds    = 10;
const config        = require('../server/config');
const passport      = require('passport');

//option
app.set('superSecret', config.secret);

//connect mongo
var db = mongoose.connection;
var options = { server:  { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
mongoose.Promise = global.Promise;
mongoose.connect(config.database,options);
mongoose.set('debug', false);
db.on('error', function (err) { console.log(err); });
db.once('open', function (callback) { console.log('Succeeded connected to mongo DB');});

//import model
var userModel           = require('../models/userModel');
var userWalletModel     = require('../models/userWalletModel');
var userTokenModel      = require('../models/userTokenModel');
var userTokenLogModel   = require('../models/userTokenLogModel');

//import controller
var userController      = require('../controllers/userController');
var authenController    = require('../controllers/authenController');
var pageController      = require('../controllers/pageController');
var etherController     = require('../controllers/etherController');


//Xác thực cho mọi api
//router.use(authenController.authen);

//api
router.post('/auth', userController.auth); //API Đăng nhập, đăng ký
router.post('/create_wallet_ether',etherController.create_wallet_ether);//Tạo ví
router.get('/getwallet',etherController.getwallet);//Lấy thông tin ví
router.get('/get_token_wallet',etherController.get_token_wallet);//Lấy thông tin token của user
router.get('/get_balance_eth',etherController.get_balance_eth);//Lấy balance eth
router.get('/get_balance_token',etherController.get_balance_token);//Lấy balance eth
router.post('/buytoken',etherController.buytoken);//Lấy balance eth
router.get('/get_info_transaction',etherController.get_info_transaction);// get Transaction info from Txhash
router.get('/eth_to_usd',etherController.eth_to_usd);// get Transaction info from Txhash
router.get('/cal_token_subfee',etherController.cal_token_subfee);// get Transaction info from Txhash
//router.post('/sendLTR',etherController.sendLTR);//Lấy balance eth

module.exports = router;