const jwt           = require('jsonwebtoken');
const config        = require('../server/config');
const mongoose      = require('mongoose');
const passport      = require('passport');
const passportJWT   = require("passport-jwt");
const localStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcrypt');
var User            = mongoose.model('User');

//Create a passport middleware to handle User login
passport.use('login', new localStrategy({
    usernameField : 'email',
    passwordField : 'email',
    passReqToCallback: true
}, async (email, password, done) => {
    try {
        User.findOne({
            email: email
        }, function(err, user) {
                if (user) {
                    return done(null, user, { message : 'Logged in Successfully'});
                } else {
                    return done(null, false, { message : 'User not found'});
                }
        })
    } catch (error) {
        return done(error);
    }
}));





var ExtractJwt  = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions  = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromHeader('authorization');
jwtOptions.secretOrKey = config.secret;
var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    User.findOne({
      email: jwt_payload.id
    }, function(err, user) {
          if (user) {
              next(null, user);
          } else {
              next(null, false);
          }
    })
});
passport.use(strategy);



const JWTstrategy = require('passport-jwt').Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt;

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
  //secret we used to sign our JWT
  secretOrKey : 'top_secret',
  //we expect the user to send the token as a query paramater with the name 'secret_token'
  jwtFromRequest : ExtractJWT.fromUrlQueryParameter('secret_token')
}, async (token, done) => {
  try {
    //Pass the user details to the next middleware
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));

//module.exports = {authen};