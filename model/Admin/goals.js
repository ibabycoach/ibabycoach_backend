const mongoose = require('mongoose');

const goalsSchema = new mongoose.Schema({

  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  babyId: {type: mongoose.Schema.Types.ObjectId, ref: "baby"},
  image: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  date: { type: String},
  status: {
    type: String,
    enum: ["1", "2"],
    default: "1", //  1 for  Active, 2 for Inactive
  },
 
}, 
  {timestamps: true });

module.exports = mongoose.model('goals', goalsSchema); 
