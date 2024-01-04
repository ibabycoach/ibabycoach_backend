const user_model = require('../../model/Admin/user')
const baby_model = require('../../model/Admin/baby')
const activity_model = require('../../model/Admin/activity')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');

module.exports = {

    profile: async(req, res)=> {
        try {
            const userId = req.user.id;

            const userprofile = await user_model.findOne({_id: userId})

            if (!userprofile) {
                return helper.failed (res, "something went wrong")
            }
            const userBaby = await baby_model.find({userId: userprofile._id})

            return helper.success(res, "user profile", {userprofile, userBaby} )
        } catch (error) {
            console.log(error)
        }
    },

    edit_profile: async(req, res)=> {
        try {
            let userId = req.user.id;
            let babyId = req.body.id;
            
            const userdata = await user_model.findByIdAndUpdate({_id: userId},
                {name: req.body.name });

            return helper.success(res, "user details updated successfully", userdata)

        } catch (error) {
            console.log(error)
        }
    }



}