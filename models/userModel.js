'use strict';

var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  Schema = mongoose.Schema;

/**
 * User Schema
 */
var UserSchema = new Schema({
  firstname: {
    type: String,
    trim: true,
    default: ''
  },
  lastname: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  country: {
    type: String,
    default: ''
  },
  cmnd_front: {
    type: String,
    default: ''
  },
  cmnd_back: {
    type: String,
    default: ''
  },
  is_admin: {
    type: Boolean,
    default: false
  },
  creat_at: {
    type: Date,
    default: Date.now
  }
});

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

mongoose.model('User', UserSchema);