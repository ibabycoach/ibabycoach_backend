const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({

  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  babyId: {type: mongoose.Schema.Types.ObjectId, ref: "baby", default: null},
  activityId: {type: mongoose.Schema.Types.ObjectId, ref: "activity",  default: null}, 
  time: { type: String, default: '' },
  status: { type: String,
    enum: ["0", "1"],
    default: "1", //  1 for  Active , 0 for Inactive
  },
  deleted: {type: Boolean, default: false},
}, 

  {timestamps: true });

module.exports = mongoose.model('reminder', reminderSchema); 