var {User} = require('./../model/user_model.js');
const jwt = require('jsonwebtoken');

var authenticate = (req, res, next) => {
  if(req.session.token){
    let token = req.session.token;
    let id = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(id.id).then((user) => {
      req.id= id.id;
      req.nickname = user.nickname;
      req.token = token;
      next();
    }).catch((e) => {
      res.status(401).send();
    });
  } else {
    res.redirect('/user/register');
  }
};

module.exports = {authenticate};
