const growthModel = require('../../model/Admin/growth');
let helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');


module.exports = {

  Add_growth: async(req, res)=> {
    try {
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

        let userId= req.user.id
        let babygrowth = await growthModel.create({
          userId,
          ...req.body
        });
            
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
      const babygrowth = await growthModel.find({ babyId: babyId }).sort({createdAt:-1});

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

      let growthId = req.body.growthId;
      const growthdata = await growthModel.findOneAndUpdate({_id: req.body.growthId},
        { ...req.body });

        const updatedgrowth = await growthModel.findOne({_id: req.body.growthId})

        return helper.success(res, "growth updated successfully", updatedgrowth)

    } catch (error) {
      console.log(error)
    }
  }




}