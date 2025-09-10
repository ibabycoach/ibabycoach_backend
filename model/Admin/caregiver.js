const mongoose = require('mongoose');

const caregiverSchema = new mongoose.Schema({

  caregiverId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  parentId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  babyId: {type: mongoose.Schema.Types.ObjectId, ref: "baby"},
  deleted: {type: Boolean, default: false},
}, 
  {timestamps: true });

module.exports = mongoose.model('caregiver', caregiverSchema); 