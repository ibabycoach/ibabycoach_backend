const mongoose = require('mongoose');

const growthSchema = new mongoose.Schema({

  user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  babyname: {type: mongoose.Schema.Types.ObjectId, ref: "baby"},
  age: { type: String, default: '' },
  height: { type: String, default: '' },
  weight: { type: String, default: '' },
 
}, 
  {timestamps: true });

module.exports = mongoose.model('growth', growthSchema); 
