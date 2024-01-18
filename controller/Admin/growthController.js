const growthModel = require('../../model/Admin/growth');
let helper = require('../../Helper/helper')

module.exports = {

    add_growth: async(req, res)=> {
        try {
            let babygrowth = await growthModel.create({
                userId: req.body.userId,
                babyId: req.body.babyId,
                age: req.body.age,
                height: req.body.height,
                weight: req.body.weight,
                headSize: req.body.headSize
            });
            
            res.json(babygrowth)
        } catch (error) {
            console.log(error)
        }
    },

    growth_List: async(req, res)=> {
        try {
            let title = "Growth"
            const growthData = await growthModel.find().populate('userId babyId')
            console.log(growthData,'growthData')
            res.render('Admin/Growth/GrowthList', {title, growthData, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
            console.log(error)
        }
    },

    growth_view: async(req, res)=> {
        try {
            let title = "Growth"
            const growthView = await growthModel.findById({_id: req.params.id}).populate('userId babyId')
            res.render('Admin/Growth/viewGrowth', { title, growthView, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
            console.log(error)
        }
    },

    editGrowth: async(req, res)=> {
        try {
            let title = "Growth"
            const Growthdetail = await growthModel.findById({_id: req.params.id}).populate('userId babyId')
            res.render('Admin/Growth/editGrowth', {title, Growthdetail, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
           console.log(error) 
        }
    },

    updateGrowth: async(req, res)=> {
        try {
            const updateData = await growthModel.updateOne({_id: req.body.id},
                
                {   age: req.body.age,
                    height: req.body.height,
                    weight:req.body.weight
                })

            res.redirect("/growthList")
        } catch (error) {
           console.log(error) 
        }
    },
   
    delete_growth: async(req, res)=> {
        try {
            let growthID = req.body.id 
            const removesubs = await growthModel.deleteOne({_id: growthID})
            res.redirect("/subscriptionList") 
        } catch (error) {
                console.log(error)
        }
    },

    subsStatus: async (req, res) => {
        try {          
            var check = await userModel.updateOne(
            { _id: req.body.id },
            { status: req.body.value });
            req.flash("msg", "Status updated successfully");
            
            if (req.body.value == 0) res.send(false);
            if (req.body.value == 1) res.send(true);
        
            } catch (error) {
            console.log(error)
            }
    },
    

}