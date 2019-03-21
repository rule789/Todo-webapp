var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const async = require('async');
const {mongoose} =  require('../model/connect.js');
const {newMessage} = require('../model/newMsg_model.js');
const {User} = require('../model/user_model.js');
const {authenticate} = require('../middleware/authenticate.js');



router.get('/', (req, res) => {
  // read all msg
  newMessage.find().then((msg) => {
    console.log(msg.length);
    if(msg.length !== 0){
      let dataAll = [];
      let dataLength = msg.length;

      msg.forEach((msg) => {
        User.findOne({_id: msg._creator}).then((user)=> {
          dataAll.push({
            nickname: user.nickname,
            msg: msg,
          });

          // sort by time
          if(dataAll.length === dataLength){
            dataAll = dataAll.sort(function(x, y){
            return x.msg.time < y.msg.time ? 1:-1;
            });
            res.render('message', {
              title: '留言板',
              message: dataAll,
              auth: req.session.token || false,
            });
          }
        });
      });
    } else {
      res.render('message', {
        title: '留言板',
        message: [],
        auth: req.session.token || false,
      });
    }

  }).catch((e) => {
    console.log(e);
  });
});



router.post('/', authenticate, (req, res) => {
  let time = new Date().getTime();
  let newMsg = new newMessage({
    text: req.body.message,
    time: time,
    _creator: req.id,
  });

  newMsg.save().then((doc) => {
    res.send({
      nickname: req.nickname,
      _id: req.id
    });
  });
});



module.exports = router;
