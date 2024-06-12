const userModel = require('../../model/Admin/user')
const helper = require('../../Helper/helper')
const bcrypt = require('bcrypt')

module.exports = {
    
    create_sub_admin: async(req, res)=> {
        try {
            const userExist = await userModel.findOne({ email: req.body.email });
          if (userExist) {
            req.flash("msg", "Email already existed");
            res.redirect('/add_sub_admin');
            // return helper.failed(res,"Email Already Exist")
          }
        if (req.files && req.files.image) {
            var image = req.files.image;
            if (image) {
                req.body.image = helper.imageUpload(image, "images");
            }
        }
        let hash = await bcrypt.hash(req.body.password, 10);
        let createuser = await userModel.create({
            role: 3,
            name: req.body.name,
            email: req.body.email,
            image: req.body.image,
            password: hash,
        
        });
         res.redirect('/sub_admin_list')
        // res.json(createuser)
          console.log("signup successfully")
          return helper.success(res, "created successfully", createuser)
        } catch (error) {
          console.log(error)
        }
  
    },

    add_sub_admin: async(req, res)=> {
        try {
            let title = "sub_admin_list"
            res.render('Admin/sub-admin/add_sub_admin', { title, session:req.session.user,  msg: req.flash('msg') })
        } catch (error) {
           console.log(error) 
        }
    },

    edit_sub_admin: async(req, res)=> {
        try {
            let title = "sub_admin_list"
            const updatedata = await userModel.findById({_id: req.params.id})
            res.render('Admin/sub-admin/edit_sub_admin', { title, updatedata, session:req.session.user,  msg: req.flash('msg') })
        } catch (error) {
           console.log(error) 
        }
    },

    update_SubAdmin: async(req, res)=> {
        try {
            if (req.files && req.files.image){
                var image = req.files.image;

                if(image){
                    req.body.image = helper.imageUpload(image, "images")
                }
            }
            const updateData = await userModel.updateOne({_id: req.body.id},
                {   role: req.body.role,
                    name: req.body.name,
                    phone: req.body.phone,
                    email: req.body.email,
                    image: req.body.image
                })
            res.redirect("/sub_admin_list")
        } catch (error) {
           console.log(error) 
        }
    },

    sub_admin_list: async(req, res)=> {
        try {
            let title = "sub_admin_list"
            const userData = await userModel.find({role:3, deleted: false})
            res.render('Admin/sub-admin/sub_admin_list', { title, userData, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
           console.log(error) 
        }
    },

    view_sub_admin: async(req, res)=> {
        try {
            let title = "sub_admin_list"
            const userdetails = await userModel.findById({_id: req.params.id})
            res.render('Admin/sub-admin/view_sub_admin', { title, userdetails, session:req.session.user,  msg: req.flash('msg') })
        } catch (error) {
            console.log(error)
        }
    },

}
