const user_model = require ('../../model/Admin/user')
const baby_model = require ('../../model/Admin/baby')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');
const routinebuilder = require('../../model/Admin/routinebuilder');

module.exports = {

  add_baby : async(req, res)=> {
    try {
      const v = new Validator(req.body, {
        baby_name: "required",
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
               babyId: addbaby._id,
               image: addbaby.image
            });
            const updatebabyimage = await user_model.findOneAndUpdate({parentId: userId._id},
              {image: addbaby.image}
           );

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
        {baby_name: req.body.baby_name,
        image: req.body.image,
        birthday: req.body.birthday,
        gender: req.body.gender});
     
        const babydetails = await baby_model.find({_id: babyId});

        const updatebabydata = await user_model.findByIdAndUpdate({_id: req.user._id}, 
          {image: babydata.image
       });

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
  },

  baby_list: async(req, res)=> {
    try {
        let userId = req.user._id;

        if (req.user.role == 2) {
          const parentId = req.user.parentId;
          getbabydetails = await baby_model.find({ userId: parentId });
        } else {
          getbabydetails = await baby_model.find({ userId: userId });
        }
        
        return helper.success(res, "baby list", getbabydetails )
    } catch (error) {
        console.log(error)
        return helper.failed(res, "Something went wrong");
    }
  },

  switch_baby_account: async(req, res)=> {
    try {
      let userId = req.user._id;
      const v = new Validator(req.body, {
        babyId: "required",
      });
      const errorResponse = await helper.checkValidation(v);
        if (errorResponse) {
          return helper.failed(res, errorResponse);
        }

      if (req.user.role == 2) {
        getBabyData = await baby_model.findById({ _id: req.body.babyId });
      } else {
        getBabyData = await baby_model.findById({ _id: req.body.babyId });
      }

      const getroutine = await routinebuilder.find({babyId: req.body.babyId})
      .populate('activityIds', 'activity_name time day image')

      return helper.success(res, "baby details", {getBabyData, getroutine} )
  } catch (error) {
      console.log(error)
      return helper.failed(res, "Something went wrong");
  }
  },


    
}