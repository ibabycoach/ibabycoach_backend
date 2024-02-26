const user_model = require ('../../model/Admin/user')
const daily_task = require ('../../model/Admin/daily_task')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');

module.exports = {
    
    bottle_time: async(req, res)=> {
        try {
            // console.log(req.body, ">>>>>");return
            let userId = req.user._id;
            const v = new Validator(req.body, {
               bottle: "required"
              });
                
                const errorResponse = await helper.checkValidation(v);
                if (errorResponse) {
                  return helper.failed(res, errorResponse);
                }

            const bottleTime = await daily_task.create({
                userId: userId,
                ...req.body,
            })
            
            return helper.success(res, "bottle task added successfully", bottleTime)

        } catch (error) {
            console.log(error)
        }
    }


}