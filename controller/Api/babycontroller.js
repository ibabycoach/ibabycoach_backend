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
            var addbaby = await baby_model.create({ 
              userId,
              ...req.body });

              const updatebabydata = await user_model.findByIdAndUpdate(userId, {
               babyId: addbaby._id
            });

          return helper.success(res, "baby details added", addbaby)
    } catch (error) {
      console.log(error) 
    }
  },

  edit_baby: async(req, res)=> {
    try {
      const v = new Validator(req.body, {
        babyId: "required"
       
      })
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
     let babyId = req.body.babyId;

      const babydata = await baby_model.findByIdAndUpdate({_id: babyId},
        {name: req.body.name,
        image: req.body.image,
        birthday: req.body.birthday,
        gender: req.body.gender});
     
        const babydetails = await baby_model.find({_id: babyId});

      return helper.success(res, "baby details updated successfully", babydetails)

    } catch (error) {
      console.log(error)
    }
  },

  delete_baby: async(req, res)=> {
    try {
      const v = new Validator(req.body, {
        babyId: "required"
      })
      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, errorResponse);
      }
      const removebaby = await baby_model.deleteOne({_id:req.body.babyId}) 
      
      return helper.success(res, "baby details deleted successfully", removebaby)

    } catch (error) {
      console.log(error)
    }
  }


    
}