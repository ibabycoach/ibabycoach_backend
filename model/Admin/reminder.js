const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({

  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  babyId: {type: mongoose.Schema.Types.ObjectId, ref: "baby", default: null},
  activityIds: {type: mongoose.Schema.Types.ObjectId, ref: "activity",  default: null}, 
  time: { type: Date, default: Date.now },  //  Reminder start time 
  duration: {type: String, default: ''},    // time b\w start and next reminder, in hrs or days
  duration_type: {
    type: String,
    enum: ['hours', 'days', 'weeks', 'months', 'years'],
    default: 'hours' // Set the default duration type
},
  status: { type: Number, default: "1"},    //  1 for  Active , 0 for Inactive
  deleted: {type: Boolean, default: false},
}, 

  {timestamps: true });

module.exports = mongoose.model('reminder', reminderSchema); 