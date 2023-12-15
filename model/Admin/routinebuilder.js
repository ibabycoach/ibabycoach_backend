 const mongoose = require('mongoose')

 const routineSchema = new mongoose.Schema ({

    activityId: { type: mongoose.Schema.Types.ObjectId, ref: "activity", default:null},  
    day: {type: String, default: ''},
    time: {type: String, default: ''},
    status: {type: String, default: '1'}
 },
    {timestamps: true});

 module.exports = mongoose.model('routine', routineSchema);

