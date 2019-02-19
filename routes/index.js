var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const {mongoose} =  require('../model/connect.js');
const {Message} = require('../model/message_model.js');
const {User} = require('../model/user_model.js');
const {authenticate} = require('../middleware/authenticate.js');

router.use(authenticate);

/* GET home page. */
router.get('/', function(req, res, next) {
  let auth = req.token;
  let id = req.id;
  // console.log('req id', req.id);
  Message.find({_creator: id}).then((data) => {
    data.reverse();
    // console.log(data);
    res.render('index', {
    title: '我的小世界',
    message: data,
    auth: auth,
    });
  }).catch((e) => {
    // console.log(e);
    next(e);
  });
});


// 新增 message
router.post('/', function(req, res, next){
  // console.log(req.body);
  let time = new Date().getTime();
  let message = new Message({
    text: req.body.message,
    time: time,
    _creator: req.id,
  });

  message.save().then((doc) => {
    // console.log('doc',doc);
    res.send(doc);
  }, (e)=> {
    // res.send(e);
    // console.log(e);
    next(e);

  });
});

// 刪除message
router.delete('/message/delete', function(req, res){
  // console.log(req.body);
  Message.findOneAndDelete({_id: req.body.id}).then((msg)=> {
    // console.log(msg);
    Message.find({_creator: msg._creator}).then((data) => {
      res.send(data);
      // console.log(data);
    });
  }).catch((e)=> {
    res.status(404).send();
  });
});


// 修改message
router.patch('/patch/message', (req, res)=> {
  // console.log(req.body);
  Message.findOneAndUpdate(
    {_id: req.body.id},
    {
      $set: {
      text: req.body.text,
      time: new Date().getTime()
      },
    },
    {new:true}
  ).then((message)=> {
    res.send(message);
  }).catch((e)=> {
    res.status(400).send();
  });
});



// 個人專區
router.get('/user/profile', (req, res) => {
  User.findOne({token: req.session.token}).then((user) => {
    res.render('userPage', {
      title: '個人專區',
      auth: req.session.token,
      nickname: user.nickname || '' ,
      img: user.userImg || '/images/kitty.svg',
      });
  });
});

// 暱稱
router.post('/user/nickname', (req, res) => {
  console.log(req.body);
  let nick = req.body.nickname;
  let token = req.session.token;
  // console.log('nick', nick, 'token', token);
  User.findOneAndUpdate({token},
    {$set: {
    nickname: nick,
  }}, {new: true}).then(() => {
    res.send({res: 'nickname save'});
  })
});



// 上傳圖片
let storage = multer.diskStorage({
  destination: (req, file, cb)=> {
    cb(null, './public/uploadImgs');
  },
  filename: (req, file, cb)=> {
    cb(null, Date.now()+ file.originalname);
  }
});

let upload = multer({
  storage: storage,
  limits: {fileSize: 10000}
});


router.post('/user/picture', (req, res, next)=> {
  let uploadSingle = upload.single('file');
  uploadSingle(req, res, function(err) {
    if(err && err.message == 'File too large'){
      console.log(err.message);
      return res.send({code: 200, msg: err.message})
    } else {
      next();
    }
  })
}, (req, res) => {
  if(!req.file){
    console.log('nothing');
    return res.send({code: 200, msg: 'no picture'})
  }
  // console.log(req.file);
  let url = '/uploadImgs/' + req.file.filename;
  User.findOneAndUpdate({token: req.session.token}, {
    $set: {userImg: url}
  },{new: true}).then((user) => {
    // console.log(user);
    res.send({
      code: 200,
      data: url,
    })
  });
});





module.exports = router;


