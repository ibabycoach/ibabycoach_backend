const mongoose = require('mongoose');

const goalsSchema = new mongoose.Schema({
  name: {
    type: String
  },
  weeksdays: {
    type: String,
  },
  title: { type: String, default: '' },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  date: { type: String },

  status: {
    type: String,
    enum: ["1", "2"],
    default: "1", //  1 for  Active, 2 for Inactive
  },

},
  { timestamps: true });

module.exports = mongoose.model('goals', goalsSchema); 
