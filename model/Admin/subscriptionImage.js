let mongoose = require('mongoose')

const subscriptionImageSchema = new mongoose.Schema ({

    image: {type: String, default: ''},
    description: {type: String, default: ''},
    type: {type: Number, default: 0},
    deleted: {type: Boolean, default: false},
},
    {timestamps: true})

    module.exports = mongoose.model('subscriptionImage', subscriptionImageSchema);