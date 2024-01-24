let mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema ({

    name: {type: String},
    price: {type: String},
    tenure: {type: String},
    status: {type: String, default: '1'},
    deleted: {type: Boolean, default: false},
    },
    
    {timestamps: true})

    module.exports = mongoose.model('subscriptions', subscriptionSchema);