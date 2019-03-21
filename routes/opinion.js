var express = require('express');
var router = express.Router();
const {sendMail} = require('./utils/sendMail.js');

router.get('/', (req, res) => {
  res.render('opinionPage', {
    title: '我有意見',
    auth: req.session.token || false,
  });
});


router.post('/', (req, res) => {
  let sendContent = {
    from: `${req.body.name} <${req.body.email}>`,
    to: '"Titi " <chiasystem1@gmail.com>',
    subject: `${req.body.name} 留言給你`,
    text: `Email address: \n${req.body.email}   \n\n留言內容: \n${req.body.opinion}`,
  };
  sendMail(sendContent, (err, result) => {
    if(err){
      return res.send('留言失敗');
    }
    res.send('留言成功');
  });
});

module.exports = router;