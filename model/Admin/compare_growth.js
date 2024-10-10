const mongoose = require('mongoose');

const compareGrowthSchema = new mongoose.Schema({

  start_duration: { type: String, default: '' },
  start_duration_type: { type: String, default: '' },
  end_duration: { type: String, default: '' },
  end_duration_type: { type: String, default: '' },
  height: { type: String, default: '0' },
  weight: { type: String, default: '0' },
  headSize: { type: String, default: '0' },

//   height_unit: {
//     type: String,
//     enum: ['in', 'cm'], 
//     default: 'in'
//   },
//   weight_unit: {
//     type: String,
//     enum: ['kg', 'lb, oz'], 
//     default: 'lb, oz'
//   },
//   headSize_unit: {
//     type: String,
//     enum: ['in', 'cm'], 
//     default: 'in'
//   }, 
  deleted: {type: Boolean, default: false},
}, 
  {timestamps: true });

module.exports = mongoose.model('compareGrowth', compareGrowthSchema); 
