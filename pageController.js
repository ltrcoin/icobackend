const express       = require('express');
const app           = express();
const jwt           = require('jsonwebtoken');
const config        = require('../server/config');





app.set('superSecret', config.secret);

var loginPage = (req, res) => {
    res.render('login',{title:'Login'});
};

//trang wallet
var walletPage = (req, res) => {
    var token = req.param('token');
    if (token) {
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
          if (err) {
            res.render('login',{title:'Login'});    
          } else {
            req.decoded = decoded;
            res.render('wallet',{title:'Your wallet'});
          }
        });
      } else {
        res.render('login',{title:'Login'});
    }
};

//trang buy ico
var buyicoPage = (req, res) => {
    var email = req.param('email');
    var token = req.param('token');
    if (token) {
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
          if (err) {
            res.render('login',{title:'Login'});    
          } else {
            req.decoded = decoded;
            res.render('buyico',{title:'Buy LTR'});
          }
        });
      } else {
        res.render('login',{title:'Login'});
    }
};

module.exports = {
                loginPage,
                walletPage,
                buyicoPage};