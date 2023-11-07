const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({

  baby: {type: mongoose.Schema.Types.ObjectId, ref: "baby"},
  feeding: { type: String, default: '' },
  sleeping: { type: String, default: '' },
  image: { type: String, default: '' },
  played: {type: String, default: ''},

}, 

  {timestamps: true });

module.exports = mongoose.model('activity', activitySchema); 