const user_model = require ('../../model/Admin/user')
const daily_task = require ('../../model/Admin/daily_task')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');

module.exports = {
    
  add_task: async(req, res)=> {
    try {
      let userId = req.user._id;
      const v = new Validator(req.body, {
        task_type: "required"
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
      const bottleTime = await daily_task.create({
        userId: userId,
        task_type: req.body.task_type,
        ...req.body,
      })
          
      return helper.success(res, "Daily task added successfully", bottleTime)
    } catch (error) {
        console.log(error);
      }
  },

  task_list: async(req, res)=> {
    try {
      let babyId = req.body.babyId;
      const findDailyTask = await daily_task.find({babyId});
      
      return helper.success(res, "Baby daily task list", findDailyTask)
    } catch (error) {
      console.log(error);
    }
  }


}