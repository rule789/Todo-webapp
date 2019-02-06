const mongoose = require('mongoose');

const newMessageSchema = new mongoose.Schema({
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
  },
});


let newMessage = mongoose.model('newMessage', newMessageSchema);

module.exports = {newMessage};