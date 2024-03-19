const user_model = require ('../../model/Admin/user')
const daily_task = require ('../../model/Admin/daily_task')
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
          
      return helper.success(res, "Daily task added successfully", bottleTime)
    } catch (error) {
        console.log(error);
      }
  },

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
      .populate('activityIds').populate('userId', 'name relation');
      
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
  
  

}