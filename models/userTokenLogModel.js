var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
/**
 * User Token Log Schema
 */

var UserTokenLogSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    default: ''
  },
  wallet_type: {
    type: String,
    default: ''
  },
  from: {
    type: String,
    default: ''
  },
  to: {
    type: String,
    default: ''
  },
  value: {
    type: Number,
    default: 0
  },
  type: { // ref hay mua????
    type: String,
    default: ''
  },
  fee: {
    type: Number,
    default: 0
  },
  txhash: {
    type: String,
    default: ''
  },
  creat_at: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('UserTokenLog', UserTokenLogSchema);
