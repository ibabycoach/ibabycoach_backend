const mongoose = require('mongoose');

const dailytaskSchema = new mongoose.Schema({

  userId: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
  babyId: {type: mongoose.Schema.Types.ObjectId, ref: "baby"},
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: "activity" },
  subuserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

  time: { type: Date, default: '' },
  started: { type: String, default: '' },
  duration: { type: String, default: '' },
  ended: { type: String, default: '' },
  day: { type: String, default: '' },
  image: { type: String, default: '' },
  // status: {type: String,
  //   enum: ["0", "1"],
  //   default: "1", //  1 for  Active , 0 for Inactive
  // },
}, 

  {timestamps: true });

module.exports = mongoose.model('dailytask', dailytaskSchema); 