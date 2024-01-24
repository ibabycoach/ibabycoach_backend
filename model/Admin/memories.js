const mongoose = require('mongoose');

const babymemories = new mongoose.Schema({

  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  babyId: {type: mongoose.Schema.Types.ObjectId, ref: "baby"},
  date: {
    type: Date,
    default: Date.now
  },
  image: { type: String, default: '' },
  note: { type: String, default: '' },
  deleted: {type: Boolean, default: false},
}, 
  {timestamps: true });

module.exports = mongoose.model('memories', babymemories); 