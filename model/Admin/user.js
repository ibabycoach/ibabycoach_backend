const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  babyId:{ type: mongoose.Schema.Types.ObjectId, ref: "baby", default: null},
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  password: { type: String, default: '' },
  phone: { type: Number, default: '' },
  image: { type: String, default: '' },
  country_code: {type: String, default: ''},
  relation: {type: String, default: ''},
  parentId :{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
  role: {
    type: String,
    enum: ["0", "1", "2", "3"],
    default: "1", // 0 for Admin, 1 for user, 2 for sub-user, 3 for sub_admin
  },
  status: {
    type: String,
    enum: ["1", "2"],
    default: "1", //  1 for  Active user, 2 for Inactive
  },
  device_token: {type: String, default: ''},
  device_type: {
    type: Number,
    enum: [1, 2, ], //1 for Android, 2 for IOS
    default: '',
  },
  social_id: {type: String, default: ""},
  google: {type: String},     //social login
  facebook: {type: String},   //social login
  apple: {type: String},      //social login
  socialtype: {type: String, enum: ["0", "1", "2", "3"]},
  otp:{type:Number, default:0},
  otpverify:{type:Number,default:0},
  forgotPasswordToken: {type: String},
  userData_Pdf: {type: String, default: ""},
  loginTime:{type: String},
  deleted: {type: Boolean, default: false},
  subscription_status: {type: String, default: '0'},
}, {
  timestamps: true, // Use 'timestamps' (plural) for automatic timestamp fields
});

module.exports = mongoose.model('User', userSchema); // It's a good practice to use a capital letter for model names
