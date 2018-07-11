const express       = require('express');
const mongoose      = require('mongoose');
const router        = express.Router();
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var User            = mongoose.model('User');
const bcrypt        = require('bcrypt');
const saltRounds    = 10;
const adminapicontroller = require('../controllers/adminAPIController');

router.use('/api', adminapicontroller); // router upload profile user

router.get('/login',(req,res)=>{
    res.render('adminLogin');
});

router.post('/login',passport.authenticate('admin',{
    successRedirect:'/admin/adminManager',
    failureRedirect:'/admin/login'
}));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/admin/login');
});

router.get('/adminManager', function(req, res) {
    if(req.isAuthenticated()){
        res.render('adminManager');
    }else{
        res.render('adminLogin');
    }
});


////////////////////////transaction////////////////////////
router.get('/adminTransaction', function(req, res) {
    if(req.isAuthenticated()){
        res.render('adminTransaction',{data:'',from:'',to:''});
    }else{
        res.render('adminLogin');
    }
});

router.post('/adminTransaction', function(req, res) {
    if(req.isAuthenticated()){
        var UserTokenLog = mongoose.model('UserTokenLog');
        var from = req.body.from;
        var dayfrom = from.split('/')[1];
        var monthfrom = from.split('/')[0];
        var yearfrom = from.split('/')[2];

        var to = req.body.to;
        var dayto = to.split('/')[1];
        var monthto = to.split('/')[0];
        var yearto = to.split('/')[2];

        UserTokenLog.find({
            created_at:
                {
                    $gte: new Date(`${yearfrom}-${monthfrom}-${dayfrom}T00:00:00.000Z`),
                    $lte: new Date(`${yearto}-${monthto}-${dayto}T23:59:59.999Z`)
                }
        }, function(err, data) {
            if(data){
                res.render('adminTransaction',{data:data,from:from,to:to});
            }
        })
    }else{
        res.render('adminLogin');
    }
});

////////////////////////profile////////////////////////
router.get('/adminProfile', function(req, res) {
    if(req.isAuthenticated()){
        var User = mongoose.model('User');
        User.find({
            $or: [{cmnd_front_confimed: false}, {cmnd_back_confimed: false},{cmnd_self_confimed: false}]
        }, function(err, data) {
            if(data){
                res.render('adminProfile', {data:data});
            }
        })
    }else{
        res.render('adminLogin');
    }
});

////////////////////////SendLTR////////////////////////
router.get('/adminSendLTR', function(req, res) {
    if(req.isAuthenticated()){
        res.render('adminSendLTR');
    }else{
        res.render('adminLogin');
    }
});

passport.use('admin', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
  },function verifyCallback(req,username, password, done){
        if (username) {
            User.findOne({email: username}, function(err, user) {
                if (err) return done(null, false);
                if (!user) {
                    return done(null, false);
                } else {
                    bcrypt.compare(password, user.password, function(err, res) {
                        if(res){
                            if(user.is_admin){
                                return done(null, user);
                            }else{
                                return done(null, false);    
                            }
                        }else{
                            return done(null, false);
                        }
                    });
                }
            })
        } else {
            return done(null, false);
        }
    }
))

passport.serializeUser((user,done)=>{
    done(null,user.email);
})

passport.deserializeUser((email,done)=>{
  User.findOne({email: email}, function(err, user) {
      done(err, user);
  })
})

module.exports = router;