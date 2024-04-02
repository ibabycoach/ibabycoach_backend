let user_model = require('../../model/Admin/user')
let babyModel = require('../../model/Admin/baby')
let helper = require('../../Helper/helper')
const authenticateHeader = require("../../Helper/helper").authenticateHeader;
const bcrypt = require('bcrypt');
const { Validator } = require('node-input-validator');
var jwt = require('jsonwebtoken');
var secretCryptoKey = process.env.jwtSecretKey || "secret_iBabycoachs_@onlyF0r_JWT";
const nodemailer = require("nodemailer");


module.exports = {

  signup: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        name: "required",
        email: "required|email",
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

      let time = helper.unixTimestamp();
      values.inputs.loginTime = time;
      values.inputs.otp = Otp;
  
      let hash = await bcrypt.hash(req.body.password, 10);
      
      req.body.email = req.body.email.toLowerCase();
      let dataEnter = await user_model.create({ ...values.inputs, password: hash });
  
      const getUser = await user_model.findOne({ email: dataEnter.email });
  
      if (dataEnter) {
        let userInfo = await user_model.findOne({ _id: dataEnter._id });
        delete userInfo.password;

        let token = jwt.sign(
          {
            data: {
              _id: userInfo._id,
              loginTime: time,
            },
          },
          secretCryptoKey,
          { expiresIn: "365d" }
        );
        userInfo = JSON.stringify(userInfo);
        userInfo = JSON.parse(userInfo);
        userInfo.token = token;
  
        return helper.success(res, "Signup Successfully", userInfo);
      }
    } catch (error) {
      console.log(error);
      return helper.error(res, "error");
    }
  },
  
  Login: async (req, res) => {
    try {
          const v = new Validator(req.body, {
            email: 'required|email',
            password: 'required',
        });

        let errorsResponse = await helper.checkValidation(v)
        if (errorsResponse) {
            return await helper.failed(res, errorsResponse)
        }
        
        req.body.email = req.body.email.toLowerCase();
        const updateDeviceToken = await user_model.findOneAndUpdate({email: req.body.email},
          {device_token: req.body.device_token,
            device_type: req.body.device_type},
            {new: true}
            ); 

        var findUser = await user_model.findOne({ email: req.body.email})

        if (findUser) {
            let checkPassword = await bcrypt.compare(req.body.password, findUser.password);
            const findbaby = await babyModel.findOne({userId: findUser._id});

            let time = await helper.unixTimestamp();
            let token = jwt.sign(
              {
                data: {
                  _id: findUser._id,
                  loginTime: time,
                },
              },
              secretCryptoKey,
              { expiresIn: "365d" }
            );
            findUser = JSON.stringify(findUser);
            findUser = JSON.parse(findUser);
            findUser.token = token;

            if (findUser.role === 2) {
              return await helper.success(res, "login successful", findUser)
          } else {
             
              const findbaby = await babyModel.findOne({
                  userId: findUser._id,
              });
              findUser.hasBabyAdded = findbaby ? 1 : 0;
          }
        
            if (checkPassword == true) {
                req.session.user = findUser;
                return await helper.success(res, "Login successful", findUser)
            } else {
                console.log("incorrect password")
                return helper.failed(res, "Incorrect password")
            }
        } else {
            console.log("incorrect email")
            return helper.failed(res, "Incorrect email")
        }
    } catch (error) {
        console.log(error)
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
      let isUserExist = await user_model.findOne({ phone: req.body.phone, country_code: req.body.country_code });

      if (isUserExist) {
        if (req.body.otp == isUserExist.otp) {
          await user_model.updateOne({ _id: isUserExist._id }, { otpverify: 1, otp: '' });
        } else {
          return helper.failed(res, "OTP doesn't match");
        }
        let userDetail = await user_model.findOne({ _id: isUserExist._id })

        let time = await helper.unixTimestamp();
        let token = jwt.sign(
          {
            data: {
              _id: userDetail._id,
              email: userDetail.email,
              loginTime: time,
            },
          },
          "secretCryptoKey",
          { expiresIn: "365d" }
        );

        userDetail = JSON.stringify(userDetail);
        userDetail = JSON.parse(userDetail);
        userDetail.token = token;

        let obj = {
          userDetail,
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

  logout: async (req, res) => {
    try {
      await user_model.updateOne(
        { _id: req.user._id },
        { loginTime: "0", device_token: "" }
      );
      return helper.success(res, "Logout successfully");
    } catch (error) {
      console.log(error);
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
  },

  change_password: async function (req, res) {
    try {
      
        const V = new Validator(req.body, {
            oldPassword: "required",
            newPassword: "required",
            confirm_password: "required|same:newPassword",
        });

        V.check().then(function (matched) {
            console.log(matched);
            console.log(V.errors);
        });
        let data = req.user;
        
        if (data) {
            let comp = await bcrypt.compare(V.inputs.oldPassword, data.password);

            if (comp) {
                const bcryptPassword = await bcrypt.hash(req.body.newPassword, 10);
                let create = await user_model.updateOne(
                    { _id: data._id },
                    { password: bcryptPassword }
                );
              
                return helper.success(res, "updated successfully")
            } else {
              return helper.failed(res, "Old password not match")
            }
        }
    } catch (error) {
        console.log(error)
    }
  },

  

}

