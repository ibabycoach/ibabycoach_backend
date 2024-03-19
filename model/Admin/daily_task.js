const mongoose = require('mongoose');

const dailytaskSchema = new mongoose.Schema({

  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  babyId: {type: mongoose.Schema.Types.ObjectId, ref: "baby", default: null},
  activityIds: { type: mongoose.Schema.Types.ObjectId, ref: "activity", default: null},
  breast_feeding: {type: String, default: ''},
  diaper: {
    type: String,
    enum: ["dry", "wet", "none"], // "1" for wet, "2" for dry, "0" for none
    default: "none"
  },
  bottle: { type: String, default: '' },  
  duration: { type: String, default: '' },
  start_time: { type: Date, default: Date.now },
  end_time: { type: Date },
  task_type: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6], // 1 for breastfeed, 2 for bottle, 3 for diaper, 4 for sleeping, 5 for bathing, 6 for others
    default: 0
  },
  day: { type: String, default: '' },
  image: { type: String, default: '' },
  status: {type: String, default: "1", //  1 for  Active , 0 for Inactive
  },
}, 

  {timestamps: true });

module.exports = mongoose.model('dailytask', dailytaskSchema); 