const activityModel = require('../../model/Admin/activity');
const helper = require('../../Helper/helper')
const userModel = require('../../model/Admin/user')


module.exports = {

    addActivity: async(req, res)=> {
        try {
            let title = "Activity"
            res.render('Admin/Activity/addActivity', {title, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
           console.log(error) 
        }
    },

    postActivity:async(req, res)=> {
        try {
            const isactivityExist = await activityModel.findOne({activity_name: req.body.activity_name, deleted: false})
            if (isactivityExist) {
                req.flash("msg", "Activity already existed");
                 return res.redirect("/addActivity");
            }
            if (req.files && req.files.image) {
                var image = req.files.image;
                if (image) {
                    req.body.image = helper.imageUpload(image, "images");
                }
            }
            let userId =  req.session.user._id;
            let addData = await activityModel.create({
                userId: userId,
                bg_color: req.body.bg_color,
                activity_name:req.body.activity_name,
                image:req.body.image,
                is_reaction: req.body.is_reaction == 'on' ? 1 :0 ,
                is_amount: req.body.is_amount == 'on' ? 1 :0 ,
                is_duration: req.body.is_duration == 'on' ? 1 :0
            })
            res.redirect("/ActivityList")

        } catch (error) {
            console.log(error);
        }
    },

    activity_List: async(req, res)=> {
        try {
            let title = "Activity"
            const activityData = await activityModel.find({activity_type:'1', deleted: false})
            const customactivity = await activityModel.find({activity_type:'2', deleted: false}).populate('userId', 'name')
             
            res.render('Admin/Activity/ActivityList', {title, activityData, customactivity, session:req.session.user,  msg: req.flash('msg')})
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

             // Handle checkboxes: set to true if present, otherwise false
                req.body.is_amount = req.body.is_amount === 'on' ? 1 : 0;
                req.body.is_duration = req.body.is_duration === 'on' ? 1 : 0;
                req.body.is_reaction = req.body.is_reaction === 'on' ? 1 : 0;

            const updateData = await activityModel.updateOne({_id: req.body.id},
                
                {   activity_name: req.body.activity_name,
                    bg_color: req.body.bg_color,
                    image: req.body.image,
                    is_amount: req.body.is_amount,
                    is_reaction: req.body.is_reaction,
                    is_duration: req.body.is_duration
                })
            req.flash("msg", "Activity updated successfully");
            res.redirect("back")
        } catch (error) {
           console.log(error) 
        }
    },
   
    delete_activity: async(req, res)=> {
        try {
            let growthID = req.body.id 
            const removesubs = await activityModel.findByIdAndUpdate({_id: growthID},
                {deleted: true})
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
            req.flash("msg", "Status update successfully");
            
            if (req.body.value == 0) res.send(false);
            if (req.body.value == 1) res.send(true);
        
        } catch (error) {
          console.log(error)
        }
    },

    viewCustomizedActivity:async(req, res)=> {
        try {
            let title = "Activity"
            const activitydetail = await activityModel.findById({_id: req.params.id}).populate('userId')
            res.render('Admin/Activity/viewCustomizedActivity', {title, activitydetail, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
           console.log(error) 
        }
    }
    

}