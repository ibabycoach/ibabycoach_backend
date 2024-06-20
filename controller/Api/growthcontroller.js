const growthModel = require('../../model/Admin/growth');
let helper = require('../../Helper/helper')
const unitModel = require('../../model/Admin/units')
const { Validator } = require('node-input-validator');

module.exports = {

  Add_growth: async(req, res)=> {
    try {
      let userId = req.user.id
      const v = new Validator(req.body, {
        height: "required",
        weight: "required",
        headSize: "required",
        time: "required",
      });       
      const errorResponse = await helper.checkValidation(v);
        if (errorResponse) {
          return helper.failed(res, errorResponse);
        }

      let lastEntry = await growthModel.findOne({babyId: req.body.babyId, deleted:false}).sort({createdAt: -1})

      let babygrowthData = {userId,
        ...req.body,
      };

      if (lastEntry) {
          babygrowthData.lastHeight = lastEntry.height;
          babygrowthData.lastWeight = lastEntry.weight;
          babygrowthData.last_oz = lastEntry.last_oz;
          babygrowthData.lastHeadSize = lastEntry.headSize;
      }
      let babygrowth = await growthModel.create(babygrowthData);
            
      return helper.success(res, "Growth added successfully", {})
    } catch (error) {
        console.log(error)
      }
  },

  track_growth: async(req, res) => {
    try {
      let userId = req.user._id;
  
      const v = new Validator(req.body, {
        babyId: "required"
      });
      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, "something went wrong");
      }
  
      let babyId = req.body.babyId;
      const baby_growth = await growthModel.find({ babyId: babyId, deleted: false })
        .sort({ createdAt: -1 })
        .populate("userId", "name");
  
      const findUserUnit = await unitModel.findOne({ userId });
  
      if (!findUserUnit) {
        return helper.failed(res, "User unit preferences not found");
      }
  
      // Adding unit preferences to each baby_growth record
      const babygrowth = baby_growth.map(growth => ({
        ...growth.toObject(),
        current_height_unit: findUserUnit.current_height_unit,
        current_weight_unit: findUserUnit.current_weight_unit,
        current_headSize_unit: findUserUnit.current_headSize_unit
      }));
  
      return helper.success(res, "baby growth details", babygrowth);
    } catch (error) {
      console.log(error);
      return helper.failed(res, "Internal server error");
    }
  },

  edit_growth: async(req, res)=> {
    try {
      const v = new Validator(req.body, {
        growthId: "required"
      })
      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, errorResponse)
      }
      if (req.files && req.files.image) {
        var image = req.files.image;
      
        if (image) {
          req.body.image = helper.imageUpload(image, "images");
        }
      }

      let growthId = req.body.growthId;
      const growthdata = await growthModel.findOneAndUpdate({_id: req.body.growthId},
        { ...req.body });

        const updatedgrowth = await growthModel.findOne({_id: req.body.growthId})

        return helper.success(res, "growth updated successfully", {})

    } catch (error) {
      console.log(error)
    }
  },

  deleteGrowth: async(req, res)=> {
    try {
      const v = new Validator(req.body, {
        growthId: "required"
      })
      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, errorResponse);
      }
      const deleteGrowth = await growthModel.findByIdAndUpdate({_id: req.body.growthId}, 
        {deleted: true}) 
      
      return helper.success(res, "Growth deleted successfully", {})

    } catch (error) {
      console.log(error)
    }
  },


}