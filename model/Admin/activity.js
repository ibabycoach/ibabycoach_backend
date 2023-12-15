const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({

  userId: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
  babyId: {type: mongoose.Schema.Types.ObjectId, ref: "baby"},
  
  activity_name: { type: String, default: '' },
  time: { type: String, default: '' },
  day: { type: String, default: '' },
  image: { type: String, default: '' },
  status: {
    type: String,
    enum: ["1", "2"],
    default: "1", //  1 for  Active , 2 for Inactive
  },
}, 

  {timestamps: true });

module.exports = mongoose.model('activity', activitySchema); 