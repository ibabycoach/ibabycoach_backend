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
    type: String,
    default: ''
  },

  status: {
    type: String,
    enum: ['1', '0'],
    default: 'active'
  },

  deleted: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('UserSubscription', userSubscriptionSchema);
