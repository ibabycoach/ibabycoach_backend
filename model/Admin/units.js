const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({

  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  current_height_unit: {
    type: String,
    enum: ['in', 'cm'], 
    default: 'cm'
  },
  current_weight_unit: {
    type: String,
    enum: ['kg', 'lb'], 
    default: 'kg'
  },
  current__oz_unit: {type: String, default: '0'},
  current_headSize_unit: {
    type: String,
    enum: ['in', 'cm'], 
    default: 'cm'
  },
  deleted: {type: Boolean, default: false},
}, 
  {timestamps: true });

module.exports = mongoose.model('units', unitSchema); 