const userModel = require('../../model/Admin/user')
const babyModel = require('../../model/Admin/baby')
const helper = require('../../Helper/helper')

module.exports = {

    user_chat: async(req, res)=> {
        try {
            let title = "user_chat"

            const usersWithBabies = await userModel.aggregate([
                {
                  $lookup: {
                    from: 'babies',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'babyInfo',
                  },
                },
              ]);
          
            res.render('Admin/chat/user_chat', {title,  usersWithBabies, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
            console.log(error)
        }
    },




}