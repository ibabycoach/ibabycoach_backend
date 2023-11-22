let mongoose = require('mongoose')

const push_notification = new mongoose.Schema ({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    userId2: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    type: {type: Number},
    is_read: {type: Number},
    message: {type: String},
},
{ timestamps: true })

module.exports = mongoose.model('push_notification', push_notification);