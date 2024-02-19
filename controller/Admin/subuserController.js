const userModel = require('../../model/Admin/user')
const helper = require('../../Helper/helper')
const bcrypt = require('bcrypt')

module.exports = {

    subuser_List: async(req, res)=> {
        try {
            let title = "subuser_List"
            const userData = await userModel.find({role:2})
            res.render('Admin/sub user/subuser_List', { title, userData, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
            console.log(error) 
        }
    },

    viewSubuser: async(req, res)=> {
        try {
            let title = "subuser_List"
            const userdetails = await userModel.findById({_id: req.params.id})
            
            if (userdetails.parentId){
                const parentdetail = await userModel.findOne({ _id: userdetails.parentId})
                res.render('Admin/sub user/viewSubuser', { title, userdetails, parentdetail, session:req.session.user, msg: req.flash('msg') })
            }
            res.render('Admin/sub user/viewSubuser', { title, userdetails, parentdetail, session:req.session.user,  msg: req.flash('msg') })
        } catch (error) {
            console.log(error)
        }
    },

}
