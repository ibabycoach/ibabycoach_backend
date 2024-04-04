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
      .find({upcoming_time: {$gte: new Date(startDateTime),$lte: new Date(endDateTime)}})
      .populate("userId", "name relation image device_token")
      .populate("activityIds", "activity_name image bg_color");

    for (let i = 0; i < reminders.length; i++) {
      const { _id, duration, duration_type, userId, device_token } = reminders[i];
      // reminders[i].activityIds._id = reminders[i].activityIds?._id?.toString();

      // const activityData = { ...reminders[i].activityIds?._doc,
      //   _id: reminders[i].activityIds?._id?.toString(),
      // };
      if (reminders) {
        const payLoad = {
          sender_name: reminders[i].userId.name,
          device_token: reminders[i].userId.device_token,
          message: `${reminders[i].activityIds.activity_name} Reminder`,
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
  } catch (err) {
    console.log("crone erro =============>", err);
  }
};

//Schedule a task to run every hour
cron.schedule("*/1 * * * * *", async () => {
  // console.log("running a task every minute");
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

  // reminder_list: async (req, res) => {
  //   try {
  //     let babyId = req.body.babyId;
  //     const reminderData = await reminderModel
  //       .find({ babyId: babyId, deleted: false })
  //       .sort({ createdAt: -1 })
  //       .populate("userId", "name image")
  //       .populate("activityIds", "activity_name image bg_color ");

  //     if (!reminderData || reminderData.length === 0) {
  //       return helper.failed2(res, "No reminder found");
  //     }

  //     // Map reminderData to include duration and remaining time in time key
  //     const reminderList = reminderData.map(async (reminder) => {
  //       const reminder_start_time = new Date(reminder.time);
  //       const duration = parseFloat(reminder.duration); // Convert duration to a number
  //       const durationType = reminder.duration_type;
  //       const currentTime = new Date();

  //       // Calculate total time by adding the duration to the reminder start time
  //       let totalTime = new Date(reminder_start_time);
  //       if (durationType === "hours") {
  //         totalTime.setHours(totalTime.getHours() + duration);
  //       } else if (durationType === "minutes") {
  //         totalTime.setMinutes(totalTime.getMinutes() + duration);
  //       }

  //       if (!reminder.reminder_time) {
  //         reminder.reminder_time = new Date(reminder_start_time);
  //       }

  //       // If currentTime is equal to or greater than reminder_time, add duration to reminder_time
  //       if (currentTime >= reminder.reminder_time) {
  //         if (durationType === "hours") {
  //           reminder.reminder_time.setHours(
  //             reminder.reminder_time.getHours() + duration
  //           );
  //         } else if (durationType === "minutes") {
  //           reminder.reminder_time.setMinutes(
  //             reminder.reminder_time.getMinutes() + duration
  //           );
  //         }
  //         // Update upcoming_time to reminder_time if currentTime is equal to or greater than reminder_time
  //         reminder.upcoming_time = new Date(reminder.reminder_time);

  //         // Update the upcoming_time in database
  //         await reminderModel.findOneAndUpdate(
  //           { _id: reminder._id },
  //           { upcoming_time: reminder.upcoming_time }
  //         );
  //       }
  //       return {
  //         _id: reminder._id,
  //         userId: reminder.userId,
  //         babyId: reminder.babyId,
  //         activityIds: reminder.activityIds,
  //         time: {
  //           reminder_start_time: reminder_start_time,
  //           duration: reminder.duration,
  //           reminder_time: reminder.reminder_time,
  //           currentTime: currentTime,
  //         },
  //         upcoming_time: reminder.upcoming_time,
  //         status: reminder.status,
  //         createdAt: reminder.createdAt,
  //         updatedAt: reminder.updatedAt,
  //       };
  //     });

  //     const reminderListWithUpdatedTime = await Promise.all(reminderList);

  //     return helper.success(res, "Reminder list", reminderListWithUpdatedTime);
  //   } catch (error) {
  //     console.log(error);
  //     return helper.failed(res, "Something went wrong");
  //   }
  // },

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
};
