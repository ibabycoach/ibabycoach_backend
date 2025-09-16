const user_model = require ('../../model/Admin/user')
const baby_model = require ('../../model/Admin/baby')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');
const userSubscription = require('../../model/Admin/user_subscriptions')
const routinebuilder = require('../../model/Admin/routinebuilder');
const unitModel = require('../../model/Admin/units');

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
              //  image: addbaby.image
            });

           // Check if a unit already exists for the user before creating a new one
            const existingUnit = await unitModel.findOne({ userId });
            if (!existingUnit) {
              await unitModel.create({ userId });
            }

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
        bg_color: req.body.bg_color,
        gender: req.body.gender});
     
        const babydetails = await baby_model.find({_id: babyId});

      //   const updatebabydata = await user_model.findByIdAndUpdate({_id: req.user._id}, 
      //     {image: babydata.image
      //  });

      return helper.success(res, "baby details updated successfully")

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
      const removebaby = await baby_model.findByIdAndUpdate({_id:req.body.babyId},
        {deleted:true}); 
      
      return helper.success(res, "Baby details deleted successfully")

    } catch (error) {
      console.log(error)
    }
  },

  baby_list: async(req, res)=> {
    try {
      let userId = req.user._id;
        let getbabydetails;

      if (req.user.role == 2) {
        let getbabydetail = await baby_model.find({ caregiverId: userId, deleted:false})
        .populate('userId')

         // For each baby's userId, fetch subscriptions
      const getbabydetails = await Promise.all(getbabydetail.map(async (baby) => {
        const subscriptions = await userSubscription.findOne({
          user: baby.userId?._id,
          deleted: false
        });

        return {
          ...baby.toObject(),
          subscriptions
        };
      }));
        return helper.success(res, "baby list", getbabydetails);
        // return helper.success(res, "baby list", {
        //   getbabydetails: getbabydetails
        // });

      } else {
        getbabydetails = await baby_model.find({ userId: userId, deleted:false})
        .populate('userId', '_id')
        .populate('caregiverId')
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
        getBabyData = await baby_model.findById({ _id: req.body.babyId,  deleted:false });
      } else {
        getBabyData = await baby_model.findById({ _id: req.body.babyId, deleted:false });
      }

      const getroutine = await routinebuilder.find({babyId: req.body.babyId})
      .populate('activityIds', 'activity_name time day image')

      return helper.success(res, "baby details", {getBabyData, getroutine} )
  } catch (error) {
      console.log(error)
      return helper.failed(res, "Something went wrong");
  }
  },

  babyNotAssinedToCargiver: async (req, res) => {
    try {
      const userId = req.user._id
      let babylist = await baby_model.find({ userId: userId, caregiverId:null, deleted: false})
      .sort({ createdAt: -1 })

      if (!babylist) {
        return helper.failed(res, "Sub-user not found");
      }

    return helper.success(res, "baby not assigned list", babylist);

    } catch (error) {
      console.log(error)
    }
  },
    
}