var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const async = require('async');
const {mongoose} =  require('../model/connect.js');
const {newMessage} = require('../model/newMsg_model.js');
const {User} = require('../model/user_model.js');
const {authenticate} = require('../middleware/authenticate.js');


// let createUser = function(id){
//   return new Promise((resolve, reject) => {
//     User.findOne({_id: id}, function(err, user){
//       resolve(user);
//     });
//   });
// }

router.get('/', (req, res) => {
  let dataAll = [];
  // read all msg
  newMessage.find().then((data) => {
    var dataLength = data.length;
    // find each msg's nickname
    async.each(data, function(msg, err){
      User.findOne({_id: msg._creator}).then((user)=> {
        // 組合
        dataAll.push({
          nickname: user.nickname,
          msg: msg,
        });
        if( dataAll.length == dataLength ){
          // 時間排序
          dataAll = dataAll.sort(function(x, y){
            return x.msg.time < y.msg.time ? 1:-1;
          });

        // console.log(dataAll);
          res.render('message', {
            title: '留言板',
            // nickname:
            message: dataAll,
            auth: req.session.token || false,
          });
        }
      })
    });
  });

});

router.post('/', authenticate, (req, res) => {
  // console.log(req.body, req.id, req.nick);
  // console.log(req.nickname);
  let time = new Date().getTime();
  let newMsg = new newMessage({
    text: req.body.message,
    time: time,
    _creator: req.id,
  });

  newMsg.save().then((doc) => {
    // console.log('doc',doc);
    // res.send(doc);
  // }, (e)=> {
    // res.send(e);
    // console.log(e);
    // next(e);
    res.send({
      nickname: req.nickname,
      _id: req.id
    });
  });
});



module.exports = router;