const activity_model = require ('../../model/Admin/activity')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');

module.exports = { 

    customizable_activity: async(req, res)=> {
        try {
            const v = new Validator(req.body, {
                activity_name: "required", 
                babyId: "required",
                day: "required",
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
            let userId = req.user.id;
            const addactivity = await activity_model.create({
                userId,
                ...req.body
            });

            return helper.success(res, "customized activity added successfully")
        } catch (error) {
            console.log(error);
        }
    },

    get_activity: async(req, res)=> {
        try {
            const getactivity = await activity_model.find({activity_type: '1', deleted: false})
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
            
            const baby_customized_activity = await activity_model.find(query).populate('userId', 'name relation')
            
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


