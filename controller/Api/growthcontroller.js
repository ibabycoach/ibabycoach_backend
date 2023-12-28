const growthModel = require('../../model/Admin/growth');
let helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');


module.exports = {

    Add_growth: async(req, res)=> {
        try {
            const v = new Validator(req.body, {
                age: "required",
                height: "required",
                weight: "required",
                headSize: "required"
              });
                
                const errorResponse = await helper.checkValidation(v);
                  if (errorResponse) {
                    return helper.failed(res, errorResponse);
                  }

            let babygrowth = await growthModel.create({

                userId: req.body.userId,
                babyId: req.body.babyId,
                age: req.body.age,
                height: req.body.height,
                weight: req.body.weight,
                headSize: req.body.headSize,
            });
            
          return helper.success(res, "growth added successfully", babygrowth)
        } catch (error) {
            console.log(error)
        }
    },




}