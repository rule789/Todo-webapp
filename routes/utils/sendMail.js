const nodemailer = require('nodemailer');
const crypto = require('crypto');
const async = require('async');

// console.log('sendMail');

let sendMail = (sendContent, callback) => {
  // console.log(token, user, host);

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EmailAcc,
      pass: process.env.EmailPwd
    }
  });

  let mailOptions = {
    from: sendContent.from,
    to: sendContent.to,
    subject: sendContent.subject,
    text: sendContent.text,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    // console.log(info);

    // { accepted: [ 'ganew12345@gmail.com' ],
    // rejected: [],
    // envelopeTime: 610,
    // messageTime: 825,
    // messageSize: 730,
    // response: '250 2.0.0 OK 1547876319 n22sm13773593pfh.166 - gsmtp',
    // envelope:
    //  { from: 'chiasystem1@gmail.com',
    //    to: [ 'ganew12345@gmail.com' ] },
    // messageId: '<448c9472-c61d-bbf7-ea54-5bedd3a71e73@gmail.com>' }

    callback(err, 'done');
  });
}


module.exports = {sendMail};

