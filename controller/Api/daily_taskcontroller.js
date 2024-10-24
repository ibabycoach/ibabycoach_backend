const user_model = require ('../../model/Admin/user')
const daily_task = require ('../../model/Admin/daily_task')
const activity_model = require ('../../model/Admin/activity')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');

module.exports = {
    
  add_task: async(req, res)=> {
    try {
      let userId = req.user._id;
      const v = new Validator(req.body, {
        // task_type: "required"
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
      const bottleTime = await daily_task.create({
        userId: userId,
        ...req.body,
      })
          
      return helper.success(res, "Daily task added successfully")
    } catch (error) {
        console.log(error);
      }
  },

  //task list for home page
  task_list: async (req, res) => {
    try {
      let babyId = req.body.babyId;
      const filter = { babyId: babyId, deleted: false };

    if (req.body.start_time) {
      let startDate = req.body.start_time;
      startDate = new Date(startDate);

      var endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      filter.start_time = { $gte: startDate, $lt:endDate};
    }

      const findDailyTasks = await daily_task.find(filter)
      .populate('activityIds', 'activity_name image bg_color is_reaction')
      .populate('userId', 'name relation')
      .sort({ createdAt: -1 });
      
      // Count occurrences of each activity
      const activityCounts = {};
      findDailyTasks.forEach(task => {
        if (Array.isArray(task.activityIds)) {
          task.activityIds.forEach(activity => {
            const activityId = activity?._id.toString(); // Convert ObjectId to string for comparison
            if (activityCounts.hasOwnProperty(activityId)) {
              activityCounts[activityId]++;
            } else {
              activityCounts[activityId] = 1;
            }
          });
        } else {

          const activityId = task.activityIds?._id.toString();
          if (activityCounts.hasOwnProperty(activityId)) {
            activityCounts[activityId]++;
          } else {
            activityCounts[activityId] = 1;
          }
        }
      });
  
      // Include activity count with each task
      const tasksWithCounts = findDailyTasks.map(task => {
        const activitiesWithCount = Array.isArray(task.activityIds) ? 
          task.activityIds.map(activity => ({
            ...activity.toObject(),
            count: activityCounts[activity?._id.toString()] || 0
          })) :
          [{
            ...task.activityIds?.toObject(),
            count: activityCounts[task.activityIds?._id.toString()] || 0
          }];
  
        return {
          ...task.toObject(),
          activityIds: activitiesWithCount
        };
      });
  
      return helper.success(res, "Baby daily task list", tasksWithCounts);
    } catch (error) {
      console.log(error);
    }
  },
  
  // To get last_time of task added with the specific activity
  admin_activity: async (req, res) => {
    try {
      const { activityId, babyId } = req.body;
  
      const admin_activity = await activity_model.findById({ _id: req.body.activityId, activity_type: '1', deleted: false });
  
      const findTask = await daily_task.findOne({ activityIds: activityId, babyId: babyId }).sort({ createdAt: -1 });
  
      let lastEntryTime = null;
      if (findTask) {
        const lastEntryCreatedAt = findTask.createdAt;
        const currentTime = new Date();
        const timeDifferenceMs = currentTime - lastEntryCreatedAt;
  
        const daysDifference = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));
        const hoursDifference = Math.floor((timeDifferenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesDifference = Math.floor((timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60));
  
        if (daysDifference > 0) {
          lastEntryTime = `${daysDifference} days ${hoursDifference} hours ${minutesDifference} minutes`;
        } else if (hoursDifference > 0) {
          lastEntryTime = `${hoursDifference} hours ${minutesDifference} minutes`;
        } else {
          lastEntryTime = `${minutesDifference} minutes`;
        }
      }
  
      const response = {
        admin_activity: admin_activity,
        daily_task: findTask ? { ...findTask.toObject(), last_time: lastEntryTime } : null
      };
  
      return helper.success(res, "Activity list", response);
    } catch (error) {
      console.log(error);
      return helper.failed(res, "Something went wrong");
    }
  },
  
  task_count: async (req, res) => {
    try {
        let { babyId, activityId, date, start_time } = req.body;

        const filter = { babyId: babyId, deleted: false };

        if (start_time) {
            let startDate = new Date(start_time);
            let endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1);
            filter.createdAt = { $gte: startDate, $lt: endDate };
        } else if (!date) {
            throw new Error("Please provide either 'start_time' or 'date'.");
        }

        let dateList = [];
        if (date) {
            const dateRange = date.split(',').map(dateString => new Date(dateString.trim()));
            if (dateRange.length === 2) {
                const startDate = dateRange[0];
                const endDate = new Date(dateRange[1]);
                endDate.setDate(endDate.getDate() + 1); // Increment end date by 1 to include entries up to the end of the day
                filter.createdAt = { $gte: startDate, $lt: endDate };
            } else {
                throw new Error("Invalid date range provided.");
            }
        }

        const uniqueActivities = [];

        const findDailyTasks = await daily_task.find(filter)
            .populate('activityIds', 'activity_name image bg_color')
            .populate('userId', 'name relation');

        // Filter tasks based on activityId if it's provided
        const filteredTasks = activityId ? findDailyTasks.filter(task => {
            if (Array.isArray(task.activityIds)) {
                return task.activityIds?.some(activity => activity?._id.toString() === activityId);
            } else {
                return task.activityIds?._id.toString() === activityId;
            }
        }) : findDailyTasks;

        // Count occurrences of each activity for this date range
        const activityCounts = {};
        filteredTasks.forEach(task => {
            if (Array.isArray(task.activityIds)) {
                task.activityIds.forEach(activity => {
                    const activityId = activity?._id.toString(); // Convert ObjectId to string for comparison
                    if (activityCounts.hasOwnProperty(activityId)) {
                        activityCounts[activityId]++;
                    } else {
                        activityCounts[activityId] = 1;
                    }
                });
            } else {
                const activityId = task.activityIds?._id.toString();
                if (activityCounts.hasOwnProperty(activityId)) {
                    activityCounts[activityId]++;
                } else {
                    activityCounts[activityId] = 1;
                }
            }
        });

        // Create a map to store unique activityIds and their total count for this date range
        const uniqueActivitiesForRange = {};
        filteredTasks.forEach(task => {
            const key = task.activityIds?.toString(); // Using the stringified activityIds as key for uniqueness
            if (!uniqueActivitiesForRange[key]) {
                uniqueActivitiesForRange[key] = {
                    taskData: task.toObject(),
                    total_count: 1 // Initialize total count to 1 for each unique activity
                };
            } else {
                uniqueActivitiesForRange[key].total_count++; // Increment count for each occurrence of the same activity
            }
        });

        // Convert map values to an array of objects for this date range
        const uniqueActivityArrayForRange = Object.values(uniqueActivitiesForRange);

        uniqueActivities.push({ date_range: date, activities: uniqueActivityArrayForRange });

        return helper.success(res, "Unique activities with total count for the specified date range", uniqueActivities);
    } catch (error) {
        console.log(error);
    }
  },

  view_dailyTask: async(req, res) => {
    try {
      // let userId = req.user._id;
  
      const v = new Validator(req.body, {
        dailyTask_id: "required"
      });
      let errorsResponse = await helper.checkValidation(v);
  
      if (errorsResponse) {
        return helper.failed(res, errorsResponse);
      }
  
      const task_details = await daily_task.findOne({ _id: req.body.dailyTask_id, deleted: false })
      .populate("activityIds", "activity_name image bg_color time upcoming_time duration day amount");
  
      if (!daily_task) {
        return helper.failed(res, "Data not found");
      }

      return helper.success(res, "daily task details", task_details);
    } catch (error) {
      console.log(error);
      return helper.failed(res, "Internal server error");
    }
  },

  edit_dailyTask: async(req, res)=> {
    try {
      const v = new Validator(req.body, {
        dailyTask_id: "required"
      })
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

      const updateData = await daily_task.updateOne({_id: req.body.dailyTask_id},
        { ...req.body });
     
      return helper.success(res, "Daily task updated successfully")

    } catch (error) {
      console.log(error)
    }
  },

  delete_task: async(req, res)=> {
    try {
      const v = new Validator(req.body, {
        dailyTask_id: "required"
      })
      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, errorResponse);
      }
      const removeTask = await daily_task.findByIdAndUpdate({_id:req.body.dailyTask_id},
        {deleted:true}); 
      
      return helper.success(res, "Daily task deleted successfully")
    } catch (error) {
      console.log(error)
    }
  },

}