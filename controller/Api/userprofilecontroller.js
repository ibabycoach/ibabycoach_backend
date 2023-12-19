const user_model = require('../../model/Admin/user')
const baby_model = require('../../model/Admin/baby')
const activity_model = require('../../model/Admin/activity')
const helper = require('../../Helper/helper')

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

    home_screen: async(req, res)=> {
        try {
            let userId = req.user.id;
            const get_user_data = await activity_model.find({})
            // console.log(get_user_data, "djvbcjdbcd");return

            return helper.success(res, "activity", get_user_data)
            
        } catch (error) {
            console.log(error)
        }
    }



}