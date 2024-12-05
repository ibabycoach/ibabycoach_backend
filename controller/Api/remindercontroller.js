const reminderModel = require("../../model/Admin/reminder");
const helper = require("../../Helper/helper");
const { Validator } = require("node-input-validator");
const moment = require("moment");
var cron = require("node-cron");

const pushCroneHandler = async () => {
  try {
    const startDateTime = moment().subtract(1, "second").startOf("second").format("YYYY-MM-DDTHH:mm:ss");
    const endDateTime = moment().add(1, "second").endOf("second").format("YYYY-MM-DDTHH:mm:ss");

    let reminders = await reminderModel
      .find({upcoming_time: {$gte: new Date(startDateTime),$lte: new Date(endDateTime)}, deleted:false, reminder_type:2})
      .populate("userId", "name relation image device_token")
      .populate("activityIds", "activity_name image bg_color")
      .populate("babyId", "baby_name");

    for (let i = 0; i < reminders.length; i++) {
      const { _id, duration, duration_type, userId, device_token } = reminders[i];
     
      if (reminders) {
        const payLoad = {
          sender_name: reminders[i].userId.name,
          device_token: reminders[i].userId.device_token,
          message: `${reminders[i].activityIds?.activity_name} reminder for ${reminders[i].babyId.baby_name}`,
          activityIds: reminders[i].activityIds._id,
          activity_name: reminders[i].activityIds.activity_name,
          image: reminders[i].activityIds.image,
          bg_color: reminders[i].activityIds.bg_color,
          type: 1,
        };
        const upcoming_time = moment().add(duration, duration_type).valueOf();
        await reminderModel.updateOne({ _id }, { $set: { upcoming_time } });
        await helper.send_push_notifications(payLoad);
      }
    }
  } catch (error) {
    console.log("crone erro =============>", error);
  }
};

//Schedule a task to run every hour
cron.schedule(" * * * * *", async () => {
  console.log("running a task every minute");
  pushCroneHandler();
  return;
  
});

module.exports = {
  
  add_reminder: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        activityId: "required",
        time: "required",
        // duration: "required",
      });

      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, errorResponse);
      }

      let userId = req.user.id;
      const addreminder = await reminderModel.create({
        userId,
        activityIds: req.body.activityId,
        time: req.body.time,
        upcoming_time: req.body.time,
        ...req.body,
      });
      return helper.success(res, "reminder added successfully");
    } catch (error) {
      console.log(error);
    }
  },

  delete_reminder: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        reminderId: "required",
      });
      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, errorResponse);
      }
      const removeReminder = await reminderModel.findByIdAndUpdate(
        { _id: req.body.reminderId },
        { deleted: true }
      );

      return helper.success(res, "reminder deleted successfully");
    } catch (error) {
      console.log(error);
    }
  },

  do_not_disturb: async (req, res) => {
    try {
      const reminderStatus = await reminderModel.updateOne(
        { _id: req.body.id },
        { status: req.body.status }
      );

      if (!reminderStatus) {
        return helper.failed(res, "Something went wrong");
      }
      const updatedReminder = await reminderModel.findOne({ _id: req.body.id });
      if (!updatedReminder) {
        return helper.failed(res, "reminder not found", {});
      }

      return helper.success(
        res,
        "Reminder status changed successfully",
        updatedReminder
      );
    } catch (error) {
      console.log(error);
      return helper.failed(res, "Internal server error");
    }
  },

  change_reminder_status: async (req, res) => {
    try {
      const { status, babyId } = req.body;
      const userId = req.user._id;

      const updateReminderStatus = await reminderModel.updateMany(
        { babyId: babyId },
        { status: status }
      );

      if (!updateReminderStatus) {
        return helper.error(res, "Unable to update reminder status");
      }

      return helper.success(res, "Reminder status updated successfully", {});
    } catch (error) {
      console.log(error);
      return helper.failed(res, error);
    }
  },

  reminder_list: async (req, res) => {
    try {
      let babyId = req.body.babyId;
      const reminderData = await reminderModel
        .find({ babyId: babyId, deleted: false })
        .sort({ createdAt: -1 })
        .populate("userId", "name image")
        .populate("activityIds", "activity_name image bg_color ");

      return helper.success(res, "Reminder list", reminderData);
    } catch (error) {
      console.log(error);
      return helper.failed(res, "Something went wrong");
    }
  },

  reminder_detail: async(req, res)=> {
    try {
      const v = new Validator(req.body, {
        reminderId: "required"
      })
      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, errorResponse);
      }

      let reminderId = req.body.reminderId
    const reminderDetails = await reminderModel.findOne({_id: reminderId, deleted:false})
    .populate('userId', 'name image relation')
    .populate('babyId')
    .populate('activityIds', 'activity_name image bg_color image_theme')

    return helper.success(res, "Reminder details", reminderDetails)
    } catch (error) {
      console.log(error);
    }
  },

  edit_reminder: async(req, res)=> {
    try {
      const v = new Validator(req.body, {
        reminderId: "required"
      })
      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, errorResponse);
      }
      
      // let routineId = req.body.routineId;
      const updatedreminder = await reminderModel.findByIdAndUpdate({_id: req.body.reminderId},
      {
        ...req.body
      });
      
      return helper.success(res, "Reminder updated successfully" )
    } catch (error) {
      console.log(error);
    }
  },


};
