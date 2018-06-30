const express       = require('express');
const jwt           = require('jsonwebtoken');
const config        = require('../server/config');
const router        = express.Router();
const bcrypt        = require('bcrypt');
const mongoose      = require('mongoose');
const emailusing    = require('../server/util/sendgmail');
var User            = mongoose.model('User');

async function auth(req, res){
    var email = req.body.username;
    User.findOne({
        email: email
    }, function(err, user) {
        if (err) throw err;
          if (!user) {
            var usr = new User({email:email});
            usr.save(function(err, user) {
                if (err) {
                    return res.status(400).send({
                        message: err
                    });
                } else {}
            });
          }else if(user){
                //using bscrypt
              bcrypt.compare(req.body.password, user.password, function(err, resbscrypt) {
                  if(!resbscrypt){
                      res.send({result:'wronguserpass'});
                  }else{
                      var token = jwt.sign({email:user.email}, config.secret, {expiresIn: '2h'});
                    //   emailusing.send(email,token);
                      res.send({
                          result:'success',
                          message: "Enjoy your token!",
                          token:  token,
                          email: user.email
                      });
                  }    
              });
          }
    });
};

module.exports = {auth};