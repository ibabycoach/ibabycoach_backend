const activity_model = require ('../../model/Admin/activity')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');
const moment = require("moment");
var cron = require("node-cron");

const pushCroneHandler = async () => {
    try {
      const startDateTime = moment().subtract(1, "second").startOf("second").format("YYYY-MM-DDTHH:mm:ss");
      const endDateTime = moment().add(1, "second").endOf("second").format("YYYY-MM-DDTHH:mm:ss");
  
      let activityReminders = await activity_model
        .find({upcoming_time: {$gte: new Date(startDateTime),$lte: new Date(endDateTime)}})
        .populate("userId", "name relation image device_token")
        // .populate("activityIds", "activity_name image bg_color")
        .populate("babyId", "baby_name");
  
      for (let i = 0; i < activityReminders.length; i++) {
        const { _id, duration, duration_type, userId, device_token } = activityReminders[i];
        
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
cron.schedule("* * * * *", async () => {
    // console.log("running a task every minute");
    pushCroneHandler();
    return;
  });

module.exports = { 

    customizable_activity: async(req, res)=> {
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
                ...req.body
            });

            return helper.success(res, "customized activity added successfully")
        } catch (error) {
            console.log(error);
        }
    },

    get_activity: async(req, res)=> {
        try {
            let userId = req.user._id;
             let adminActivities = await activity_model.find({ activity_type: '1', deleted: false});
             let userActivities = await activity_model.find({ babyId: req.body.babyId, activity_type: '2', deleted: false});

             //we can use the spread operator to merge the multiple arrays
             let getactivity = [...adminActivities, ...userActivities];
           

            return helper.success(res, "activity list", getactivity )
        } catch (error) {
            console.log(error)
            return helper.failed(res, "Something went wrong");
        }
    },

    edit_activity: async(req, res)=> {
        try {
            const v = new Validator(req.body, {
                activityId: "required",
            }) 
            const errorResponse = await helper.checkValidation(v);
            if (errorResponse) {
                return helper.failed(res, errorResponse);
            }

            let activityId = req.body.activityId;
            const editActivity = await activity_model.findOneAndUpdate({_id: req.body.activityId},
                {   ...req.body });

                const findactivity = await activity_model.findOne({_id:req.body.activityId})
            return helper.success(res, "activity updated successfully", findactivity)

        } catch (error) {
            console.log(error)
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
          let query = { babyId: babyId, deleted: false};
          
          if (req.body.day_name) {
            // If the day is specified, add it to the query using regex
            query.day = new RegExp(req.body.day_name, 'i'); // 'i' for case-insensitive
          }
          
          const get_baby_activity = await activity_model.find(query).populate('userId', 'name relation')
          
          if (!req.body.day_name) {
            return helper.success(res, "Baby activity", get_baby_activity);
          }
    
          // If day_name is provided, filter the routine based on the day_name
          let datas = get_baby_activity.filter(element => element.day.includes(req.body.day_name));
      
          return helper.success(res, "Baby activity", datas);
        } catch (error) {
          console.log(error);
          return helper.failed(res, "Something went wrong");
        }
    },

    // customized activity by user
    get_customized_activity: async(req, res)=> {
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
            let query = { babyId: babyId, deleted: false};
            
            if (req.body.day_name) {
              // If the day is specified, add it to the query using regex
              query.day = new RegExp(req.body.day_name, 'i'); // 'i' for case-insensitive
            }
            
            const baby_customized_activity = await activity_model.find({babyId: req.body.babyId, deleted:false}).populate('userId', 'name relation')
            
            if (!req.body.day_name) {
              return helper.success(res, "Baby customized activity", baby_customized_activity);
            }
      
            // If day_name is provided, filter the routine based on the day_name
            let datas = baby_customized_activity.filter(element => element.day.includes(req.body.day_name));
        
            return helper.success(res, "Baby customized activity", datas);
        } catch (error) {
            console.log(error);
            return helper.failed(res, "Something went wrong");
        }
    },

    delete_activity: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                activityId: "required",
                dayToRemove: "required|string" // New parameter for the day to remove
            });
            const errorResponse = await helper.checkValidation(v);
            if (errorResponse) {
                return helper.failed(res, errorResponse);
            }
            let activityId = req.body.activityId;
            let dayToRemove = req.body.dayToRemove.trim(); // Get the day to remove from the request body
    
            // Find the activity by ID
            const activity = await activity_model.findById(activityId);
            if (!activity) {
                return helper.failed(res, "activity not found");
            }
    
            // Split the days string into an array
            let daysArray = activity.day.split(",").map(day => day.trim());
    
            if (daysArray.every(day => day == '')) {
                // Update the routine to set deleted to true
                await activity_model.findByIdAndUpdate(
                    activityId,
                    { deleted: true },
                    { new: true }
                );
                return helper.success(res, "Routine deleted successfully");
            }

            // Find the index of the day to remove
            let index = daysArray.indexOf(dayToRemove);

            
            if (index !== -1) {
                // Remove the day from the array
                daysArray.splice(index, 1);
    
                // Join the array back into a string
                const updatedDayString = daysArray.join(", ");
                // console.log( updatedDayString, ">>>>>");return
    
                // Update the activity with the modified days string
                const updateactivity = await activity_model.findByIdAndUpdate(
                    activityId,
                    { day: updatedDayString },
                    { new: true }
                );
    
                return helper.success(res, `${dayToRemove} removed from activity successfully`);
            } else {
                return helper.failed(res, `${dayToRemove} not found in activity`);
            }
        } catch (error) {
            console.log(error);
            
        }
    },



}


