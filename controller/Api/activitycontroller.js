const activity_model = require ('../../model/Admin/activity')
const baby_model = require ('../../model/Admin/baby')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');

module.exports = { 

    customizable_activity: async(req, res)=> {
        try {
            const v = new Validator(req.body, {
                activity_name: "required",    //activity
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
    }



}


