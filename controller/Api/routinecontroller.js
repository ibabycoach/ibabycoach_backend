const routinebuilder = require('../../model/Admin/routinebuilder')
const activity_model = require('../../model/Admin/activity')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');
const daily_task = require('../../model/Admin/daily_task');

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
      
      const get_baby_routine = await routinebuilder.find(query).populate('activityIds', 'activity_name image')
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

  delete_routine: async(req, res)=> {
    try {
        const v = new Validator(req.body, {
            routineId: "required",
        }) 
        const errorResponse = await helper.checkValidation(v);
        if (errorResponse) {
            return helper.failed(res, errorResponse);
        }
        let routineId = req.body.routineId;
        const removeRoutine = await routinebuilder.findOneAndUpdate({_id: routineId},
            {deleted: true});

        const findroutine = await routinebuilder.findOne({_id:req.body.routineId})
        return helper.success(res, "Category deleted successfully", findroutine)

    } catch (error) {
        console.log(error)
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