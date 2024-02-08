const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema ({

    userId: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    name: {type: String, default: '' },
    email: {type: String, default: '' },
    phone: {type: String, default: ''},
    message: {type: String, default: ''}, 
    country_code: {type: String, default: ''},
    deleted: {type: Boolean, default: false}, 
}, 
{timestamps: true});

module.exports = mongoose.model('contactUs', contactSchema);