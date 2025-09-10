const userModel = require('../../model/Admin/user')
const helper = require('../../Helper/helper')
const bcrypt = require('bcrypt')

module.exports = {

    subuser_List: async(req, res)=> {
        try {
            let title = "subuser_List"
            const userData = await userModel.find({role:2, deleted: false})
            res.render('Admin/sub_user/subuser_List', { title, userData, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
            console.log(error) 
        }
    },

    viewSubuser: async(req, res)=> {
        try {
            let title = "subuser_List"
            const userdetails = await userModel.findById({_id: req.params.id})
            
            if (userdetails.parentId){
                var parentdetail = await userModel.findOne({ _id: userdetails.parentId})

                res.render('Admin/sub_user/viewSubuser', { title, userdetails, parentdetail, session:req.session.user, msg: req.flash('msg') })
            }
            res.render('Admin/sub_user/viewSubuser', { title, userdetails, parentdetail, session:req.session.user,  msg: req.flash('msg') })
        } catch (error) {
            console.log(error)
        }
    },

    editsubUser: async(req, res)=> {
            try {
                let title = "subuser_List"
                const subuserdata = await userModel.findOne({_id: req.params.id})
                res.render('Admin/sub_user/editsubUser', { title, subuserdata, session:req.session.user,  msg: req.flash('msg') })
            } catch (error) {
               console.log(error) 
            }
    },
    
    updatesubUser: async(req, res)=> {
        try {

            if (req.files && req.files.image){
                var image = req.files.image;

                if(image){
                    req.body.image = helper.imageUpload(image, "images")
                }
            }
            const updateData = await userModel.updateOne({_id: req.body.id},
                
                {  
                    name: req.body.name,
                    country_code: req.body.country_code,
                    phone: req.body.phone,
                    email: req.body.email,
                    image: req.body.image
                })
            req.flash("msg", "Sub_user details updated successfully");

            res.redirect("/subuser_List")
        } catch (error) {
            console.log(error) 
        }
    },



}
