const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({

  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  height_unit: {
    type: String,
    enum: ['inches', 'cm'], 
    default: 'inches'
  },
  weight_unit: {
    type: String,
    enum: ['kg', 'pound'], 
    default: 'pound'
  },
  headSize_unit: {
    type: String,
    enum: ['inches', 'cm'], 
    default: 'inches'
  },
  deleted: {type: Boolean, default: false},
}, 
  {timestamps: true });

module.exports = mongoose.model('units', unitSchema); 