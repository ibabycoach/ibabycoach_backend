const userModel = require('../../model/Admin/user')
const helper = require('../../Helper/helper')
const bcrypt = require('bcrypt')

module.exports = {
    
    createUser: async(req, res)=> {
        try {
            const userExist = await userModel.findOne({ email: req.body.email });
          if (userExist) {
            // req.flash("msg", "Email already existed");
            // res.redirect('/add_user');
            return helper.failed(res,"Email Already Exist")
          }
          const phoneNumberExist = await userModel.findOne({ phone: req.body.phone });
          if (phoneNumberExist) {
            // req.flash("msg", "Phone number already existed");
            // res.redirect('/add_user');
            return helper.failed(res,"Phone Number Already Exist")
        }
        if (req.files && req.files.image) {
            var image = req.files.image;
            if (image) {
                req.body.image = helper.imageUpload(image, "images");
            }
        }
        let hash = await bcrypt.hash(req.body.password, 10);
        let createuser = await userModel.create({
            role: req.body.role,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.body.image,
            password: hash,
        
        });
        //  res.redirect('/userList')
        res.json(createuser)
          console.log("signup successfully")
          return helper.success(res, "created successfully", createuser)
        } catch (error) {
          console.log(error)
        }
  
    },

    addUser: async(req, res)=> {
        try {
            let title = "userList"
            res.render('Admin/user/addUser', { title, session:req.session.user,  msg: req.flash('msg') })
        } catch (error) {
           console.log(error) 
        }
    },

    editUser: async(req, res)=> {
        try {
            let title = "userList"
            const updatedata = await userModel.findOne({_id: req.params.id})
            res.render('Admin/user/editUser', { title, updatedata, session:req.session.user,  msg: req.flash('msg') })
        } catch (error) {
           console.log(error) 
        }
    },

    updateUser: async(req, res)=> {
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

            // res.redirect('/userList')
            res.redirect("/userList")
        } catch (error) {
           console.log(error) 
        }
    },

    userList: async(req, res)=> {
        try {
            let title = "userList"
            const userData = await userModel.find({role:1})
            res.render('Admin/user/userList', { title, userData, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
           console.log(error) 
        }
    },

    viewUser: async(req, res)=> {
        try {
            let title = "userList"
            const userdetails = await userModel.findById({_id: req.params.id})
            res.render('Admin/user/viewUser', { title, userdetails, session:req.session.user,  msg: req.flash('msg') })
        } catch (error) {
            console.log(error)
        }
    },

    userStatus: async (req, res) => {
        try {
          
            var check = await userModel.updateOne(
            { _id: req.body.id },
            { status: req.body.value }
            );
            // req.flash("msg", "Status update successfully");
            
            if (req.body.value == 0) res.send(false);
            if (req.body.value == 1) res.send(true);
        
            } catch (error) {
            console.log(error)
            }
    },

    deleteUser: async(req, res)=> {
        try {
            let userId = req.body.id 
            const removeuser = await userModel.deleteOne({_id: userId})
            res.redirect("/userList") 
        } catch (error) {
                console.log(error)
        }
    }



}
