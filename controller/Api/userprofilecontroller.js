const user_model = require('../../model/Admin/user')
const baby_model = require('../../model/Admin/baby')
const activity_model = require('../../model/Admin/activity')
const reminderModel = require('../../model/Admin/reminder')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var secretCryptoKey = process.env.jwtSecretKey || "secret_iBabycoachs_@onlyF0r_JWT";
const nodemailer = require("nodemailer");

module.exports = {
 
  edit_profile: async(req, res)=> {
      try {
          const v = new Validator(req.body, {
              babyId: "required",
          });
          
          const errorResponse = await helper.checkValidation(v);
          if (errorResponse) {
              return helper.failed(res, errorResponse);
          }

          let userId = req.user._id;
          const userdata = await user_model.findByIdAndUpdate({_id: userId},
              {name: req.body.name,
              phone: req.body.phone,
              country_code: req.body.country_code});

              if (req.files && req.files.image) {
                var image = req.files.image;
              
                if (image) {
                  req.body.image = helper.imageUpload(image, "images");
                }
              }
              
              const babydata = await baby_model.findByIdAndUpdate({_id: req.body.babyId},
                {baby_name: req.body.baby_name,
                birthday: req.body.birthday,
                gender: req.body.gender,
                image: req.body.image});

              const findUpdatedUser = await user_model.findOne({_id: userId})
              const findUpdatedbaby = await baby_model.findOne({_id: req.body.babyId})
              
          return helper.success(res, "user details updated successfully", 
          { user_data: findUpdatedUser, 
            baby_data: findUpdatedbaby })

      } catch (error) {
          console.log(error)
      }
  },

  add_subuser: async(req, res)=> {
    try {
      let parentId = req.user._id;
      const v = new Validator(req.body, {
        name: "required",
        email: "required",
        password: "required",
        phone: "required",
        // relation: "required",
        // country_code: "required",
      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.failed(res, errorsResponse);
      }
  
      const isemailExist = await user_model.findOne({ email: req.body.email });
      if (isemailExist) {
        return helper.failed(res, "Email already exists");
      }
  
      const isphoneExist = await user_model.findOne({ phone: req.body.phone });
      
      if (isphoneExist) {
        return helper.failed(res, "Phone number already exists");
      }
      var Otp = 1111;
      // var Otp = Math.floor(1000 + Math.random() * 9000);
  
      let time = helper.unixTimestamp();
      req.body.loginTime = time;
      req.body.otp = Otp;
  
      let hash = await bcrypt.hash(req.body.password, 10);
  
      let userData = { 
        parentId: parentId,
        ...req.body, 
        password: hash 
      };
  
      if (req.user.role == 1) {
        // If the logged-in user has role:1, set babyId in userData
        const userBaby = await baby_model.findOne({ userId: parentId });

        if (userBaby) {
          userData.babyId = userBaby._id;
        } else {
          return helper.failed(res, "Parent user does not have a baby assigned");
        }
      }
  
      let addsubUser = await user_model.create(userData);
     
      return helper.success(res, "Sub-user added successfully", addsubUser);
  
    } catch (error) {
      console.log(error);
      return helper.error(res, "Error");
    }
  },
  
  subUser_list: async (req, res) => {
    try {
      const userId = req.user._id
      let sub_user_Data = await user_model.find({ parentId: userId}).sort({ createdAt: -1 }).populate("parentId", 'name')

      if (!sub_user_Data) {
        return helper.failed(res, "Sub-user not found");
      }

      return helper.success(res, 'Sub-user list', sub_user_Data);
    } catch (error) {
      console.log(error)
    }
  },

  admin_detail: async(req, res)=> {
    try {
      const userId = req.user._id;
      const adminData = await user_model.findOne({ role: 0});
  
      if (!adminData) {
        return helper.failed(res, "User not found");
      }
  
      return helper.success(res, "Admin profile", adminData );
    } catch (error) {
      console.log(error);
      return helper.error(res, "Error");
    }
  },

  switch_user_account: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        userId: "required"
      });
      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, errorResponse);
      }
      const userdata = await user_model.findById({ _id: req.body.userId });

      let userBaby;
      if (userdata.role == 2) {
        const parentId = userdata.parentId;
        userBaby = await baby_model.findOne({ userId: parentId });
      } else {
        userBaby = await baby_model.findOne({ userId: req.body.userId });
      }
       
      return helper.success(res, "User details", { userdata, userBaby });
    } catch (error) {
      return helper.failed(res, "Something went wrong");
    }
  },

  profile: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        babyId: "required",
      });
      
      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
          return helper.failed(res, errorResponse);
      }
      const userId = req.user._id;
      const userprofile = await user_model.findOne({ _id: userId });

      if (!userprofile) {
          return helper.failed(res, "User not found");
      }

      let userBaby;
      if (req.body.babyId) { // Check if babyId is provided in req.body
          userBaby = await baby_model.findById({_id: req.body.babyId });
      } else {
          if (req.user.role == 2) {
              const parentId = req.user.parentId;
              userBaby = await baby_model.findById({_id: req.body.babyId });
          } else {
              userBaby = await baby_model.findById({_id: req.body.babyId });
          }
      }
      if (!userBaby) {
          return helper.failed(res, "No baby found");
      }
      // Fetch reminder status from the reminderModel for the userBaby
      const reminderStatus = await reminderModel.find({ babyId: userBaby._id });
      
      let statusValue;
      if (reminderStatus.length === 0) {
          statusValue = null; // No data for this baby
      } else {
          const anyStatusOne = reminderStatus.some(status => status.status === 1);
          statusValue = anyStatusOne ? 1 : 0;
      }

      return helper.success(res, "User profile", { userprofile, userBaby, reminderStatus: statusValue });
    } catch (error) {
      console.log(error);
      return helper.error(res, "Error");
    }
  },



}