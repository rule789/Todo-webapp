var env = process.env.NODE_ENV || 'development';
// console.log(env);

if(env === 'development' || env === 'test' ) {
  let config = require('./config.json');
  let envConfig = config[env];
  // console.log(envConfig);
  // { PORT: 3000,
  // MONGODB_URI: 'mongodb://127.0.0.1:27017/MessageTest' }
  // console.log(envConfig);
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}



// var env = process.env.NODE_ENV || 'development';

// if (env === 'development') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = ' mongodb://127.0.0.1:27017/MessageBoard';
// } else if (env === 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = ' mongodb://127.0.0.1:27017/MessageTest';
// }