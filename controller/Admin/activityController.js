const activityModel = require('../../model/Admin/activity');

module.exports = {

    activity_List: async(req, res)=> {
        try {
            let title = "Growth"
            const activityData = await activityModel.find().populate('userId babyId')
            console.log(growthData,'growthData')
            res.render('Admin/Growth/GrowthList', {title, activityData, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
            console.log(error)
        }
    },

    activity_view: async(req, res)=> {
        try {
            let title = "Growth"
            const growthView = await activityModel.findById({_id: req.params.id}).populate('userId babyId')
            res.render('Admin/Growth/viewGrowth', { title, growthView, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
            console.log(error)
        }
    },

    editActivity: async(req, res)=> {
        try {
            let title = "Growth"
            const Growthdetail = await activityModel.findById({_id: req.params.id}).populate('userId babyId')
            res.render('Admin/Growth/editGrowth', {title, Growthdetail, session:req.session.user,  msg: req.flash('msg')})
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

            res.redirect("/growthList")
        } catch (error) {
           console.log(error) 
        }
    },
   
    delete_activity: async(req, res)=> {
        try {
            let growthID = req.body.id 
            const removesubs = await activityModel.deleteOne({_id: growthID})
            res.redirect("/subscriptionList") 
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