const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({

  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  babyId: {type: mongoose.Schema.Types.ObjectId, ref: "baby"},
  activity_name: { type: String, default: '' },
  time: { type: Date, default: Date.now },  
  upcoming_time: { type: Date, default: '' },
  duration: {type: String, default: '0'}, 
  day: { type: String, default: '' },
  image: { type: String, default: '' },
  bg_color: {type: String, default: ''},
  amount: { type: String, default: '' },
  activity_type: {type: String,
    enum: ["1", "2"],
    default: "1", //  1 for  by admin , 2 for by user
  },
  duration_type: {
    type: String,
    enum: ['hours', 'days', 'weeks', 'months', 'years'],
    default: 'hours' // Set the default duration type
},
    status: { type: String,
    enum: ["0", "1"],
    default: "1", //  1 for  Active , 0 for Inactive
  },
  deleted: {type: Boolean, default: false},
}, 

  {timestamps: true });

module.exports = mongoose.model('activity', activitySchema); 