const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const validator = require('validator');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const async = require('async');
const {mongoose} = require('../model/connect.js');
const {Message} = require('../model/message_model.js');
const {User} = require('../model/user_model.js');
const {sendMail} = require('./utils/sendMail.js');


// register page
router.get('/register', function(req, res) {
  res.render('register', {
    title: '註冊',
    auth: false,
  });
});


// account validator
router.post('/register/validator_account', function(req, res) {
  // 驗證email格式
  let account_format_error = validator.isEmail(req.body.account); // true flase
  if(!account_format_error){
    return res.send({result: 'accountFormatError'});
  } else {

    User.find({email: req.body.account}).then((user) => {
      // 重複帳號
      if(user[0]) {
        res.send({result: 'existed'});
      } else {
        res.send({result: 'ok'});
      }
    }, (e) => {
      res.send({result: 'error'});
    });

  }
});


// pwd validator
router.post('/register/validator_pwd', function(req, res) {
  let pwdCheck = validator.isByteLength(req.body.pwd, {min: 6, max: undefined});
  if(!pwdCheck){
    res.send({result: 'pwdFormatError'});
  } else {
    res.send({result: 'ok'});
  }
});


// send register
router.post('/register', function(req, res) {
  let user = new User({
    email: req.body.account,
    password: req.body.pwd,
    nickname: req.body.nickname,
  });

  let token = jwt.sign({id: user._id}, process.env.JWT_SECRET).toString();
  user.token = token;

  user.save().then((user) => {
    req.session.token = user.token;
    res.redirect('/');
  }).catch((error) => {
    console.log(error);
  });

});



// 登入
router.get('/login', function(req, res) {
  res.render('login', {
    title: '登入',
    auth: false,
  });
});

router.post('/login', function(req, res){
  User.find({email: req.body.email}).then((user)=> {
    // console.log(user);
    // console.log(req.body);
    if(!user[0]){
      res.send({result: 'noUser'});
    } else if (user[0] && req.body.password !== user[0].password) {
      res.send({result: 'pwdError'});
    } else if (user[0] && req.body.password == user[0].password) {
      req.session.token = user[0].token;
      res.send({result: 'success'});
    }
  }).catch((e) => {
    console.log(e);
  });
});


// 忘記密碼頁面
router.get('/password/new', function(req, res) {
  let error = req.flash('error');
  let email = req.flash('userEmail');
  res.render('newPassword', {
    error,
    email,
    auth: false,
  });
});


// 寄驗證信
router.post('/password/new', function(req, res, next) {
  let token;
  let host = req.headers.host;

  // 編碼
  crypto.randomBytes(20, function(err, buf) {
  token = buf.toString('hex');
  });

  // 設reset Token
  User.findOne({email: req.body.email}).then((user) => {
    if(!user) {
      req.flash('error', '沒有這帳號喔');
      req.flash('userEmail', req.body.email);
      return res.redirect('/user/password/new');
    }
    user.resetPwdToken = token;
    user.resetPwdExp = Date.now() + 3600000;

    user.save().then((user) => {
      // 寄信
      let sendContent = {
        from: '"👻 Titi " <chiasystem1@gmail.com>',
        to: user.email,
        subject: '✔ Hello! Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
       'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      'http://' + host + '/user/reset/' + token + '\n\n' +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      };

      sendMail(sendContent, (err, result) => {
        // console.log(err, result);
        // null 'done'
        if(err) {
          console.log(err);
          return res.redirect('/user/password/new');
        }

        res.redirect('/user/password/mail');
      });
    });
  });
});


// mail成功
router.get('/password/mail', (req, res) => {
  res.render('mailPwd', {
    title: '重設密碼',
    auth: false,
  });
});


// 點進郵件連結
router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPwdToken: req.params.token, resetPwdExp: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', '驗證無效或過期');
      return res.redirect('/user/password/new');
    }
    res.render('resetPwd', {
      title: '重設密碼',
      token: req.params.token,
      auth: false,
    });
  });
});



// 送出新密碼
router.post('/reset/:token', (req, res) => {
  User.findOneAndUpdate(
    {resetPwdToken: req.params.token},
    { $set:{password: req.body.pwd} },
    {new: true}
  ).then((user) => {
    req.session.token = user.token;
    res.redirect('/');
  });
});


// 登出
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/user/login');
});


module.exports = router;
