const mongoose = require('mongoose');

const goalsSchema = new mongoose.Schema({
  name: { type: String, default: ''},
  day: {type: String, default: ''},
  title: { type: String, default: '' },
  min_age: {type: String, default: ''},
  max_age: {type: String, default: ''},
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  date: { type: Date, default: '' },
  deleted: {type: Boolean, default: false},
  status: {
    type: String,
    enum: ["0", "1"],
    default: "1", //  1 for  Active, 0 for Inactive
  },

},
  { timestamps: true });

module.exports = mongoose.model('goals', goalsSchema); 
