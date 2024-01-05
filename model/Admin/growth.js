const mongoose = require('mongoose');

const growthSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  babyId: {type: mongoose.Schema.Types.ObjectId, ref: "baby"},
  age: { type: String, default: '' },
  time: { type: Date, default: '' },
  height: { type: String, default: '' },
  weight: { type: String, default: '' },
  birthDate: {type: String, default: ''},
  gender: {type: Number, default: ''},
  image: { type: String, default: '' },
  headSize: { type: String, default: '' },
}, 
  {timestamps: true });

module.exports = mongoose.model('growth', growthSchema); 
