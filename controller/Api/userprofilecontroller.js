const user_model = require('../../model/Admin/user')
const baby_model = require('../../model/Admin/baby')
const caregiverModel = require('../../model/Admin/caregiver')
const reminderModel = require('../../model/Admin/reminder')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var secretCryptoKey = process.env.jwtSecretKey || "secret_iBabycoachs_@onlyF0r_JWT";
const nodemailer = require("nodemailer");
const userSubscriptionModel = require('../../model/Admin/user_subscriptions');

module.exports = {

  edit_profile: async(req, res)=> {
      try {

          if (req.files && req.files.image) {
            var image = req.files.image;

            if (image) {
              req.body.image = helper.imageUpload(image, "images");
            }
          }

          let userId = req.user._id;
          const userdata = await user_model.findByIdAndUpdate({_id: userId},
              {name: req.body.name,
              phone: req.body.phone,
              country_code: req.body.country_code,
              image: req.body.image});

              const findUpdatedUser = await user_model.findOne({_id: userId})

          return helper.success(res, "user details updated successfully",
          { user_data: findUpdatedUser})

      } catch (error) {
          console.log(error)
      }
  },

  // add_subuser: async(req, res)=> {
  //   try {
  //     let parentId = req.user._id;
  //     let parentImg = req.user.image;
  //     const v = new Validator(req.body, {
  //       name: "required",
  //       email: "required",
  //       // password: "required",
  //       // phone: "required"
  //     });
  //     let errorsResponse = await helper.checkValidation(v);
  //     if (errorsResponse) {
  //       return helper.failed(res, errorsResponse);
  //     }

  //     const userBaby = await baby_model.findOne({ userId: parentId });

  //     const isemailExist = await user_model.findOne({ email: req.body.email,  });
  //     if (isemailExist) {
  //         const caregiverExists = await caregiverModel.findOne({
  //           parentId: parentId,
  //           caregiverId: isemailExist._id,
  //           deleted:false
  //         })
  //         .populate('parentId', 'name image relation')
  //         .populate('caregiverId', 'name image relation')
  //         .populate('babyId', 'baby_name birthday age image gender')

  //       if (caregiverExists) {
  //         return helper.success( res, "Caregiver already exists and is already assigned to your baby", caregiverExists);
  //       }
        
  //       if (userBaby != null) {
  //         // ✅ create caregiver entry if not already linked
  //           const caregiverExists = await caregiverModel.create({
  //             parentId: parentId,
  //             caregiverId: isemailExist._id,
  //             babyId: userBaby ? userBaby._id : null
  //           });

  //           return helper.success( res, "Caregiver already exists, added baby details", caregiverExists );
  //       } 
  //       return helper.failed(res, "Parent user does not have a baby to assign, please add baby details first");
          
  //     }

  //       // const isphoneExist = await user_model.findOne({ phone: req.body.phone });
  //       // if (isphoneExist) {
  //       //   return helper.failed(res, "Phone number already exists");
  //       // }
  //       // var Otp = Math.floor(1000 + Math.random() * 9000);
        
  //       var Otp = 1111;
  //       let time = helper.unixTimestamp();
  //       req.body.loginTime = time;
  //       req.body.otp = Otp;

  //       let hash = await bcrypt.hash(req.body.password, 10);

  //       let userData = {
  //         parentId: parentId,
  //         ...req.body,
  //         password: hash
  //       };

  //       if (req.user.role == 1) {
  //         if (userBaby) {
  //           userData.babyId = userBaby._id;
  //         } else {
  //           return helper.failed(res, "Parent user does not have a baby assigned");
  //         }
  //       }

  //       let addsubUser = await user_model.create(userData);
  //       if (addsubUser) {
  //         const update_image = await user_model.findByIdAndUpdate({_id: addsubUser._id },{image: parentImg})
  //       }

  //     let addbabytoSubuser = await caregiverModel.create({
  //       parentId: parentId,
  //       caregiverId: addsubUser._id,
  //       babyId: userBaby._id ? userBaby._id : null
  //     });


  //     return helper.success(res, "Sub-user added successfully", addsubUser);
  //   } catch (error) {
  //     console.log(error);
  //     return helper.error(res, "Error");
  //   }
  // },

  add_subuser: async (req, res) => {
    try {
      const parentId = req.user._id;
      const parentImg = req.user.image;

      const v = new Validator(req.body, {
        name: "required",
        email: "required",
        // password: "required" 
      });
      const errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.failed(res, errorsResponse);
      }

      // Handle babyIds
      let babyIds = req.body.babyId;
      if (!Array.isArray(babyIds)) {
        babyIds = babyIds.toString().split(",").map(id => id.trim());
      }
      babyIds = babyIds.map(id => new mongoose.Types.ObjectId(id));

      console.log(babyIds, ">>>>>>>>>>>>>>>>>>>>>>>>>>>.babyIds");

      // Check if caregiver already exists
      let caregiverUser = await user_model.findOne({ email: req.body.email, deleted: false });

      if (caregiverUser) {
        if (caregiverUser.role == 1) {
          return helper.failed(res, "Email already exists for a Parent user");
        }

        const updateResult = await baby_model.updateMany(
          { _id: { $in: babyIds }, userId: parentId },
          { $set: { caregiverId: caregiverUser._id } } // or $addToSet if array
        );

        console.log(updateResult, "=== caregiver update result ===");

        return helper.success(res, "Caregiver already exists and updated in babies", caregiverUser);
      }

      // Create caregiver user
      const Otp = 1111;
      req.body.loginTime = helper.unixTimestamp();
      req.body.otp = Otp;

      const hash = await bcrypt.hash(req.body.password, 10);

      caregiverUser = await user_model.create({
        parentId,
        ...req.body,
        role: 2,
        password: hash,
        image: parentImg
      });

      const updateResult = await baby_model.updateMany(
        { _id: { $in: babyIds }, userId: parentId },
        { $set: { caregiverId: caregiverUser._id } }
      );

      console.log(updateResult, "=== new caregiver update result ===");

      return helper.success(res, "New caregiver created and linked to babies", caregiverUser);

    } catch (error) {
      console.log(error);
      return helper.error(res, "Error");
    }
  },

  subUser_list: async (req, res) => {
    try {
      const userId = req.user._id
      let sub_user_list = await baby_model.find({ userId: userId, deleted: false})
      .sort({ createdAt: -1 })
      .populate("caregiverId")

      if (!sub_user_list) {
        return helper.failed(res, "Sub-user not found");
      }

      // Extract unique caregivers
    let sub_user_data = [];
    let caregiverMap = new Map();

    sub_user_list.forEach(baby => {
      if (baby.caregiverId && !caregiverMap.has(baby.caregiverId._id.toString())) {
        caregiverMap.set(baby.caregiverId._id.toString(), baby.caregiverId);
        sub_user_data.push(baby.caregiverId);
      }
    });

    return helper.success(res, "Sub-user list", sub_user_data);

      // return helper.success(res, 'Sub-user list', sub_user_Data);
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
      const subscription = await userSubscriptionModel.findOne({ user: userId, deleted:false });
      return helper.success(res, "User profile", { userprofile, userBaby, reminderStatus: statusValue,subscription });
    } catch (error) {
      console.log(error);
      return helper.error(res, "Error");
    }
  },

  delete_user: async(req, res)=> {
    try {
      const v = new Validator(req.body, {
        _id: "required",
      });     
      let userId = req.user._id 
      let caregiverId = req.body._id

      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, errorResponse);
      }
    
      await baby_model.updateMany(
        { userId: userId, caregiverId: caregiverId },
        { $set: { caregiverId: null } }
      );     

      return helper.success(res, "Caregiver deleted successfully", {})
    } catch (error) {
      console.log(error)
    }
  },

  deleted_account: async(req, res) => {
    try {
      let userId = req.user._id;
      const deleteProfile = await user_model.findByIdAndUpdate({_id: userId},
      {deleted: true});

      return helper.success(res, "Profile deleted successfully.", {})
    } catch (error) {
      console.log(error)
    }
  },



}