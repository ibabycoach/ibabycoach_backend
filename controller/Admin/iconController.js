const iconModel = require('../../model/Admin/icon');
const helper = require('../../Helper/helper')
const userModel = require('../../model/Admin/user')

module.exports = {

    add_icon: async(req, res)=> {
        try {
            let title = "icon_list"
            res.render('Admin/icon/add_icon', {title, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
           console.log(error) 
        }
    },

    addIcon:async(req, res)=> {
        try {
            if (req.files && req.files.image) {
                var image = req.files.image;
                if (image) {
                    req.body.image = helper.imageUpload(image, "images");
                }
            }

            let userId =  req.session.user._id;
            let addicon = await iconModel.create({
                userId: userId,
                image:req.body.image,
                bg_color: req.body.bg_color,
            })

            res.redirect("/icon_list")
        } catch (error) {
            console.log(error);
        }
    },

    icon_list: async(req, res)=> {
        try {
            let title = "icon_list"
            const iconList = await iconModel.find({ deleted: false})
             
            res.render('Admin/icon/icon_list', {title, iconList, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
            console.log(error)
        }
    },

    edit_icon: async(req, res)=> {
        try {
            let title = "icon_list"
            const icondetail = await iconModel.findById({_id: req.params.id})
            res.render('Admin/icon/edit_icon', {title, icondetail, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
           console.log(error) 
        }
    },

    update_icon: async(req, res)=> {
        try {
            if (req.files && req.files.image) {
                var image = req.files.image;
                if (image) {
                    req.body.image = helper.imageUpload(image, "images");
                }
            }
            const updateData = await iconModel.updateOne({_id: req.body.id},
                {  
                    bg_color: req.body.bg_color,
                    image: req.body.image,
                })
            req.flash("msg", "Icon updated successfully");
            res.redirect("/icon_list")
        } catch (error) {
           console.log(error) 
        }
    },

    delete_icon: async(req, res)=> {
        try {
            let iconId = req.body.id 
            const removesubs = await iconModel.findByIdAndUpdate({_id: iconId},
                {deleted: true})
            res.redirect("/icon_list") 
        } catch (error) {
            console.log(error)
        }
    },


}