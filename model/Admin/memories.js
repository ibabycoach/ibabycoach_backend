const mongoose = require('mongoose');

const babymemories = new mongoose.Schema({

  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  babyId: {type: mongoose.Schema.Types.ObjectId, ref: "baby"},
  image: [
    {
      url: String,
    },
  ],

  // image: [{
  //   url:{ type : String}
  // }],

  note: { type: String, default: '' },
}, 
  {timestamps: true });

module.exports = mongoose.model('memories', babymemories); 