const mongoose = require('mongoose');

const babySchema = new mongoose.Schema({

  user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  name: { type: String, default: '' },
  birthday: { type: String, default: '' },
  image: { type: String, default: '' },
  gender: { type: String, default: '' },
}, 
  {timestamps: true });

module.exports = mongoose.model('baby', babySchema); 
