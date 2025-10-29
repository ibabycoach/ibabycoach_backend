let mongoose = require('mongoose')

const push_notification = new mongoose.Schema ({
    senderId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    receiverId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    message: {type: String, default: ''},
    type: {type: Number, default: 0},
    is_read: {type: Number, default: 0},
    is_deleted: {type: Number, default: 0},
    status: {type: Number,
        enum: [0, 1],
        default: 1},
},
{ timestamps: true })

module.exports = mongoose.model('push_notification', push_notification);