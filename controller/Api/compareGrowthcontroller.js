const comparegrowth = require('../../model/Admin/compare_growth');
const growthModel = require('../../model/Admin/growth');
let helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');

module.exports = {

    compareGrowths: async(req, res)=> {
        try {
            const v = new Validator(req.body, {
                growthId: "required",
                compareId: "required"
            }); 
            const errorResponse = await helper.checkValidation(v);
                if (errorResponse) {
                return helper.failed(res, errorResponse);
            }    
            const growthdata = await growthModel.findOne({_id: req.body.growthId}).populate('babyId', 'age')
            babyId = growthdata.babyId
            console.log(growthdata, ">>>>>>>>>>>growthdata>>>>>>");

            console.log(babyId, ">>>>>>>>>>>babyId>>>>>>");
            
            const comparedata = await comparegrowth.findOne({_id: req.body.compareId})
            console.log(comparedata, ">>>>>>>>>>>>>comparedata>>>>");return

        } catch (error) {
            return helper.failed(error);
        }
    }

}