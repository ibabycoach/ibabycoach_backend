const reminderModel = require ('../../model/Admin/reminder')
const activity_model = require ('../../model/Admin/activity')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');
var cron = require('node-cron');

// Schedule a task to run every hour
cron.schedule('* * * * *', async () => {
  console.log('running a task every minute');

const gettime = await reminderModel.findOne({})

});


module.exports = { 

  add_reminder: async(req, res)=> {
      try {
        const v = new Validator(req.body, {
          activityId: "required",
          // time: "required",
          // duration: "required",
          // upcoming_time: "required"
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
          console.log(error);
      }
  }, 

  // reminder_list: async(req, res)=> {
  // try {
  //     let userId = req.user._id;
  //     const reminderList = await reminderModel.find({ userId: userId, deleted: false }).sort ({createdAt: -1}).populate("activityIds")
  //     if (!reminderList) {
  //       return helper.failed(res, "No reminder found")
  //     }
  //     return helper.success(res, "reminder list", reminderList)
  // } catch (error) {
  //     console.log(error);
  //     return helper.failed(res, "something went wrong") 
  // }
  // },

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
  },


  reminder_list: async (req, res) => {
    try {
        let userId = req.user._id;
        const reminderList = await reminderModel.find({ userId: userId, deleted: false }).sort({ createdAt: -1 }).populate("activityIds");
        if (!reminderList || reminderList.length === 0) {
            return helper.failed(res, "No reminder found");
        }

        // Map reminderList to include duration and remaining time in time key
        const formattedReminderList = reminderList.map(reminder => {
            const currentTime = new Date();
            const reminderTime = new Date(reminder.time);
            const durationInMillis = reminderTime.getTime() - currentTime.getTime();
            const durationInMinutes = Math.round(durationInMillis / (1000 * 60)); // Convert duration to minutes

            // Calculate remaining time from the current time until the reminder time
            const remainingTimeInMillis = reminderTime.getTime() - currentTime.getTime();
            const remainingMinutes = Math.ceil(remainingTimeInMillis / (1000 * 60));

            // Format remaining time
            const remainingHours = Math.floor(remainingMinutes / 60);
            const remainingDays = Math.floor(remainingHours / 24);
            const formattedRemainingTime = `${remainingDays > 0 ? remainingDays + ' days ' : ''}${remainingHours % 24} hours ${remainingMinutes % 60} minutes`;

            return {
                _id: reminder._id,
                userId: reminder.userId,
                activityIds: reminder.activityIds,
                time: {
                    reminderTime: reminder.time,
                    duration: durationInMinutes + ' minutes', // Include duration in the "time" key
                    remaining_time: formattedRemainingTime // Include formatted remaining time
                },
                status: reminder.status,
                deleted: reminder.deleted,
                createdAt: reminder.createdAt,
                updatedAt: reminder.updatedAt
            };
        });

        return helper.success(res, "Reminder list", formattedReminderList);
    } catch (error) {
        console.log(error);
        return helper.failed(res, "Something went wrong");
    }
}













}