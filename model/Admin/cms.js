 const mongoose = require('mongoose')

 const cmsSchema = new mongoose.Schema ({

    title: {type: String, default: ''},
    description: {type: String, default: ''},
    role: {type: String, enum:["1", "2", "3"]}      // 1 for aboutus, 2 for privacy policy, 3 for terms & conditions
 },
    { timestamps: true});
 
    module.exports = mongoose.model('cms', cmsSchema);