const activity_model = require("../../model/Admin/activity");
const dailytaskModel = require("../../model/Admin/daily_task");
const helper = require("../../Helper/helper");
const { Validator } = require("node-input-validator");
const moment = require("moment");
var cron = require("node-cron");

const pushCroneHandler = async () => {
  try {
    const startDateTime = moment()
      .subtract(1, "second")
      .startOf("second")
      .format("YYYY-MM-DDTHH:mm:ss");
    const endDateTime = moment()
      .add(1, "second")
      .endOf("second")
      .format("YYYY-MM-DDTHH:mm:ss");

    let activityReminders = await activity_model
      .find({
        upcoming_time: {
          $gte: new Date(startDateTime),
          $lte: new Date(endDateTime),
        },
      })
      .populate("userId", "name relation image device_token")
      // .populate("activityIds", "activity_name image bg_color")
      .populate("babyId", "baby_name");

    for (let i = 0; i < activityReminders.length; i++) {
      const { _id, duration, duration_type, userId, device_token } =
        activityReminders[i];

      if (activityReminders) {
        const payLoad = {
          sender_name: activityReminders[i].userId.name,
          device_token: activityReminders[i].userId.device_token,
          message: `${activityReminders[i].activity_name} reminder for ${activityReminders[i].babyId.baby_name}`,
          activityIds: activityReminders[i]._id,
          activity_name: activityReminders[i].activity_name,
          image: activityReminders[i].image,
          bg_color: activityReminders[i].bg_color,
          type: 3,
        };
        const upcoming_time = moment().add(duration, duration_type).valueOf();
        await activity_model.updateOne({ _id }, { $set: { upcoming_time } });
        await helper.send_push_notifications(payLoad);
      }
    }
  } catch (error) {
    console.log("crone erro =============>", error);
  }
};

//Schedule a task to run every hour
cron.schedule(" * * * * *", async () => {
  // console.log("running a task every minute");
  pushCroneHandler();
  return;
});

module.exports = {
  customizable_activity: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        activity_name: "required",
        babyId: "required",
        // day: "required",
        // time: "required",
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
      const upcomingTime = new Date();
      let userId = req.user.id;
      const addactivity = await activity_model.create({
        userId,
        upcoming_time: upcomingTime,
        ...req.body,
      });

      return helper.success(res, "customized activity added successfully");
    } catch (error) {
      console.log(error);
    }
  },

  get_activity: async (req, res) => {
    try {

      let adminActivities = await activity_model
        .find({ activity_type: "1", status: 1, deleted: false })
        .lean();
      let userActivities = await activity_model
        .find({
          babyId: req.body.babyId,
          activity_type: "2",
          status: 1,
          deleted: false,
        })
        .lean();

      //we can use the spread operator to merge the multiple arrays
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      const allActivities = [...adminActivities, ...userActivities];

      const activitiesWithStats = await Promise.all(
        allActivities.map(async (activity) => {
          const [lastDailyTask, tasksCount] = await Promise.all([
            dailytaskModel
              .findOne({ activityIds: activity._id,             babyId: req.body.babyId, deleted: false })
              .sort({ start_time: -1 })
              .lean(),
            dailytaskModel.countDocuments({
              babyId: req.body.babyId,
              activityIds: activity._id,
              deleted: false,
              start_time: { $gte: startOfToday, $lte: endOfToday },
            }),
          ]);

          return {
            ...activity,
            lastUsed: lastDailyTask ? lastDailyTask.start_time : null,
            totalTasks: tasksCount,
          };
        })
      );
      return helper.success(res, "activity list", activitiesWithStats);
    } catch (error) {
      console.log(error);
      return helper.failed(res, "Something went wrong");
    }
  },
  edit_activity: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        activityId: "required",
      });
      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, errorResponse);
      }

      if (req.files && req.files.image_theme) {
        var image_theme = req.files.image_theme;
        if (image_theme) {
          req.body.image_theme = helper.imageUpload(image_theme, "images");
        }
      }
       if (req.files && req.files.image) {
        var image = req.files.image;
        if (image) {
          req.body.image = helper.imageUpload(image, "images");
        }
      }

      let activityId = req.body.activityId;
      const editActivity = await activity_model.findOneAndUpdate(
        { _id: req.body.activityId },
        { ...req.body }
      );

      const findactivity = await activity_model.findOne({
        _id: req.body.activityId,
      });
      return helper.success(res, "activity updated successfully");
    } catch (error) {
      console.log(error);
    }
  },

  get_day_activity: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        babyId: "required",
        day_name: "string",
      });

      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, "Something went wrong");
      }

      let babyId = req.body.babyId;
      let query = { babyId: babyId, deleted: false };

      if (req.body.day_name) {
        // If the day is specified, add it to the query using regex
        query.day = new RegExp(req.body.day_name, "i"); // 'i' for case-insensitive
      }

      const get_baby_activity = await activity_model
        .find(query)
        .populate("userId", "name relation");

      if (!req.body.day_name) {
        return helper.success(res, "Baby activity", get_baby_activity);
      }

      // If day_name is provided, filter the routine based on the day_name
      let datas = get_baby_activity.filter((element) =>
        element.day.includes(req.body.day_name)
      );

      return helper.success(res, "Baby activity", datas);
    } catch (error) {
      console.log(error);
      return helper.failed(res, "Something went wrong");
    }
  },

  // customized activity by user
  get_customized_activity: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        babyId: "required",
        // day_name: "string",
      });

      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, "Something went wrong");
      }

      let babyId = req.body.babyId;
      let query = { babyId: babyId, deleted: false };

      if (req.body.day_name) {
        // If the day is specified, add it to the query using regex
        query.day = new RegExp(req.body.day_name, "i"); // 'i' for case-insensitive
      }

      const baby_customized_activity = await activity_model
        .find({ babyId: req.body.babyId, status: 1, deleted: false })
        .populate("userId", "name relation");
      const baby_inactive_activity = await activity_model
        .find({ babyId: req.body.babyId, status: 0, deleted: false })
        .populate("userId", "name relation");
      const allStatus_activity = await activity_model
        .find({ babyId: req.body.babyId, deleted: false })
        .populate("userId", "name relation");

      if (!req.body.day_name) {
        return helper.success(res, "Baby customized activity", {
          baby_customized_activity,
          baby_inactive_activity,
          allStatus_activity,
        });
      }

      // If day_name is provided, filter the routine based on the day_name
      let datas = baby_customized_activity.filter((element) =>
        element.day.includes(req.body.day_name)
      );
      let datas2 = baby_inactive_activity.filter((element) =>
        element.day.includes(req.body.day_name)
      );
      let datas3 = allStatus_activity.filter((element) =>
        element.day.includes(req.body.day_name)
      );

      return helper.success(res, "Baby customized activity", {
        datas,
        datas2,
        datas3,
      });
    } catch (error) {
      console.log(error);
      return helper.failed(res, "Something went wrong");
    }
  },

  get_custom_activity_detail: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        customized_ActivityId: "required",
      });

      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, errorResponse);
      }

      let customized_ActivityId = req.body.customized_ActivityId;

      const customized_activity = await activity_model
        .findOne({ _id: customized_ActivityId, deleted: false })
        .populate("userId", "name relation")
        .populate("babyId", "baby_name birthday bg_color image gender");

      return helper.success(
        res,
        "Baby customized activity",
        customized_activity
      );
    } catch (error) {
      console.log(error);
      return helper.failed(res, "Something went wrong");
    }
  },

  delete_activity: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        activityId: "required",
      });
      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, errorResponse);
      }
      let activityId = req.body.activityId;

      const deleteactivity = await activity_model.findByIdAndUpdate(
        activityId,
        { deleted: true },
        { new: true }
      );
      if (deleteactivity) {
        await dailytaskModel.updateMany(
          { activityIds: activityId },
          { deleted: true }
        );
      }
      // const delete_daily_task = await dailytaskModel.findOneAndUpdate({activityIds: activityId},
      //     {deleted:true});

      return helper.success(res, "Activity deleted successfully");
    } catch (error) {
      console.log(error);
    }
  },

  
};
