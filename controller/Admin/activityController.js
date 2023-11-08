const activityModel = require('../../model/Admin/activity');

module.exports = {

    activity_List: async(req, res)=> {
        try {
            let title = "Activity"
            const activityData = await activityModel.find().populate('userId babyId')
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
            const activitydetail = await activityModel.findById({_id: req.params.id}).populate('userId babyId')
            res.render('Admin/Activity/editActivity', {title, activitydetail, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
           console.log(error) 
        }
    },

    updateActivity: async(req, res)=> {
        try {
            const updateData = await activityModel.updateOne({_id: req.body.id},
                
                {   age: req.body.age,
                    height: req.body.height,
                    weight:req.body.weight
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

    subsStatus: async (req, res) => {
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