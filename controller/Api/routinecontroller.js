const routinebuilder = require('../../model/Admin/routinebuilder')
const activity_model = require('../../model/Admin/activity')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');

module.exports = {

    add_routine: async(req, res)=> {
        try {
            const v = new Validator(req.body, {
                activityId: "required",
                day: "required",
                time: "required"
              });
        
              const errorResponse = await helper.checkValidation(v);
              if (errorResponse) {
                return helper.failed(res, errorResponse);
              }
              const addroutine = await routinebuilder.create({
                ...req.body
              })

              return helper.success(res, "routine added successfully", addroutine)
            
        } catch (error) {
            console.log(error``)
        }
    }

}