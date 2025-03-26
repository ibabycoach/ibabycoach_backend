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
      
      const isemailExist = await user_model.findOne({ email: req.body.email, deleted:false });
      if (isemailExist) {
        return helper.failed(res, "Email already exists");
      }
  
      const ismobileExist = await user_model.findOne({ phone: req.body.phone, deleted: false });
      if (ismobileExist) {
        return helper.failed(res, "Mobile already exists");
      }
  
      if (req.files && req.files.image) {
        let image = req.files.image;
        if (image) {
          values.inputs.image = helper.imageUpload(image, "images");
        }
      }
      // var Otp = 1111;
      var Otp = Math.floor(1000 + Math.random() * 9000);

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

        let html =` Hello ${req.body.name}, <br> This is your one time password (OTP) ${ Otp } to complete the signup process. <br><br> Regards,<br> ibabycoach`;

          var transporter = nodemailer.createTransport({
              host: 'smtp.hostinger.com',
              port: '587',
              auth: {
                  user: 'app@ibabycoach.com',
                  pass: 'Th3B@byCo@ch'
              }
          });
          // send mail with defined transport object
          let info = await transporter.sendMail({
              from: 'app@ibabycoach.com' , 
              to: req.body.email, 
              subject: "ibabycoach", 
              text: "ibabycoach", 
              html: html,
          });
  
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
        const updateDeviceToken = await user_model.findOneAndUpdate({email: req.body.email, deleted: false},
          {device_token: req.body.device_token,
            device_type: req.body.device_type},
            {new: true}
            ); 

        var findUser = await user_model.findOne({ email: req.body.email, deleted: false})

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
              { expiresIn: "365d"}
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
        email: "required",
        // country_code: "required",
      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.failed(res, errorsResponse);
      }
      let isUserExist = await user_model.findOne({ email: req.body.email, deleted:false });

      if (isUserExist) {
        if (req.body.otp == isUserExist.otp) {
          await user_model.updateOne({ _id: isUserExist._id }, { otpverify: 1, otp: '' });
        } else {
          return helper.failed(res, "OTP doesn't match");
        }
        let userDetail = await user_model.findOne({ _id: isUserExist._id })

        let time = helper.unixTimestamp();
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

  socialLogin: async (req, res) => {
    try {
        // Validate the request body
        const v = new Validator(req.body, {
          social_id: "required",
          socialtype: "required", // 1 for Google, 2 for Facebook, 3 for Apple
          device_type: "required",
          device_token: "required",
        });

        let errorsResponse = await helper.checkValidation(v);
        if (errorsResponse) {
            return helper.failed(res, errorsResponse);
        }

        if (req.body.email) {
            const emailExist = await user_model.findOne({ email: req.body.email, deleted: false });
            if (emailExist) {
              const findbaby = await babyModel.findOne({ userId: emailExist._id, });
                // Create a new object and add the hasBabyAdded field
                const existingUser = { 
                    ...emailExist.toObject(), 
                    hasBabyAdded: findbaby ? 1 : 0
                };  

                // Generate token for new user
                let token = jwt.sign(
                  {
                    data: {
                      _id: existingUser._id,
                      loginTime: existingUser.loginTime,
                    },
                  },
                  secretCryptoKey,
                  { expiresIn: "365d" }
                );
                
                existingUser.token = token;

              return helper.success(res, "User already exists", existingUser);
            }
        }

        // Check if a user exists with the provided social_id and social_type
        const userExisted = await user_model.findOne({
          social_id: req.body.social_id,
          socialtype: req.body.socialtype,
        });    

        // If user exists, log them in (update device info)
        if (userExisted) {

          const findbaby = await babyModel.findOne({ userId: userExisted._id, });
    
        // Create a new object and add the hasBabyAdded field
        const existingUser = { 
            ...userExisted.toObject(), 
            hasBabyAdded: findbaby ? 1 : 0
        };  

         // Generate token for new user
         let token = jwt.sign(
          {
            data: {
              _id: existingUser._id,
              loginTime: existingUser.loginTime,
            },
          },
          secretCryptoKey,
          { expiresIn: "365d" }
        );
        
        existingUser.token = token;

            return helper.success(res, "User Already existed", existingUser);
        } else {

          if (req.files && req.files.image) {
            let image = req.files.image;
            if (image) {
              req.body.image = helper.imageUpload(image, "images");
            }
          }

            const createdUser = await user_model.create({
              ...req.body,
              loginTime:helper.unixTimestamp(),
            });
            let newUserData = await user_model.findOne(
               { _id: createdUser.id });

            // Generate token for new user
            let token = jwt.sign(
              {
                data: {
                  _id: newUserData._id,
                  loginTime: newUserData.loginTime,
                },
              },
              secretCryptoKey,
              { expiresIn: "365d" }
            );

            newUserData = newUserData.toJSON(); 
            newUserData.token = token;
            delete newUserData.password;
            

          return helper.success(res, "New user created and logged in successfully", newUserData);
        }
    } catch (error) {
        console.error(error);
        return helper.failed(res, error);
    }
  },

  forgotPassword: async (req, res) => {
    try {
        const v = new Validator(req.body, {
            email: 'required'
        });
        let errorsResponse = await helper.checkValidation(v);
        if (errorsResponse) {
            return await helper.failed(res, errorsResponse);
        }

        let findUser = await user_model.findOne({
          email: req.body.email
        });
        if(findUser) {
            // var Otp = 1111;
            var Otp = Math.floor(1000 + Math.random() * 9000);
            let updateOtp = await user_model.update(
              { otp: Otp },
              { email: req.body.email }
            );
            if (!updateOtp) {
                return helper.failed(res, "Failed to send OTP");
            }

            let findUser2 = await db.users.findOne({
              email: req.body.email
            });
        let otp = findUser2.otp;

         // sent OTP to email 
         let html =` Hello ${req.body.name}, <br> This is your one time password (OTP) ${ Otp } to complete the forgot password process. <br><br> Regards,<br> ibabycoach`;

         var transporter = nodemailer.createTransport({
             host: 'smtp.hostinger.com',
             port: '587',
             auth: {
                 user: 'app@ibabycoach.com',
                 pass: 'Th3B@byCo@ch'
             }
         });
         // send mail with defined transport object
         let info = await transporter.sendMail({
             from: 'app@ibabycoach.com' , 
             to: req.body.email, 
             subject: "ibabycoach", 
             text: "ibabycoach", 
             html: html,
         });
 
        return helper.success(res, 'Otp send to reset password', { otp });

        } else {
            return helper.failed(res, "Incorrect email")
        }

    } catch (error) {
        console.log(error);
        return helper.failed(res, error);
    }
},



}

