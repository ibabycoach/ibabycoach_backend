const reminderModel = require ('../../model/Admin/reminder')
const activity_model = require ('../../model/Admin/activity')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');
var cron = require('node-cron');

// Schedule a task to run every hour
// cron.schedule('* * * * *', async () => {
//   console.log('running a task every minute');

// });

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
      let babyId = req.body.babyId;
      const reminderData = await reminderModel.find({ babyId: babyId, deleted: false }).sort({ createdAt: -1 })
      .populate("activityIds", 'activity_name image bg_color ');

      if (!reminderData || reminderData.length === 0) {
          return helper.failed2(res, "No reminder found");
      }

      // Map reminderData to include duration and remaining time in time key
      const reminderList = reminderData.map(reminder => {
        const reminder_start_time = new Date(reminder.time);
        const duration = parseFloat(reminder.duration); // Convert duration to a number
        const durationType = reminder.duration_type;
          
        // Calculate total time by adding the duration to the reminder start time
        let totalTime = new Date(reminder_start_time);
        if (durationType === "hours") {
          totalTime.setHours(totalTime.getHours() + duration);
        } else if (durationType === "minutes") {
          totalTime.setMinutes(totalTime.getMinutes() + duration);
        }

        // Calculate remaining time from the current time until the total time
        const currentTime = new Date();
        const remainingTimeInMillis = totalTime.getTime() - currentTime.getTime();
        const remainingMinutes = Math.ceil(remainingTimeInMillis / (1000 * 60));

        // Format remaining time
        const remainingHours = Math.floor(remainingMinutes / 60);
        const remainingDays = Math.floor(remainingHours / 24);
        const formattedRemainingTime = `${remainingDays > 0 ? remainingDays + ' days ' : ''}${remainingHours % 24} hours ${remainingMinutes % 60} minutes`;

        return {
          _id: reminder._id,
          userId: reminder.userId,
          babyId: reminder.babyId,
          activityIds: reminder.activityIds,
          time: {
            reminder_start_time: reminder_start_time,
            duration: reminder.duration + ' ' + reminder.duration_type, // Include duration and type in the "time" key
            remaining_time: formattedRemainingTime, // Include formatted remaining time
            reminder_time: totalTime // Include reminder time
          },
          status: reminder.status, 
          createdAt: reminder.createdAt,
          updatedAt: reminder.updatedAt
        };
      });

      return helper.success(res, "Reminder list", reminderList);
    } catch (error) {
      console.log(error);
      return helper.failed(res, "Something went wrong");
    }
  },

  change_reminder_status: async (req, res) => {
    try {
      
      const { status, babyId } = req.body;
      const userId = req.user._id;

      // Update the reminder status for the user
      const updateReminderStatus = await reminderModel.updateMany(
        { babyId: babyId },
        { status: status } // Set the new status
      );

      if (!updateReminderStatus) {
        return helper.error(res, 'Unable to update reminder status');
      }

      return helper.success(res, 'Reminder status updated successfully', {updateReminderStatus});
    } catch (error) {
      console.log(error);
      return helper.failed(res, error);
    }
  },



}