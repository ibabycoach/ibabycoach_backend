const reminderModel = require("../../model/Admin/reminder");
const helper = require("../../Helper/helper");
const { Validator } = require("node-input-validator");
const moment = require("moment");
var cron = require("node-cron");

const pushCroneHandler = async () => {
  try {
    const startDateTime = moment().subtract(1, "second").valueOf();
    const endDateTime = moment().add(1, "second").valueOf();
    const reminders = await reminderModel
      .find({ upcoming_time: { $gte: startDateTime, $lte: endDateTime }, })
      .populate({ path: "userId" });
      
    for (let i = 0; i < reminders.length; i++) {
      const { _id, duration, duration_type, userId } = reminders[i];
      const payLoad = {
        sender_name: "",
        device_token: "",
        message: {},
        type: 2,
      };
      const upcoming_time = moment().add(duration, duration_type).valueOf();
      await reminderModel.updateOne({ _id }, { $set: { upcoming_time } });
      await helper.send_push_notifications(payLoad);
    }
  } catch (err) {
    console.log("crone erro =============>", err);
  }
};

//Schedule a task to run every hour
cron.schedule("*/1 * * * * *", async () => {
  console.log("running a task every minute");
  pushCroneHandler();
  return;
  // const currentDateTime = moment().valueOf();
  // const dateTime = currentDateTime.toISOString();
  // formattedCurrentDateTime = dateTime.slice(0, -5) + ".000+00:00";
  // // console.log(formattedCurrentDateTime, "reminder found");return
  // const reminderCount = await reminderModel.count({
  //   upcoming_time: formattedCurrentDateTime,
  // });

  // if (reminderCount) {
  //   const reminderData = await reminderModel
  //     .find({ upcoming_time: formattedCurrentDateTime })
  //     .sort({ createdAt: -1 })
  //     .populate("userId", "name image")
  //     .populate("activityIds", "activity_name image bg_color ");

  //   for (let data of reminderData) {
  //     let hour = data.duration;
  //     let currentDate_hours = formattedCurrentDateTime + hour;
  //     const updatedTiming = currentDate_hours;

  //     await reminderModel.findByIdAndUpdate(
  //       { _id: data._id },
  //       { upcoming_time: updatedTiming }
  //     );
  //     await helper.send_push_notifications(reminderData);
  //   }
  // }
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
        {
          _id: req.body.id,
        },
        { status: req.body.status }
      );

      if (!reminderStatus) {
        return helper.failed(res, "Something went wrong");
      }
      const updatedReminder = await reminderModel.findOne({ _id: req.body.id });

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

      // Update the reminder status for the user
      const updateReminderStatus = await reminderModel.updateMany(
        { babyId: babyId },
        { status: status } // Set the new status
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
      const reminderData = await reminderModel.find({ babyId: babyId, deleted: false }).sort({ createdAt: -1 })
        .populate("userId", "name image")
        .populate("activityIds", "activity_name image bg_color ");

      return helper.success(res, "Reminder list", reminderData);
    } catch (error) {
      console.log(error);
      return helper.failed(res, "Something went wrong");
    }
  },


};
