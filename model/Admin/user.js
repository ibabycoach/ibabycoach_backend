const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  password: { type: String, default: '' },
  phone: { type: Number, default: '' },
  image: { type: String, default: '' },
  role: {
    type: String,
    enum: ["0", "1"],
    default: "1", // 0 for Admin, 1 for user
  },
  status: {
    type: String,
    enum: ["1", "2"],
    default: "1", //  1 for  Active user, 2 for Inactive
  },
  google: {type: String},     //social login
  facebook: {type: String},  //social login
  apple: {type: String},     //social login
  socialtype: {type: String, enum: ["0", "1", "2", "3"]},
  otp:{type:Number},
  otpverify:{type:Number,default:0},
  forgotPasswordToken: {type: String},
  loginTime:{type: String},
  
}, {
  timestamps: true, // Use 'timestamps' (plural) for automatic timestamp fields
});

module.exports = mongoose.model('User', userSchema); // It's a good practice to use a capital letter for model names
