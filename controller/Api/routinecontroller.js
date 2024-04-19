const routinebuilder = require('../../model/Admin/routinebuilder')
const activity_model = require('../../model/Admin/activity')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');
const daily_task = require('../../model/Admin/daily_task');
const moment = require("moment");
var cron = require("node-cron");

const pushCroneHandler = async () => {
  try {
    const startDateTime = moment().subtract(1, "second").startOf("second").format("YYYY-MM-DDTHH:mm:ss");
    const endDateTime = moment().add(1, "second").endOf("second").format("YYYY-MM-DDTHH:mm:ss");

    let routinereminders = await routinebuilder
      .find({upcoming_time: {$gte: new Date(startDateTime),$lte: new Date(endDateTime)}})
      .populate("userId", "name relation image device_token")
      .populate("activityIds", "activity_name image bg_color")
      .populate("babyId", "baby_name");

    for (let i = 0; i < routinereminders.length; i++) {
      const { _id, duration, duration_type, userId, device_token } = routinereminders[i];
      // routinereminders[i].activityIds._id = routinereminders[i].activityIds?._id?.toString();
      // const activityData = { ...routinereminders[i].activityIds?._doc,
      //   _id: routinereminders[i].activityIds?._id?.toString(),
      // };
      if (routinereminders) {
        const payLoad = {
          sender_name: routinereminders[i].userId.name,
          device_token: routinereminders[i].userId.device_token,
          message: `${routinereminders[i].activityIds.activity_name} reminder for ${routinereminders[i].babyId.baby_name}`,
          activityIds: routinereminders[i].activityIds._id,
          activity_name: routinereminders[i].activityIds.activity_name,
          image: routinereminders[i].activityIds.image,
          bg_color: routinereminders[i].activityIds.bg_color,
          type: 4,
        };
        const upcoming_time = moment().add(duration, duration_type).valueOf();
        await routinebuilder.updateOne({ _id }, { $set: { upcoming_time } });
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

  add_routine: async(req, res)=> {
    try {
      const v = new Validator(req.body, {
        activityId: "required",
        babyId: "required",
        day: "required",
        // time: "required"
      });
        
      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, errorResponse);
      }
       
      let userId = req.user.id;
        const addroutine = await routinebuilder.create({ 
          userId,
          activityIds: req.body.activityId,
          upcoming_time: req.body.time,
          ...req.body
        })
        return helper.success(res, "routine added successfully")
    } catch (error) {
        console.log(error)
      }
  },  

  get_day_routine: async (req, res) => {
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
        query.day = new RegExp(req.body.day_name, 'i'); // 'i' for case-insensitive
      }
      
      const get_baby_routine = await routinebuilder.find(query).populate('activityIds', 'activity_name image bg_color')
      .populate('userId', 'name relation');
      
      if (!req.body.day_name) {
        return helper.success(res, "Baby routine", get_baby_routine);
      }

      // If day_name is provided, filter the routine based on the day_name
      let data = get_baby_routine.filter(element => element.day.includes(req.body.day_name));
  
      return helper.success(res, "Baby routine", data);
    } catch (error) {
      console.log(error);
      return helper.failed(res, "Something went wrong");
    }
  },

  get_customized_routine: async (req, res) => {
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
      let query = { babyId: babyId, routine_type: "2", deleted:false  };
  
      if (req.body.day_name) {
        // If the day is specified, add it to the query using regex
        query.day = new RegExp(req.body.day_name, 'i'); // 'i' for case-insensitive
      }
      const get_baby_routine = await routinebuilder.find(query).populate('activityIds', 'activity_name image');

      if (!req.body.day_name) {
        return helper.success(res, "Baby customized routine", get_baby_routine);
      }
  
      // If day_name is provided, filter the routine based on the day_name
      let customiseddata = get_baby_routine.filter(element => element.day.includes(req.body.day_name));
  
      return helper.success(res, "Baby routine", customiseddata);
    } catch (error) {
      console.log(error)
      return helper.failed(res, "Something went wrong");
    }
  },

  delete_routine: async (req, res) => {
    try {
        const v = new Validator(req.body, {
            routineId: "required",
            dayToRemove: "required|string" // New parameter for the day to remove
        });
        const errorResponse = await helper.checkValidation(v);
        if (errorResponse) {
            return helper.failed(res, errorResponse);
        }
        let routineId = req.body.routineId;
        let dayToRemove = req.body.dayToRemove.trim(); // Get the day to remove from the request body

        // Find the routine by ID
        const routine = await routinebuilder.findById(routineId);
        if (!routine) {
            return helper.failed(res, "Routine not found");
        }

        // Split the days string into an array
        let daysArray = routine.day.split(",").map(day => day.trim());

        // Find the index of the day to remove
        let index = daysArray.indexOf(dayToRemove);
        if (index !== -1) {
            // Remove the day from the array
            daysArray.splice(index, 1);

            // Join the array back into a string
            const updatedDayString = daysArray.join(", ");
            // console.log( updatedDayString, ">>>>>");return

            // Update the routine with the modified days string
            const updateRoutine = await routinebuilder.findByIdAndUpdate(
                routineId,
                { day: updatedDayString },
                { new: true }
            );

            return helper.success(res, `${dayToRemove} removed from routine successfully`);
        } else {
            return helper.failed(res, `${dayToRemove} not found in routine`);
        }
    } catch (error) {
        console.log(error);
        
    }
  },

  get_activityByAdmin: async(req, res)=> {
    try {
        const getactivity = await activity_model.find({activity_type:1, deleted: false})
        return helper.success(res, "activity list", getactivity )
    } catch (error) {
        console.log(error)
    }
  },

  get_routine: async(req, res)=> {
    try {
      const v = new Validator(req.body, {
        babyId: "required"
      })
      const errorResponse = await helper.checkValidation(v);
      if(errorResponse) {
        return helper.failed(res, "something went wrong")
      }

      let babyId = req.body.babyId
    const get_baby_memories = await routinebuilder.find({babyId: babyId, deleted:false});

    return helper.success(res, "baby routine", get_baby_memories)

    } catch (error) {
      console.log(error);
    }
  },

  edit_routine: async(req, res)=> {
      try {
        
        const v = new Validator(req.body, {
          routineId: "required"
        })
        const errorResponse = await helper.checkValidation(v);
        if (errorResponse) {
          return helper.failed(res, errorResponse);
        }
        
        let routineId = req.body.routineId;
        const updateroutine = await routinebuilder.findByIdAndUpdate({_id: req.body.routineId},
        {
          ...req.body
        });
        
        const updatedroutine = await routinebuilder.findOne({_id: req.body.routineId})
        return helper.success(res, "routine updated successfully", updatedroutine )

      } catch (error) {
        console.log(error);
      }
  },

  assign_task: async(req, res)=> {
    try {
      const v = new Validator(req.body, {
        activityId: "required",
        subuserId: "required"
      })
      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, errorResponse);
      }
      let userId = req.user.id;
      const assignTask = await daily_task.create({userId,
      ...req.body
    })
    return helper.success(res, "daily task has been added", assignTask)
    } catch (error) {
      console.log(error);
    }
  }



}