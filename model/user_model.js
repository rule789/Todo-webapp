const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    unique: [true, '已有此帳號']
  },
  password: {
    required: true,
    type: String,
    minlength: [6,  '最少六位元']
  },
  token: {
    type: String,
    required: true,
  },
  resetPwdToken: {
    type: String,
  },
  resetPwdExp: {
    type: Date,
  },
  nickname: {
    type: String,
  },
  userImg: {
    type: String,
  }
});


const User = mongoose.model('User', UserSchema);

module.exports = {User};

