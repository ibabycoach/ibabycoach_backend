const routinebuilder = require('../../model/Admin/routinebuilder')
const activity_model = require('../../model/Admin/activity')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');

module.exports = {

  add_routine: async(req, res)=> {
      try {
        const v = new Validator(req.body, {
          activityId: "required",
          babyId: "required",
          day: "required",
          time: "required"
        });
        
        const errorResponse = await helper.checkValidation(v);
        if (errorResponse) {
          return helper.failed(res, errorResponse);
        }
        let userId = req.user.id;
        const addroutine = await routinebuilder.create({ 
          userId,
          ...req.body
        })

        return helper.success(res, "routine added successfully", addroutine)
            
      } catch (error) {
        console.log(error``)
      }
  },

  edit_routine: async(req, res)=> {
      try {
        
        const v = new Validator(req.body, {
          routineId: "required"
        })
        const errorResponse = await helper.checkValidation(v);
        if (errorResponse) {
          return helper.failed(res, errorResponse);
        }
        
        let routineId = req.body.routineId;
        const updateroutine = await routinebuilder.findByIdAndUpdate({_id: req.body.routineId},
        {
          ...req.body
        });
        
        const updatedroutine = await routinebuilder.findOne({_id: req.body.routineId})
        return helper.success(res, "routine updated successfully", updatedroutine )

      } catch (error) {
        console.log(error);
      }
  }



}