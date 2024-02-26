const user_model = require ('../../model/Admin/user')
const daily_task = require ('../../model/Admin/daily_task')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');

module.exports = {
    
    bottle_time: async(req, res)=> {
        try {
            const v = new Validator(req, res, {
                bottle: "required"
            })
            const errorResponse = await helper.checkValidation(v);
            if (errorResponse) {
                return helper.failed(res, "something went wrong")
            }
            const bottleTime = await daily_task.create({
            user: req.body.userId,
            ...req.body
            })
            return helper.success(res, "bottle task added successfully", bottleTime)

        } catch (error) {
            console.log(error)
        }
    }


}