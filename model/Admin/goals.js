const mongoose = require('mongoose');

const goalsSchema = new mongoose.Schema({
  name: { type: String},
  weeksdays: {type: String},
  title: { type: String, default: '' },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  date: { type: Date, default: '' },

  status: {
    type: String,
    enum: ["0", "1"],
    default: "1", //  1 for  Active, 0 for Inactive
  },

},
  { timestamps: true });

module.exports = mongoose.model('goals', goalsSchema); 
