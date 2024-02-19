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
          return helper.success(res, "reminder added successfully")
      } catch (error) {
          console.log(error)
      }
  }, 

  reminder_list: async(req, res)=> {
  try {
      let userId = req.user._id;
      const reminderList = await reminderModel.find({ userId: userId, deleted: false }).sort ({createdAt: -1}).populate("activityIds")
      if (!reminderList) {
        return helper.failed(res, "No reminder found")
      }
      return helper.success(res, "reminder list", reminderList)
  } catch (error) {
      console.log(error);
      return helper.failed(res, "something went wrong") 
  }
  },

  delete_reminder: async(req, res)=> {
    try {
      const v = new Validator(req.body, {
        reminderId: "required"
      })
      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, errorResponse);
      }
      const removeReminder = await reminderModel.findByIdAndUpdate({_id:req.body.reminderId},  
        {deleted: true}
      ); 
      
      return helper.success(res, "reminder deleted successfully")

    } catch (error) {
      console.log(error)
    }
  },

  do_not_disturb: async(req, res)=> {
     try {
      // console.log(req.body);return
      const reminderStatus = await reminderModel.updateOne({
        _id: req.body.id},
        {status : req.body.status});

        if (!reminderStatus) {
          return helper.failed(res, "Something went wrong")
        }
        const updatedReminder = await reminderModel.findOne({_id: req.body.id})
        
        return helper.success(res,  "Reminder off successfully", updatedReminder)
     } catch (error) {
      console.log(error)
      return helper.failed(res, "Internal server error")
     } 
  }


}