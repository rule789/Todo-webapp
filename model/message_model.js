const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  text: {
    required: true,
    type: String,
    minlength: 1,
    trim: true
  },
  time: {
    required: true,
    type: Number,
  },
  _creator: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  }
});


let Message = mongoose.model('Message', MessageSchema);

module.exports = {Message};