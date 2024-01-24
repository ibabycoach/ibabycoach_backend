const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema ({

    userId: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    name: {type: String },
    email: {type: String },
    phone: {type: String },
    message: {type: String },  
    deleted: {type: Boolean, default: false}, 
}, 
{timestamps: true});

module.exports = mongoose.model('contactUs', contactSchema);