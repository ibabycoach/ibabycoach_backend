let mongoose = require('mongoose')

const permissionSchema = new mongoose.Schema ({

    subadmin_name: { type: String, default: '' },
    email: { type: String, default: '' },
    password: { type: String, default: '' },
    image: { type: String, default: '' },

    activity_permission: {type: String,
        enum: ['1', '2', '3'],
        default: '1'
    },

    goal_permission:{type: String,
        enum: ['1', '2', '3'],
        default: '1'
    },

    deleted: {type: Boolean, default: false},

    status: { type: String,
     enum: ["0", "1"],
      default: "1"  }    //  1 for  Active , 0 for Inactive
    },
    
    {timestamps: true})

    module.exports = mongoose.model('permission', permissionSchema);