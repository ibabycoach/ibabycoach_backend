const activity_model = require ('../../model/Admin/activity')
const baby_model = require ('../../model/Admin/baby')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');

module.exports = { 

    customizable_activity: async(req, res)=> {
        try {
            const v = new Validator(req.body, {
                activity_name: "required", 
                babyId: "required",
                time: "required",
                day: "required"
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

            return helper.success(res, "customized activity added successfully", addactivity)
        } catch (error) {
            console.log(error);
        }
    },

    get_activity: async(req, res)=> {
        try {
            const getactivity = await activity_model.find()
            return helper.success(res, "activity list", getactivity )
        } catch (error) {
            console.log(error)
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
    }



    



}


