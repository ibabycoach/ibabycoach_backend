 const mongoose = require('mongoose')

const routineSchema = new mongoose.Schema ({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
  babyId: {type: mongoose.Schema.Types.ObjectId, ref: "baby"},
  activityIds: { type: mongoose.Schema.Types.ObjectId, ref: "activity", default:null},  
  day:  {type:String, default: ''} ,
  time: {type: String, default: ''},
  status: {type: String, default: '1'},
  routine_type: {type: String,
    enum: ["1", "2"],
    default: "1", //  1 = use activity by admin  , 2 = customized activity by user
  },
  deleted: {type: Boolean, default: false},
},
  {timestamps: true});

module.exports = mongoose.model('routine', routineSchema);

