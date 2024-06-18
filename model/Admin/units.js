const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({

  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  current_height_unit: {
    type: String,
    enum: ['in', 'cm'], 
    default: 'in'
  },
  current_weight_unit: {
    type: String,
    enum: ['kg', 'lb'], 
    default: 'lb'
  },
  current_headSize_unit: {
    type: String,
    enum: ['in', 'cm'], 
    default: 'in'
  },
  deleted: {type: Boolean, default: false},
}, 
  {timestamps: true });

module.exports = mongoose.model('units', unitSchema); 