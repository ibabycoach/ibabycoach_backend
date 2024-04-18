const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({

  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  babyId: {type: mongoose.Schema.Types.ObjectId, ref: "baby"},
  
  activity_name: { type: String, default: '' },
  time: { type: String, default: '' },
  day: { type: String, default: '' },
  image: { type: String, default: '' },
  bg_color: {type: String, default: ''},
  activity_type: {type: String,
    enum: ["1", "2"],
    default: "1", //  1 for  by admin , 2 for by user
  },
  include_day_time: {type: String, 
    enum: ["0", "1"],
    default: "0"},
    status: { type: String,
    enum: ["0", "1"],
    default: "1", //  1 for  Active , 0 for Inactive
  },
  deleted: {type: Boolean, default: false},
}, 

  {timestamps: true });

module.exports = mongoose.model('activity', activitySchema); 