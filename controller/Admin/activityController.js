const activityModel = require('../../model/Admin/activity');
const helper = require('../../Helper/helper')


module.exports = {
    addActivity: async(req, res)=> {
        try {
            let title = "Activity"
            res.render('Admin/Activity/addActivity', {title, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
           console.log(error) 
        }
    },

    postActivity:async(req, res)=>{
        try {

            if (req.files && req.files.image) {
                var image = req.files.image;
                if (image) {
                    req.body.image = helper.imageUpload(image, "images");
                }
            }
            let addData = await activityModel.create({
                name:req.body.name,
                image:req.body.image
            })
            res.redirect("/ActivityList")

        } catch (error) {
            console.log(error);
        }
    },

    activity_List: async(req, res)=> {
        try {
            let title = "Activity"
            const activityData = await activityModel.find()
            console.log(activityData,'growthData')
             
            res.render('Admin/Activity/ActivityList', {title, activityData, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
            console.log(error)
        }
    },

    activity_view: async(req, res)=> {
        try {
            let title = "Activity"
            const activityView = await activityModel.findById({_id: req.params.id}).populate('userId babyId')
            res.render('Admin/Activity/viewActivity', { title, activityView, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
            console.log(error)
        }
    },

    editActivity: async(req, res)=> {
        try {
            let title = "Activity"
            const activitydetail = await activityModel.findById({_id: req.params.id})
            res.render('Admin/Activity/editActivity', {title, activitydetail, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
           console.log(error) 
        }
    },

    updateActivity: async(req, res)=> {
        try {
            if (req.files && req.files.image) {
                var image = req.files.image;
                if (image) {
                    req.body.image = helper.imageUpload(image, "images");
                }
            }
            const updateData = await activityModel.updateOne({_id: req.body.id},
                
                {   name: req.body.name,
                    image: req.body.image,
                })

            res.redirect("/ActivityList")
        } catch (error) {
           console.log(error) 
        }
    },
   
    delete_activity: async(req, res)=> {
        try {
            let growthID = req.body.id 
            const removesubs = await activityModel.deleteOne({_id: growthID})
            res.redirect("/ActivityList") 
        } catch (error) {
                console.log(error)
        }
    },

    activityStatus: async (req, res) => {
        try {
          
            var check = await activityModel.updateOne(
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
    

}