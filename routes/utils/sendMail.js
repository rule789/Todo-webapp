const nodemailer = require('nodemailer');
const crypto = require('crypto');
const async = require('async');


let sendMail = (sendContent, callback) => {
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
    callback(err, 'done');
  });
}


module.exports = {sendMail};

