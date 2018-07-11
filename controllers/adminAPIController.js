const mongoose      = require('mongoose');
const express       = require('express');
const router        = express.Router();
var etherController = require('../controllers/etherController');
var datetimestamp   = Date.now();


//api
router.post('/updateTxhash', function(req, res){
    if(req.isAuthenticated()){
        var UserTokenLog = mongoose.model('UserTokenLog');
        var id = req.body.id;
        var txhashltr = req.body.txhashltr;
        UserTokenLog.findOneAndUpdate({_id:id}, {txhash_LTR:txhashltr}, {upsert:false}, function(err, doc){
            if (!err) res.json('OK');
            else res.json('ERROR');
        });
        
    }else{
        res.render('login',{message: req.flash('loginMessage')});
    }
});

//api check profile
router.post('/confirmImage', function(req, res){
    if(req.isAuthenticated()){
        var User = mongoose.model('User');
        var id = req.body.id;
        var type = req.body.type;
        switch(type) {
            case 'cmnd_front_confimed':
                User.findOneAndUpdate({_id:id}, {
                    cmnd_front_confimed: true
                }, {upsert:false}, function(err, doc){
                    if (!err) res.json('OK');
                    else res.json('ERROR');
                });
                break;
            case 'cmnd_back_confimed':
                User.findOneAndUpdate({_id:id}, {
                    cmnd_back_confimed: true
                }, {upsert:false}, function(err, doc){
                    if (!err) res.json('OK');
                    else res.json('ERROR');
                });
                break;
            case 'cmnd_self_confimed':
                User.findOneAndUpdate({_id:id}, {
                    cmnd_self_confimed: true
                }, {upsert:false}, function(err, doc){
                    if (!err) res.json('OK');
                    else res.json('ERROR');
                });
            break;
            default:
                UserTokenLog.findOneAndUpdate({_id:id}, {
                    cmnd_front_confimed:true
                }, {upsert:false}, function(err, doc){
                    if (!err) res.json('OK');
                    else res.json('ERROR');
                });
        }
    }else{
        res.render('login',{message: req.flash('loginMessage')});
    }
});

//api unconfirm /admin/api/unconfirmed (req.body.addressReceive; req.body.numofeth;)
router.post('/unconfirmed', async function(req, res){
    if(req.isAuthenticated()){
        var User = mongoose.model('User');
        var id = req.body.id;
        var content = req.body.content;
        User.findOneAndUpdate({_id:id}, {
            reason_not_confirm: content,
            cmnd_front: "",
            cmnd_back: "",
            cmnd_self: "",
            cmnd_front_confimed: false,
            cmnd_back_confimed: false,
            cmnd_self_confimed: false
        }, {upsert:false}, function(err, doc){
            if (!err) res.json('OK');
            else res.json('ERROR');
        });
    }else{
        res.render('login',{message: req.flash('loginMessage')});
    }
});

//api save message reason
router.post('/confirmall', function(req, res){
    if(req.isAuthenticated()){
        var User = mongoose.model('User');
        var id = req.body.id;
        User.findOneAndUpdate({_id:id}, {
            cmnd_front_confimed: true,
            cmnd_back_confimed: true,
            cmnd_self_confimed: true
        }, {upsert:false}, function(err, doc){
            if (!err) res.json('OK');
            else res.json('ERROR');
        });
    }else{
        res.render('login',{message: req.flash('loginMessage')});
    }
});

// admin send token;  /admin/api/admin_send_LTR (req.body.addressReceive; req.body.numofeth;)
router.post('/admin_send_LTR',etherController.admin_send_LTR);//withdraw_LTR

module.exports = router;