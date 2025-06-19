const mongoose = require('mongoose');

const userSubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  type: {
    type: String,
    enum: ['1', '2', '3'],
    required: true,
    default: '1',
    comment : 'free = 1 , plus = 2, premium = 3'
  },

  duration: {
    type: String,
    default: ''
  },

  start_date: {
    type: Date,
    default: null
  },

  end_date: {
    type: Date,
    default: null
  },

  expiry_time: {
    type: Date,
    default: 'null'
  },

  status: {
    type: String,
    enum: ['1', '0'],
    default: '1',
    comment : 'active = 1 , inactive = 0'
  },

  deleted: {
    type: Boolean,
    default: false
  },
  plan_type:{
    type:String,
    enum:['1','2'],
    default:'1',
    comment:'1 for Monthly , 2 for Yearly'
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('UserSubscription', userSubscriptionSchema);
