let mongoose = require('mongoose')

const subAdminSchema = new mongoose.Schema ({

    adminId :{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
    usersId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
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
    chat: {type: String,
        enum: ['1', '2'],
        default: '1'
    },

    deleted: {type: Boolean, default: false},

    status: { type: String,
     enum: ["0", "1"],
      default: "1"  }    //  1 for  Active , 0 for Inactive
    },
    
    {timestamps: true})

    module.exports = mongoose.model('subAdmin', subAdminSchema);