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

    CreateGrowths: async (req, res) => {
        try {
            let { height_in_cm, headSize_in_cm, weight_in_lbs,} = req.body;
    
            // Convert height_in_cm to inches and save as height_in_inch
            let height_in_inch = height_in_cm ? (parseFloat(height_in_cm) / 2.54).toFixed(2) : null;
    
            // Convert headSize_in_cm to inches and save as headSize_in_inch
            let headSize_in_inch = headSize_in_cm ? (parseFloat(headSize_in_cm) / 2.54).toFixed(2) : null;
    
            // Convert weight_in_lbs to kilograms and save as weight_in_kg
            let weight_in_kg = weight_in_lbs ? (parseFloat(weight_in_lbs) * 0.453592).toFixed(2) : null;
    
            // Create a new growth entry with the converted values
            let addGrowth = await growthModel.create({
               
                height_in_cm,
                height_in_inch,
                headSize_in_cm,
                headSize_in_inch,
                weight_in_lbs, 
                weight_in_kg,
            });
    
            res.redirect("/growthListing");
        } catch (error) {
            console.log("Error occurred while creating growth:", error);
            res.status(500).send("Internal server error"); 
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