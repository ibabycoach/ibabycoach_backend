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

    growthListing: async (req, res) => {
        try {
            let title = "growthListing"
            const growthdata = await growthModel.find({deleted: false})

            res.render('Admin/compare_Growth/growthListing', { title, growthdata, session: req.session.user, msg: req.flash('msg') })
        } catch (error) {
            console.log(error)
        }
    },

    CreateGrowths: async (req, res) => {
        try {
            let { height_in_cm, headSize_in_cm, weight_in_lbs, start_duration, end_duration, end_duration_type, title } = req.body;
            
            // Convert height_in_cm to inches and save as height_in_inch
            let height_in_inch = height_in_cm ? (parseFloat(height_in_cm) / 2.54).toFixed(2) : null;
    
            // Convert headSize_in_cm to inches and save as headSize_in_inch
            let headSize_in_inch = headSize_in_cm ? (parseFloat(headSize_in_cm) / 2.54).toFixed(2) : null;
    
            // Convert weight_in_lbs to kilograms and save as weight_in_kg
            let weight_in_kg = weight_in_lbs ? (parseFloat(weight_in_lbs) * 0.453592).toFixed(2) : null;
    
            start_duration = parseFloat(start_duration);
            end_duration = parseFloat(end_duration);
            let total_duration_weeks = 0;
    
            if (end_duration_type === "Month") {
                // Convert the difference in months to weeks and fix to 2 decimal places
                total_duration_weeks = ((end_duration - start_duration) * 4.345).toFixed(1);
            } else if (end_duration_type === "Year") {
                // Convert the difference in years to weeks and fix to 2 decimal places
                total_duration_weeks = ((end_duration - start_duration) * 52.142).toFixed(1);
            } else if (end_duration_type === "Week") {
                // If duration is already in weeks, simply subtract and fix to 2 decimal places
                total_duration_weeks = (end_duration - start_duration).toFixed(1);
            } else {
                throw new Error("Invalid duration type provided.");
            }
    
            let addGrowth = await growthModel.create({
                title,
                height_in_cm,
                height_in_inch,
                headSize_in_cm,
                headSize_in_inch,
                weight_in_lbs,
                weight_in_kg,
                start_duration,
                end_duration,
                end_duration_type,
                total_duration_weeks,
            });
    
            res.redirect("/growthListing");
        } catch (error) {
            console.log("Error occurred while creating growth:", error);
            res.status(500).send("Internal server error");
        }
    },

    delete_Growth: async(req, res)=> {
        try {
            let growthID = req.body.id
            const removesubs = await growthModel.findByIdAndUpdate({ _id: growthID },
                {deleted:true})
            res.redirect("/growthListing")
        } catch (error) {
                console.log(error)
        }
    },
    
}