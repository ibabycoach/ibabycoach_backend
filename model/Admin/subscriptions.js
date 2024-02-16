let mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema ({

    name: {type: String, default: ''},
    price: {type: String, default: ''},
    tenure: {type: String, default: ''},
    deleted: {type: Boolean, default: false},
    status: { type: String,
     enum: ["0", "1"],
      default: "1"  }    //  1 for  Active , 0 for Inactive
    },
    
    {timestamps: true})

    module.exports = mongoose.model('subscriptions', subscriptionSchema);