const mongoose = require('mongoose');

const babySchema = new mongoose.Schema({

  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  caregiverId: {type: mongoose.Schema.Types.ObjectId, ref: "User", defailt:null},
  baby_name: { type: String, default: '' },
  birthday: { type: Date, default: '' },
  age: { type: String, default: '' },
  bg_color: {type: String, default: ''},
  image: { type: String, default: '' },
  gender: {
    type: String,
    enum: ["0", "1", "2"],
    default: "", //  0 for girl, 1 for Boy, 2 for not specify
  },
  deleted: {type: Boolean, default: false},
}, 
  {timestamps: true });

module.exports = mongoose.model('baby', babySchema); 
