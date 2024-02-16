const reminderModel = require ('../../model/Admin/reminder')
const activity_model = require ('../../model/Admin/activity')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');

module.exports = { 

  add_reminder: async(req, res)=> {
      try {
        const v = new Validator(req.body, {
          activityId: "required",
          time: "required"
          // babyId: "required",
          // day: "required",
        });
          
        const errorResponse = await helper.checkValidation(v);
        if (errorResponse) {
          return helper.failed(res, errorResponse);
        }
          
        let userId = req.user.id;
          const addreminder = await reminderModel.create({ 
            userId,
            activityIds: req.body.activityId,
            ...req.body
          })
          return helper.success(res, "reminder added successfully", addreminder)
      } catch (error) {
          console.log(error)
      }
  }, 

  reminder_list: async(req, res)=> {
  try {
      let userId = req.user._id;
      const reminderList = await reminderModel.find({ userId: userId }).sort ({createdAt: -1}).populate("activityId")
      if (!reminderList) {
          return helper.failed(res, "No reminder found")
      }
      return helper.success(res, "reminder list", reminderList)
  } catch (error) {
      console.log(error);
      return helper.failed(res, "something went wrong") 
  }
  }


}