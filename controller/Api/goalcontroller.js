const goalModel = require('../../model/Admin/goals')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');


module.exports = {

    get_goals: async(req, res)=> {
        try {
            const goalslist = await goalModel.find()

            return helper.success(res, "goals list", goalslist)
        } catch (error) {
            console.log(error)
        }
    },

    get_day_goals: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                day_name: "string",
            });
    
            const errorResponse = await helper.checkValidation(v);
            if (errorResponse) {
                return helper.failed(res, "Validation error");
            }
    
            let query = {};
            
            if (req.body.day_name) {
                // If the day is specified, add it to the query
                query.day = req.body.day_name;
            }
    
            const goals = await goalModel.find(query);
    
            return helper.success(res, "Goals", goals);
        } catch (error) {
            console.log(error);
            return helper.failed(res, "Error occurred while fetching goals");
        }
    }
    
    


    



}