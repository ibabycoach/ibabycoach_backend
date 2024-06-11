const growthModel = require('../../model/Admin/growth');
let helper = require('../../Helper/helper')
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

      let lastEntry = await growthModel.findOne({babyId: req.body.babyId}).sort({createdAt: -1})

      let babygrowthData = {userId,
        ...req.body,
      };

      if (lastEntry) {
          babygrowthData.lastHeight = lastEntry.height;
          babygrowthData.lastWeight = lastEntry.weight;
          babygrowthData.lastHeadSize = lastEntry.headSize;
      }

      let babygrowth = await growthModel.create(babygrowthData);
            
        return helper.success(res, "growth added successfully", babygrowth)
    } catch (error) {
        console.log(error)
      }
  },

  track_growth: async(req, res)=> {
    try {
      const v = new Validator( req.body, {
        babyId: "required"
      })
      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, "something went wrong")
      }

      let babyId = req.body.babyId;
      const babygrowth = await growthModel.find({ babyId: babyId }).sort({createdAt:-1})
      .populate("userId", "name");

      return helper.success(res, "baby growth details", babygrowth)
    } catch (error) {
      console.log(error)
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

        return helper.success(res, "growth updated successfully", updatedgrowth)

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
      
      return helper.success(res, "Growth deleted successfully", deleteGrowth)

    } catch (error) {
      console.log(error)
    }
  },


}