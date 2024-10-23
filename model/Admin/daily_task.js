const mongoose = require('mongoose');

const dailytaskSchema = new mongoose.Schema({

  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  babyId: {type: mongoose.Schema.Types.ObjectId, ref: "baby", default: null},
  activityIds: { type: mongoose.Schema.Types.ObjectId, ref: "activity", default: null},
  is_diaper_dry: { type: String, default: ''},
  is_diaper_wet: { type: String, default: ''},
  is_hair_wash: {type: String, default: ''},
  amount: { type: String, default: '' },  
  amount_unit: { type: String, default: '' },  
  is_reaction: { type: String, default: '' },
  duration: { type: String, default: '' },
  start_time: { type: Date, default: Date.now },
  end_time: { type: Date },
  day: { type: String, default: '' },
  deleted: {type: Boolean, default: false},
  image: { type: String, default: '' },
  status: {type: String, default: "1", //  1 for  Active , 0 for Inactive
  },
}, 
  {timestamps: true });

module.exports = mongoose.model('dailytask', dailytaskSchema); 