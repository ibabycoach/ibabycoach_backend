const growthModel = require('../../model/Admin/compare_growth');
let helper = require('../../Helper/helper')

module.exports = {

    addgrowth: async (req, res) => {
        try {
            let title = "growthListing"
            res.render('Admin/compare_Growth/addgrowth', { title, session: req.session.user, msg: req.flash('msg') })
        } catch (error) {
            console.log(error)
        }
    },

    CreateGrowths: async(req, res)=> {
        try {
            let addGrowth = await growthModel.create({
             ...req.body
            });
            res.redirect("/growthListing")
            // res.json(addGrowth)
        } catch (error) {
            console.log(error)
        }
    },

    growthListing: async (req, res) => {
        try {
            let title = "growthListing"
            const growthdata = await growthModel.find({deleted: false})

            res.render('Admin/compare_Growth/growthListing', { title, growthdata, session: req.session.user, msg: req.flash('msg') })
        } catch (error) {
            console.log(error)
        }
    },

}