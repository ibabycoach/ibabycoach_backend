const mongoose = require('mongoose');

const babySchema = new mongoose.Schema({

  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  name: { type: String, default: '' },
  birthday: { type: String, default: '' },
  image: { type: String, default: '' },
  gender: {
    type: String,
    enum: ["0", "1", "2"],
    default: "", //  0 for girl, 1 for Boy, 2 for not specify
  },
}, 
  {timestamps: true });

module.exports = mongoose.model('baby', babySchema); 
