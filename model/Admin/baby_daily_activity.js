const mongoose = require('mongoose');
const activity = require('./activity');

const babyDailyActivitySchema = new mongoose.Schema({

  userId: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
  babyId: {type: mongoose.Schema.Types.ObjectId, ref: "baby"},
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: "activity" },

  time: { type: Date, default: '' },
  started: { type: String, default: '' },
  duration: { type: String, default: '' },
  ended: { type: String, default: '' },
  day: { type: String, default: '' },
  image: { type: String, default: '' },
  status: {
    type: String,
    enum: ["0", "1"],
    default: "0", //  1 for  Active , 2 for Inactive
  },
}, 

  {timestamps: true });

module.exports = mongoose.model('dailyActivity', babyDailyActivitySchema); 