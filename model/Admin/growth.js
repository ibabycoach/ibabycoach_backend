const mongoose = require('mongoose');

const growthSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  babyId: {type: mongoose.Schema.Types.ObjectId, ref: "baby"},
  time: { type: Date, default: '' },

  height_in_inch: { type: String, default: '' },
  height_in_cm: { type: String, default: '' },
  height_difference_in_inch: { type: String, default: '' },
  height_difference_in_cm: { type: String, default: '' },

  weight_in_kg: { type: String, default: '' },
  weight_in_lbs: { type: String, default: '' },
  weight_difference_in_lbs: { type: String, default: '' },
  weight_difference_in_kg: { type: String, default: '' },

  headSize_in_inch: { type: String, default: '' },
  headSize_in_cm: { type: String, default: '' },
  headSize_difference_in_inch: { type: String, default: '' },
  headSize_difference_in_cm: { type: String, default: '' },


  // height: { type: String, default: '0' },
  // weight: { type: String, default: '0' },
  // oz: { type: String, default: '0' },
  // headSize: { type: String, default: '0' },
  // height_unit: {
  //   type: String,
  //   enum: ['in', 'cm'], 
  //   default: 'in'
  // },
  // weight_unit: {
  //   type: String,
  //   enum: ['kg', 'lb, oz', 'lbs'], 
  //   default: 'lbs'
  // },
  // oz_unit: {type: String, default: '0'},
  // headSize_unit: {
  //   type: String,
  //   enum: ['in', 'cm'], 
  //   default: 'in'
  // },
  // lastHeight: { type: String, default: '0' },
  // lastWeight: { type: String, default: '0' },
  // last_oz: { type: String, default: '0' },
  // lastHeadSize: { type: String, default: '0' },

  // lastHeight_unit: { type: String, default: '0' },
  // lastWeight_unit: { type: String, default: '0' },
  // lastHeadSize_unit: { type: String, default: '0' },

  // image: { type: String, default: '' },
 
  deleted: {type: Boolean, default: false},
}, 
  {timestamps: true });

module.exports = mongoose.model('growth', growthSchema); 
