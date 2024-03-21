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
        task_type: "required"
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
        task_type: req.body.task_type,
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

      const filter = { babyId: babyId };

    if (req.body.start_time) {
      let startDate = req.body.start_time;
      startDate = new Date(startDate);

      var endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      filter.start_time = { $gte: startDate, $lt:endDate};
    }

      const findDailyTasks = await daily_task.find(filter)
      .populate('activityIds', 'activity_name image bg_color')
      .populate('userId', 'name relation')
      .sort({ createdAt: -1 });
      
      // Count occurrences of each activity
      const activityCounts = {};
      findDailyTasks.forEach(task => {
        if (Array.isArray(task.activityIds)) {
          task.activityIds.forEach(activity => {
            const activityId = activity._id.toString(); // Convert ObjectId to string for comparison
            if (activityCounts.hasOwnProperty(activityId)) {
              activityCounts[activityId]++;
            } else {
              activityCounts[activityId] = 1;
            }
          });
        } else {
          const activityId = task.activityIds._id.toString();
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
            count: activityCounts[activity._id.toString()] || 0
          })) :
          [{
            ...task.activityIds.toObject(),
            count: activityCounts[task.activityIds._id.toString()] || 0
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
  
  //task count for home page
  task_count: async (req, res) => {
    try {
      let babyId = req.body.babyId;
  
      const filter = { babyId: babyId };
      if (req.body.start_time) {
        let startDate = req.body.start_time;
        startDate = new Date(startDate);
  
        var endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        filter.start_time = { $gte: startDate, $lt: endDate };
      }

      const findDailyTasks = await daily_task.find(filter)
        .populate('activityIds', 'activity_name image bg_color')
        .populate('userId', 'name relation');
  
      // Count occurrences of each activity
      const activityCounts = {};
      findDailyTasks.forEach(task => {
        if (Array.isArray(task.activityIds)) {
          task.activityIds.forEach(activity => {
            const activityId = activity._id.toString(); // Convert ObjectId to string for comparison
            if (activityCounts.hasOwnProperty(activityId)) {
              activityCounts[activityId]++;
            } else {
              activityCounts[activityId] = 1;
            }
          });
        } else {
          const activityId = task.activityIds._id.toString();
          if (activityCounts.hasOwnProperty(activityId)) {
            activityCounts[activityId]++;
          } else {
            activityCounts[activityId] = 1;
          }
        }
      });
      // Create a map to store unique activityIds and their total count
      const uniqueActivities = {};
      findDailyTasks.forEach(task => {
        const key = task.activityIds.toString(); // Using the stringified activityIds as key for uniqueness
        if (!uniqueActivities[key]) {
          uniqueActivities[key] = {
            taskData: task.toObject(),
            total_count: 1  // Initialize total count to 1 for each unique activity
          };
        } else {
          uniqueActivities[key].total_count++; // Increment count for each occurrence of the same activity
        }
      });
      // Convert map values to an array of objects
      const uniqueActivityArray = Object.values(uniqueActivities);
  
      return helper.success(res, "Unique activities with total count", uniqueActivityArray);
    } catch (error) {
      console.log(error);
    }
  },

  // to get last_time of task added with the specific activity
  // admin_activity: async (req, res) => {
  //   try {
  //     const { activityId, babyId } = req.body;
  
  //     const admin_activity = await activity_model.findById({ _id: req.body.activityId, activity_type: '1', deleted: false });
  
  //     const findTask = await daily_task.findOne({ activityIds: activityId, babyId: babyId }).sort({ createdAt: -1 });
  
  //     let lastEntryTime = null;
  //     if (findTask) {
  //       const lastEntryCreatedAt = findTask.createdAt;
  //       const currentTime = new Date();
  //       const timeDifferenceMs = currentTime - lastEntryCreatedAt;
  
  //       const daysDifference = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));
  //       const hoursDifference = Math.floor((timeDifferenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //       const minutesDifference = Math.floor((timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60));
  
  //       if (daysDifference > 0) {
  //         lastEntryTime = `${daysDifference} days ${hoursDifference} hours ${minutesDifference} minutes`;
  //       } else if (hoursDifference > 0) {
  //         lastEntryTime = `${hoursDifference} hours ${minutesDifference} minutes`;
  //       } else {
  //         lastEntryTime = `${minutesDifference} minutes`;
  //       }
  //     }
  
  //     const response = {
  //       admin_activity: admin_activity,
  //       daily_task: findTask ? { ...findTask.toObject(), last_time: lastEntryTime } : null
  //     };
  
  //     return helper.success(res, "Activity list", response);
  //   } catch (error) {
  //     console.log(error);
  //     return helper.failed(res, "Something went wrong");
  //   }
  // },
  
  admin_activity: async (req, res) => {
    try {
      const { activityId, babyId, date } = req.body;
  
      let admin_activity;
      if (activityId) {
        admin_activity = await activity_model.findById({ _id: activityId, activity_type: '1', deleted: false });
      } else {
        admin_activity = await activity_model.find({ activity_type: '1', deleted: false });
      }
  
      let responses = [];
  
      if (!date) {
        // If date is not provided, fetch the last entry
        const lastTask = await daily_task.findOne({ activityIds: activityId, babyId: babyId }).sort({ createdAt: -1 });
  
        let lastEntryTime = null;
        if (lastTask) {
          const lastEntryCreatedAt = lastTask.createdAt;
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
  
          responses.push({ last_task: { ...lastTask.toObject(), last_time: lastEntryTime } });
        }
      } else {
        let dateList = date.split(',').map(dateString => new Date(dateString.trim()));
  
        for (let i = 0; i < dateList.length; i++) {
          const selectedDate = dateList[i];
          const nextDay = new Date(selectedDate);
          nextDay.setDate(nextDay.getDate() + 1);
          
          const findTask = await daily_task.find({ activityIds: activityId, babyId: babyId, createdAt: { $gte: selectedDate, $lt: nextDay } })
          .sort({ createdAt: -1 })
          .populate('activityIds', 'activity_name image bg_color');
          
          let lastEntryTime = null;
          if (findTask && findTask.length > 0) {
            const lastEntryCreatedAt = findTask[0].createdAt; // Considering the first entry as the last one
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
          
          responses.push({ date: selectedDate.toISOString().slice(0, 10), tasks: findTask ? findTask.map(task => ({ ...task.toObject(), last_time: lastEntryTime })) : [] });
        }
      }
  
      return helper.success(res, "Activity list", responses);
    } catch (error) {
      console.log(error);
      return helper.failed(res, "Error occurred while fetching data");
    }
  }

  
  

}