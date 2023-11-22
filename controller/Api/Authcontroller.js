let user_model = require('../../model/Admin/user_model')
let helper = require('../../Helper/helper')
const authenticateHeader = require("../../Helper/helper").authenticateHeader;
const bcrypt = require('bcrypt');
const { Validator } = require('node-input-validator');
var jwt = require('jsonwebtoken');
const secretCryptoKey = process.env.jwtSecretKey;
const nodemailer = require("nodemailer");
const { bank_list } = require('./bankcontroller');
const bankmodel = require('../../model/Admin/bankmodel');
const cardmodel = require('../../model/Admin/cardmodel')


module.exports = {

  signup: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        name: "required",
        email: "required",
        password: "required",
        phone: "required",
        country_code: "required",
      });
  
      const values = JSON.parse(JSON.stringify(v));
      let errorsResponse = await helper.checkValidation(v);
  
      if (errorsResponse) {
        return helper.failed(res, errorsResponse);
      }
      
      const isemailExist = await user_model.findOne({ email: req.body.email });
  
      if (isemailExist) {
        return helper.failed(res, "Email already exists");
      }
  
      const ismobileExist = await user_model.findOne({ phone: req.body.phone });
  
      if (ismobileExist) {
        return helper.failed(res, "Mobile already exists");
      }
  
      if (req.files && req.files.image) {
        let image = req.files.image;
  
        if (image) {
          values.inputs.image = helper.imageUpload(image, "images");
        }
      }
  
      var Otp = 1111;
      // var Otp = Math.floor(1000 + Math.random() * 9000);
  
      let hash = await bcrypt.hash(req.body.password, 10);
  
      let time = helper.unixTimestamp();
      values.inputs.loginTime = time;
      values.inputs.otp = Otp;
  
      // Check if longitude and latitude are provided, otherwise use default coordinates
    //   if (req.body.longitude && req.body.latitude) {
    //     values.inputs.location = {
    //       type: "Point",
    //       coordinates: [Number(req.body.longitude), Number(req.body.latitude)],
    //     };
    //     values.inputs.latitude = Number(req.body.latitude);
    //     values.inputs.longitude = Number(req.body.longitude);
    //   } else {
    //     // Default coordinates
    //     values.inputs.location = {
    //       type: "Point",
    //       coordinates: [0, 0], // Default coordinates
    //     };
    //     values.inputs.latitude = 0;
    //     values.inputs.longitude = 0;
    //   }
  
      const stripeCustmor = await helper.strieCustomer(req.body.email);
      values.inputs.stripe_customer = stripeCustmor;
  
      let dataEnter = await user_model.create({ ...values.inputs });
  
      const getUser = await user_model.findOne({ email: dataEnter.email });
  
      if (dataEnter) {
        let userInfo = await user_model.findOne({ _id: dataEnter._id });
        delete userInfo.password;
        delete userInfo.password;
  
        return helper.success(res, "Signup Successfully", userInfo);
      }
    } catch (error) {
      console.log(error);
      return helper.error(res, "error");
    }
  },
  
  Login: async (req, res) => {
    try {
      // var otp = Math.floor(1000 + Math.random() * 9000);
      var otp = 1111;
      var update_otp = await user_model.findOneAndUpdate(
        { phone: req.body.phone },
        { otp: otp,
          device_type:req.body.device_type }
      );
      if (update_otp) {
        var finadata = await user_model.findById(update_otp._id);
        let userCard = await cardmodel.findOne({ userId: finadata._id });

        let time = await helper.unixTimestamp();
        let token = jwt.sign(
          {
            data: {
              _id: finadata._id,
              phone: finadata.phone,
              loginTime: time,
            },
          },
          secretCryptoKey,
          { expiresIn: "365d" }
        );
        finadata = JSON.stringify(finadata);
        finadata = JSON.parse(finadata);
        finadata.token = token;
        finadata.is_card = userCard ? 1 : 0;

        if (finadata) {
          return await helper.success(res, "otp send successfully", finadata);
        } else {
          return helper.failed(res, "something went wrong");
        }
      } else {
        return helper.failed(res, "incorrect phone number");

      }
    } catch (error) {
      return helper.failed(res, error);
    }
  },

  otpVerify: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        otp: "required",
        phone: "required",
        country_code: "required",

      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.failed(res, errorsResponse);
      }

      let isEmailExist = await user_model.findOne({ phone: req.body.phone, country_code: req.body.country_code });

      if (isEmailExist) {
        if (req.body.otp == isEmailExist.otp) {
          await user_model.updateOne({ _id: isEmailExist._id }, { otpverify: 1, otp: '' });
        } else {
          return helper.failed(res, "OTP doesn't match");
        }
        let userDetail = await user_model.findOne({ _id: isEmailExist._id }).populate("skill").populate("tools")

        let time = await helper.unixTimestamp();
        let token = jwt.sign(
          {
            data: {
              _id: userDetail._id,
              email: userDetail.email,
              loginTime: time,
            },
          },
          secretCryptoKey,
          { expiresIn: "365d" }
        );

        userDetail = JSON.stringify(userDetail);
        userDetail = JSON.parse(userDetail);
        userDetail.token = token;

        const account = await bankmodel.count({ workerId: userDetail._id });
        let obj = {
          userDetail,
          account
        }
        return await helper.success(res, " otp verify successfully", obj);
      } else {
        return await helper.failed(res, "user does not exist", {});
      }
    } catch (error) {
      console.log(error);
      return helper.failed(res, error);
    }
  },

  resend_otp: async (req, res) => {
    try {
      // var otp = Math.floor(1000 + Math.random() * 9000);
      var otp = 1111;
      var update_otp = await user_model.findOneAndUpdate(
        { phone: req.body.phone },
        { otp: otp }
      );

      if (update_otp) {
        return await helper.success(res, "Resend otp successfully", otp);
      } else {
        return helper.failed(res, "something went wrong");
      }
    } catch (error) {
      console.log(error);
      return helper.failed(res, error);
    }
  },

  logOut: async (req, res) => {
    try {
      await user_model.updateOne(
        { _id: req.user._id },
        { loginTime: "0", deviceToken: "" }
      );
      return helper.success(res, "Logout successfully");
    } catch (error) {
      console.log(error);
      return helper.error(res, error);
    }
  },

  socialLogin: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        social_id: "required",
        role: "required",
        socialtype: "required", //1 for google , 2 for facebook, 3 for apple
        device_type: "required",
        device_token: "required",
      });
      const values = JSON.parse(JSON.stringify(v));
      let errorsResponse = await helper.checkValidation(v);

      if (errorsResponse) {
        return helper.failed(res, errorsResponse);
      }
      let condition = {}
      if (req.body.socialtype == 1) {
        condition = {
          google: req.body.social_id,
          socialtype: req.body.socialtype,
          role: req.body.role,
        }
      } else if (req.body.socialtype == 2) {
        condition = {
          facebook: req.body.social_id,
          socialtype: req.body.socialtype,
          role: req.body.role,
        }
      } else if (req.body.socialtype == 3) {
        condition = {
          apple: req.body.social_id,
          socialtype: req.body.socialtype,
          role: req.body.role,
        }
      }
      var check_social_id = await user_model.findOne(condition);
      // if(req.body.email){
        var check_email = await user_model.findOne({
          email: req.body.email
        });
      // }
    
      if (check_social_id || check_email) {
        await user_model.findOneAndUpdate({
          device_token: req.body.device_token,
          device_type: req.body.device_type,
          login_time: helper.unixTimestamp(),
        }, {
          _id: check_social_id ? check_social_id._id : check_email._id
        });
        var get_user_data = await user_model.findOne({
          _id: check_social_id._id,
        });
        let token = jwt.sign({
          _id: get_user_data._id,
          login_time: get_user_data.loginTime,
        },
          "secret", {
          expiresIn: "365d",
        });
        get_user_data = JSON.stringify(get_user_data);
        get_user_data = JSON.parse(get_user_data);
        get_user_data.token = token;
        delete get_user_data.password;
        if (req.body.role == 2) {
          const account = await bankmodel.count({ workerId: get_user_data._id });
          var objs = {
            get_user_data,
            account
          }
        } else {
          var objs = get_user_data
        }
        return helper.success(res, "Social Login successfully", objs);
      } else {
        let condition = {}

        if (req.body.socialtype == 1) {
          condition = {
            google: req.body.social_id,
            socialtype: req.body.socialtype,
            role: req.body.role,
          }
        } else if (req.body.socialtype == 2) {
          condition = {
            facebook: req.body.social_id,
            socialtype: req.body.socialtype,
            role: req.body.role,
          }
        } else if (req.body.socialtype == 3) {
          condition = {
            apple: req.body.social_id,
            socialtype: req.body.social_type,
            role: req.body.role,
          }
        }
        var save_data = await user_model.create({
          name: req.body.name ? req.body.name : '',
          email: req.body.email ? req.body.email : '',
          phone: req.body.phone ? req.body.phone : '',
          image: req.body.image ? req.body.image : '',
          otp: 1111,
          login_time: await helper.unixTimestamp(),
          type: req.body.type,
          device_type: req.body.device_type ? req.body.device_type : '',
          device_token: req.body.device_token ? req.body.device_token : '',
          bio: req.body.bio ? req.body.bio : '',
          country_code: req.body.country_code ? req.body.country_code : '',
          ...condition
        });
        var get_user_data = await user_model.findOne(
          {
            _id: save_data._id,
          });
        let token = jwt.sign({
          _id: get_user_data._id,
          login_time: get_user_data.loginTime,
        },
          "secret", {
          expiresIn: "365d",
        });
        get_user_data = JSON.stringify(get_user_data);
        get_user_data = JSON.parse(get_user_data);
        get_user_data.token = token;
        delete get_user_data.password;
        if (req.body.role == 2) {
          const account = await bankmodel.count({ workerId: get_user_data._id });
          var objs = {
            get_user_data,
            account
          }
        } else {
          var objs = get_user_data
        }
        return helper.success(res, "Social Login successfully", objs);
      }
    } catch (error) {
      return helper.failed(res, error);
    }
  }





}

