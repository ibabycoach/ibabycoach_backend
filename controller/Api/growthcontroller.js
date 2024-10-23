const growthModel = require('../../model/Admin/growth');
let helper = require('../../Helper/helper')
const unitModel = require('../../model/Admin/units')
const { Validator } = require('node-input-validator');

module.exports = {

  // Add_growth: async(req, res)=> {
  //   try {
  //     let userId = req.user.id
  //     const v = new Validator(req.body, {
  //       height: "required",
  //       weight: "required",
  //       headSize: "required",
  //       time: "required",
  //     });       
  //     const errorResponse = await helper.checkValidation(v);
  //       if (errorResponse) {
  //         return helper.failed(res, errorResponse);
  //       }

  //     let lastEntry = await growthModel.findOne({babyId: req.body.babyId, deleted:false}).sort({createdAt: -1})

  //     let babygrowthData = {userId,
  //       ...req.body,
  //     };

  //     if (lastEntry) {
  //       babygrowthData.lastHeight = lastEntry.height;
  //       babygrowthData.lastWeight = lastEntry.weight;
  //       babygrowthData.last_oz = lastEntry.last_oz;
  //       babygrowthData.lastHeadSize = lastEntry.headSize;
  //       babygrowthData.lastHeight_unit = lastEntry.height_unit;
  //       babygrowthData.lastWeight_unit = lastEntry.weight_unit;
  //       babygrowthData.lastHeadSize_unit = lastEntry.headSize_unit;
  //     }
  //     let babygrowth = await growthModel.create(babygrowthData);
            
  //     return helper.success(res, "Growth added successfully", {})
  //   } catch (error) {
  //       console.log(error)
  //     }
  // },

  track_growth: async(req, res) => {
    try {
      let userId = req.user._id;
  
      const v = new Validator(req.body, {
        babyId: "required"
      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.failed(res, errorsResponse);
      }
  
      let babyId = req.body.babyId;
      const baby_growth = await growthModel.find({ babyId: babyId, deleted: false })
        .sort({ createdAt: -1 })
        .populate("userId", "name");
  
      const findUserUnit = await unitModel.findOne({ userId });
  
      if (!findUserUnit) {
        return helper.failed(res, "User unit preferences not found");
      }
  
      // Adding unit preferences to each baby_growth record
      const babygrowth = baby_growth.map(growth => ({
        ...growth.toObject(),
        current_height_unit: findUserUnit.current_height_unit,
        current_weight_unit: findUserUnit.current_weight_unit,
        current__oz_unit: findUserUnit.current__oz_unit,
        current_headSize_unit: findUserUnit.current_headSize_unit
      }));
  
      return helper.success(res, "baby growth details", babygrowth);
    } catch (error) {
      console.log(error);
      return helper.failed(res, "Internal server error");
    }
  },

  edit_growth: async(req, res)=> {
    try {
      const v = new Validator(req.body, {
        growthId: "required"
      })
      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, errorResponse)
      }
      if (req.files && req.files.image) {
        var image = req.files.image;
      
        if (image) {
          req.body.image = helper.imageUpload(image, "images");
        }
      }

      let growthId = req.body.growthId;
      const growthdata = await growthModel.findOneAndUpdate({_id: req.body.growthId},
        { ...req.body });

        const updatedgrowth = await growthModel.findOne({_id: req.body.growthId})

        return helper.success(res, "growth updated successfully", {})

    } catch (error) {
      console.log(error)
    }
  },

  deleteGrowth: async(req, res)=> {
    try {
      const v = new Validator(req.body, {
        growthId: "required"
      })
      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, errorResponse);
      }
      const deleteGrowth = await growthModel.findByIdAndUpdate({_id: req.body.growthId}, 
        {deleted: true}) 
      
      return helper.success(res, "Growth deleted successfully", {})

    } catch (error) {
      console.log(error)
    }
  },

  // Add_growth: async (req, res) => {
  //   try {
  //       let userId = req.user.id;
      
  //       const v = new Validator(req.body, {
  //           height: "required",
  //           weight: "required",
  //           headSize: "required",
  //           time: "required",
  //       });
  //       const errorResponse = await helper.checkValidation(v);
  //       if (errorResponse) {
  //           return helper.failed(res, errorResponse);
  //       }

  //       let lastEntry = await growthModel.findOne({ babyId: req.body.babyId, deleted: false }).sort({ createdAt: -1 });

  //       // Convert height to cm (if it's not already in cm)
  //       let height_in_cm = req.body.height;
  //       if (req.body.height_unit === "in") {
  //           height_in_cm = (parseFloat(req.body.height) * 2.54).toFixed(2); // Convert inches to cm
  //       }

  //       // Convert weight to lbs (if it's not already in lbs)
  //       let weight_in_lbs = req.body.weight;
  //       if (req.body.weight_unit === "kg") {
  //           weight_in_lbs = (parseFloat(req.body.weight) / 0.45359237).toFixed(2); // Convert kg to lbs
  //           // Use 'lb, oz' in the database instead of 'lbs' since it's closest to the schema
  //           weight_unit = "lb, oz"; // Correct unit for pounds
  //       } else if (req.body.weight_unit === "lbs" || req.body.weight_unit === "lb, oz") {
  //           // If it's already in lbs or lb, oz, we store as it is
  //           weight_in_lbs = parseFloat(req.body.weight).toFixed(2);
  //           weight_unit = "lb, oz";
  //       }

  //       // Convert head size to cm (if it's not already in cm)
  //       let headSize_in_cm = req.body.headSize;
  //       if (req.body.headSize_unit === "in") {
  //           headSize_in_cm = (parseFloat(req.body.headSize) * 2.54).toFixed(2);
  //       }

  //       // Prepare the growth data object
  //       let babygrowthData = {
  //           userId,
  //           babyId: req.body.babyId,
  //           height: height_in_cm, 
  //           weight: weight_in_lbs,
  //           headSize: headSize_in_cm,
  //           time: req.body.time,
  //           height_unit: "cm", 
  //           weight_unit: "lb, oz", 
  //           headSize_unit: "cm",
  //       };

       
  //       if (lastEntry) {
  //           babygrowthData.lastHeight = lastEntry.height;
  //           babygrowthData.lastWeight = lastEntry.weight;
  //           babygrowthData.last_oz = lastEntry.last_oz;
  //           babygrowthData.lastHeadSize = lastEntry.headSize;
  //           babygrowthData.lastHeight_unit = lastEntry.height_unit;
  //           babygrowthData.lastWeight_unit = lastEntry.weight_unit;
  //           babygrowthData.lastHeadSize_unit = lastEntry.headSize_unit;
  //       }

  //       let babygrowth = await growthModel.create(babygrowthData);

  //       return helper.success(res, "Growth added successfully", { babygrowth });
  //   } catch (error) {
  //       console.log(error);
  //       return helper.failed(res, "Error occurred while adding growth.");
  //   }
  // },

  Add_growth: async (req, res) => {
    try {
        let userId = req.user.id;
      
        const v = new Validator(req.body, {
          babyId: "required",
          time: "required",
          height_in_inch: "required",
          height_in_cm: "required",
          weight_in_kg: "required",
          weight_in_lbs: "required",
          headSize_in_inch: "required",
          headSize_in_cm: "required",
        });
        const errorResponse = await helper.checkValidation(v);
        if (errorResponse) {
            return helper.failed(res, errorResponse);
        }

      const addGrowth = await growthModel.create({
        ...req.body
      })
        return helper.success(res, "Growth added successfully", { addGrowth });
    } catch (error) {
        console.log(error);
        return helper.failed(res, "Error occurred while adding growth.");
    }
  }


}