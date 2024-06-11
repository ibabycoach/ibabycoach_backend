const mongoose = require('mongoose');

const iconSchema = new mongoose.Schema({

  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  babyId: {type: mongoose.Schema.Types.ObjectId, ref: "baby"},
  image: {type: String, default: '' },
  bg_color: {type: String, default: ''},
  status: {type: String, default: "1"},  //  1 for  Active , 0 for Inactive
  deleted: {type: Boolean, default: false},
}, 
  {timestamps: true });

module.exports = mongoose.model('icon', iconSchema); 