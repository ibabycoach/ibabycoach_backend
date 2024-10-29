const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({

  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  babyId: {type: mongoose.Schema.Types.ObjectId, ref: "baby", default: null},
  activityIds: {type: mongoose.Schema.Types.ObjectId, ref: "activity",  default: null}, 
  time: { type: Date, default: Date.now },  //  Reminder start time 
  upcoming_time: { type: Date, default: '' },
  duration: {type: String, default: '0'},    // time b\w start and next reminder, in hrs or days
  duration_type: {
    type: String,
    enum: ['hours', 'days', 'weeks', 'months', 'years'],
    default: 'hours' // Set the default duration type
},
  reminder_type: {type: String, default: "1"},  // 1 for basic, 2 for advance
  status: { type: Number, 
    enum: [0, 1],
    default: "1"},    //  1 for  Active , 0 for Inactive
  deleted: {type: Boolean, default: false},
}, 

  {timestamps: true });

module.exports = mongoose.model('reminder', reminderSchema); 