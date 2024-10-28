const growthModel = require('../../model/Admin/growth');
let helper = require('../../Helper/helper')
const unitModel = require('../../model/Admin/units')
const { Validator } = require('node-input-validator');

module.exports = {

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
        userId,
        ...req.body
      })
        return helper.success(res, "Growth added successfully", { addGrowth });
    } catch (error) {
        console.log(error);
        return helper.failed(res, "Error occurred while adding growth.");
    }
  },

  // compare_growth: async (req, res) => {
  //   try {
  //     const userId = req.user._id;
  
  //     const v = new Validator(req.body, {
  //       babyId: "required"
  //     });
      
  //     const errorsResponse = await helper.checkValidation(v);
  //     if (errorsResponse) {
  //       return helper.failed(res, errorsResponse);
  //     }
  
  //     const babyId = req.body.babyId;
  //     const baby_growth = await growthModel.find({ babyId, deleted: false })
  //       .sort({ createdAt: -1 })
  //       .limit(2) // Fetch only the last two entries
  //       .populate("userId", "name");
  
  //     const findUserUnit = await unitModel.findOne({ userId });
  
  //     if (!findUserUnit) {
  //       return helper.failed(res, "Please set the measuring unit preference");
  //     }
  
  //     // Check if we have at least two entries
  //     if (baby_growth.length < 2) {
  //       return helper.failed(res, "Not enough growth data to compare");
  //     }
  
  //     const lastEntry = baby_growth[0];
  //     const secondLastEntry = baby_growth[1];
  
  //     // Calculate differences
  //     lastEntry.height_difference_in_inch = lastEntry.height_in_inch - secondLastEntry.height_in_inch;
  //     lastEntry.height_difference_in_cm = lastEntry.height_in_cm - secondLastEntry.height_in_cm;
  //     lastEntry.weight_difference_in_kg = lastEntry.weight_in_kg - secondLastEntry.weight_in_kg;
  //     lastEntry.weight_difference_in_lbs = lastEntry.weight_in_lbs - secondLastEntry.weight_in_lbs;
  //     lastEntry.headSize_difference_in_inch = lastEntry.headSize_in_inch - secondLastEntry.headSize_in_inch;
  //     lastEntry.headSize_difference_in_cm = lastEntry.headSize_in_cm - secondLastEntry.headSize_in_cm;
  
  //     // Save the updated last entry
  //     await lastEntry.save();
  
  //     return helper.success(res, "Growth data compared and updated successfully", lastEntry);
  //   } catch (error) {
  //     console.error(error); // Log the error for debugging
  //     return helper.failed(res, "Something went wrong");
  //   }
  // },


  compare_growth: async (req, res) => {
    try {
        const userId = req.user._id;

        const v = new Validator(req.body, {
            babyId: "required"
        });

        const errorsResponse = await helper.checkValidation(v);
        if (errorsResponse) {
            return helper.failed(res, errorsResponse);
        }

        const babyId = req.body.babyId;
        const baby_growth = await growthModel.find({ babyId, deleted: false })
            .sort({ createdAt: -1 })
            .limit(2)
            .populate("userId", "name");

        const findUserUnit = await unitModel.findOne({ userId });

        if (!findUserUnit) {
            return helper.failed(res, "Please set the measuring unit preference");
        }

        // Check if we have at least two entries
        if (baby_growth.length < 2) {
          return helper.success(res, "Only one entry available, no comparison made.");
      }

        const lastEntry = baby_growth[0];
        const secondLastEntry = baby_growth[1];

        // Calculate differences
        lastEntry.height_difference_in_inch = lastEntry.height_in_inch - secondLastEntry.height_in_inch;
        lastEntry.height_difference_in_cm = lastEntry.height_in_cm - secondLastEntry.height_in_cm;
        lastEntry.weight_difference_in_kg = lastEntry.weight_in_kg - secondLastEntry.weight_in_kg;
        lastEntry.weight_difference_in_lbs = lastEntry.weight_in_lbs - secondLastEntry.weight_in_lbs;
        lastEntry.headSize_difference_in_inch = lastEntry.headSize_in_inch - secondLastEntry.headSize_in_inch;
        lastEntry.headSize_difference_in_cm = lastEntry.headSize_in_cm - secondLastEntry.headSize_in_cm;

        // Format differences with > or <
        lastEntry.height_difference_in_inch = lastEntry.height_difference_in_inch > 0 
            ? `>${Math.abs(lastEntry.height_difference_in_inch)}` 
            : `<${Math.abs(lastEntry.height_difference_in_inch)}`;

        lastEntry.height_difference_in_cm = lastEntry.height_difference_in_cm > 0 
            ? `>${Math.abs(lastEntry.height_difference_in_cm)}` 
            : `<${Math.abs(lastEntry.height_difference_in_cm)}`;

        lastEntry.weight_difference_in_kg = lastEntry.weight_difference_in_kg > 0 
            ? `>${Math.abs(lastEntry.weight_difference_in_kg)}` 
            : `<${Math.abs(lastEntry.weight_difference_in_kg)}`;

        lastEntry.weight_difference_in_lbs = lastEntry.weight_difference_in_lbs > 0 
            ? `>${Math.abs(lastEntry.weight_difference_in_lbs)}` 
            : `<${Math.abs(lastEntry.weight_difference_in_lbs)}`;

        lastEntry.headSize_difference_in_inch = lastEntry.headSize_difference_in_inch > 0 
            ? `>${Math.abs(lastEntry.headSize_difference_in_inch)}` 
            : `<${Math.abs(lastEntry.headSize_difference_in_inch)}`;

        lastEntry.headSize_difference_in_cm = lastEntry.headSize_difference_in_cm > 0 
            ? `>${Math.abs(lastEntry.headSize_difference_in_cm)}` 
            : `<${Math.abs(lastEntry.headSize_difference_in_cm)}`;

        await lastEntry.save();

        return helper.success(res, "Growth data compared and updated successfully", lastEntry);
    } catch (error) {
        console.error(error); 
        return helper.failed(res, "Something went wrong");
    }
  }

  

}