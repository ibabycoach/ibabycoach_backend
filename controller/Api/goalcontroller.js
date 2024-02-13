const goalModel = require('../../model/Admin/goals')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');


module.exports = {

    get_goals: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                day_name: "string",
            });
    
            const errorResponse = await helper.checkValidation(v);
            if (errorResponse) {
                return helper.failed(res, "Validation error");
            }
    
            let query = { deleted: false };
    
            if (req.body.day_name) {
                // If the day is specified, add it to the query using regex
                const specifiedDay = req.body.day_name;
                query.day = { $regex: new RegExp(`\\b${specifiedDay}\\b`, 'i') }; // Match whole word, case-insensitive
            }
    
            const goalslist = await goalModel.find(query);
    
            return helper.success(res, "Goals list", goalslist);
        } catch (error) {
            console.log(error);
            return helper.failed(res, "Error occurred while fetching goals");
        }
    }
    
    
    
    
    


    



}