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
            res.render('Admin/sub user/viewSubuser', { title, userdetails, session:req.session.user,  msg: req.flash('msg') })
        } catch (error) {
            console.log(error)
        }
    },

    // editUser: async(req, res)=> {
    //     try {
    //         let title = "userList"
    //         const updatedata = await userModel.findOne({_id: req.params.id})
    //         res.render('Admin/user/editUser', { title, updatedata, session:req.session.user,  msg: req.flash('msg') })
    //     } catch (error) {
    //        console.log(error) 
    //     }
    // },

    // updateUser: async(req, res)=> {
    //     try {

    //         if (req.files && req.files.image){
    //             var image = req.files.image;

    //             if(image){
    //                 req.body.image = helper.imageUpload(image, "images")
    //             }
    //         }
    //         const updateData = await userModel.updateOne({_id: req.body.id},
                
    //             {   role: req.body.role,
    //                 name: req.body.name,
    //                 phone: req.body.phone,
    //                 email: req.body.email,
    //                 image: req.body.image
    //             })

    //         // res.redirect('/userList')
    //         res.redirect("/userList")
    //     } catch (error) {
    //        console.log(error) 
    //     }
    // },

   

   

    // userStatus: async (req, res) => {
    //     try {
          
    //         var check = await userModel.updateOne(
    //         { _id: req.body.id },
    //         { status: req.body.value }
    //         );
    //         req.flash("msg", "Status updated successfully");
            
    //         if (req.body.value == 0) res.send(false);
    //         if (req.body.value == 1) res.send(true);
        
    //         } catch (error) {
    //         console.log(error)
    //         }
    // },

    // deleteUser: async(req, res)=> {
    //     try {
    //         let userId = req.body.id 
    //         const removeuser = await userModel.deleteOne({_id: userId})
    //         res.redirect("/userList") 
    //     } catch (error) {
    //     console.log(error)
    //     }
    // }


}
