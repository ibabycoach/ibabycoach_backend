const mongoose = require('mongoose');

const compareGrowthSchema = new mongoose.Schema({

  start_duration: { type: String, default: '0' },
  start_duration_type: { type: String, default: '' }, //1 for week, 2 for month, 3 for year
  end_duration: { type: String, default: '' },
  end_duration_type: { type: String, default: '' },  //1 for week, 2 for month, 3 for year
  total_duration_weeks: { type: String, default: '' },
  height_in_inch: { type: String, default: '' },
  height_in_cm: { type: String, default: '' },
  weight_in_kg: { type: String, default: '' },
  weight_in_lbs: { type: String, default: '' },
  headSize_in_inch: { type: String, default: '' },
  headSize_in_cm: { type: String, default: '' },

  health_type: { type: String, default: '' },

  height_unit: {
    type: String,
    enum: ['in', 'cm'], 
    default: 'in'
  },
  weight_unit: {
    type: String,
    enum: ['kg', 'lb'], 
    default: 'lb'
  },
  headSize_unit: {
    type: String,
    enum: ['in', 'cm'], 
    default: 'in'
  }, 

  deleted: {type: Boolean, default: false},
}, 
  {timestamps: true });

module.exports = mongoose.model('compareGrowth', compareGrowthSchema); 
