const user_model = require('../../model/Admin/user')
const baby_model = require('../../model/Admin/baby')
const activity_model = require('../../model/Admin/activity')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var secretCryptoKey = process.env.jwtSecretKey || "secret_iBabycoachs_@onlyF0r_JWT";
const nodemailer = require("nodemailer");

module.exports = {

    profile: async(req, res)=> {
        try {
            const userId = req.user.id;

            const userprofile = await user_model.findOne({_id: userId})

            if (!userprofile) {
                return helper.failed (res, "user not found")
            }
            const userBaby = await baby_model.findOne({userId: userprofile._id})

            if (!userprofile) {
                return helper.failed (res, "baby not found")
            }

            return helper.success(res, "user profile", {userprofile, userBaby} )
        } catch (error) {
            console.log(error)
        }
    },

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
        
        var Otp = 1111;
        // var Otp = Math.floor(1000 + Math.random() * 9000);
      
        let time = helper.unixTimestamp();
        req.body.loginTime = time;
        req.body.otp = Otp;
        
        let hash = await bcrypt.hash(req.body.password, 10);

        let dataEnter = await user_model.create({ parentId: parentId,
        ...req.body, password: hash });
        
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
        
          return helper.success(res, "sub-user added successfully", userInfo);
        }
      } catch (error) {
          console.log(error);
          return helper.error(res, "error");
        }
    }

}