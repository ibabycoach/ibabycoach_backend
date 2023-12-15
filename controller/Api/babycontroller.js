const user_model = require ('../../model/Admin/user')
const baby_model = require ('../../model/Admin/baby')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');

module.exports = {


    add_baby : async(req, res)=> {
        try {
            const v = new Validator(req.body, {
                name: "required",
                birthday: "required",
                gender: "required"
              });
        
              const errorResponse = await helper.checkValidation(v);
              if (errorResponse) {
                return helper.failed(res, errorResponse);
              }

              if (req.files && req.files.image) {
                var image = req.files.image;
          
                if (image) {
                  req.body.image = helper.imageUpload(image, "images");
                }
            }

              let userId = req.user._id
              const addbaby = await baby_model.create({ 
                userId,
                ...req.body });

              return helper.success(res, "baby details added", addbaby)

        } catch (error) {
           console.log(error) 
        }
    },

    
}