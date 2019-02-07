require('./model/config.js');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const sass = require('node-sass');
const sassMiddleware = require('node-sass-middleware');
const session = require('express-session');
const flash = require('connect-flash');
const jwt = require('jsonwebtoken');
const engine = require('ejs-locals');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var opinionRouter = require('./routes/opinion');
var messageRouter = require('./routes/message');
const {authenticate} = require('./middleware/authenticate.js');

var app = express();

// view engine setup
app.engine('ejs',engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'msg',
  resave: true,
  saveUninitialized: true,
  cookie: {}
}));
app.use(flash());
app.use(sassMiddleware({
  src: __dirname + '/public/stylesheets/scss', //where the sass files are
  dest: __dirname + '/public/stylesheets/css',
  // indentedSyntax : false,
  prefix:  '/stylesheets/css',
  debug: true,
  // outputStyle: 'compressed'
}));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/user', usersRouter);
app.use('/message', messageRouter);
app.use('/opinion', opinionRouter);
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  // render the error page
  res.status(err.status || 500);
  res.render('error', {title: '出現問題', auth: req.session.token || false});

  console.log([err.message, err.status, err.stack]);
  console.log(err);
});




module.exports = app;
