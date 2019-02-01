var {User} = require('./../model/user_model.js');
const jwt = require('jsonwebtoken');


var authenticate = (req, res, next) => {
  console.log('session',req.session);
  if(req.session.token){
    let token = req.session.token;
    let id = jwt.verify(token, process.env.JWT_SECRET);
    console.log('id', id);
    User.findById(id.id).then((user) => {
      console.log('user', user);
      req.id= id.id;
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
