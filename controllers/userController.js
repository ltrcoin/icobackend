const jwt           = require('jsonwebtoken');
const config        = require('../server/config');
const mongoose        = require('mongoose');
const emailusing      = require('../server/util/sendgmail');
var User            = mongoose.model('User');

async function auth(req, res){
    var email = req.body.email;
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
          }
    });
    var token = await jwt.sign({email:email}, config.secret, {expiresIn: '2h'});
    emailusing.send(email,token);
    res.send({
        result:'success',
        message: "Enjoy your token!",
        token:  token,
        email: email
    });
};

module.exports = {auth};