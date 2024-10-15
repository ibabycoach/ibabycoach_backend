const comparegrowth = require('../../model/Admin/compare_growth');
const growthModel = require('../../model/Admin/growth');
const babyModel = require('../../model/Admin/baby')
let helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');

module.exports = {

    compareGrowths: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                growthId: "required",
                compareId: "required"
            });
            const errorResponse = await helper.checkValidation(v);
            if (errorResponse) {
                return helper.failed(res, errorResponse);
            }
    
            const babyGrowthData = await growthModel.findOne({ _id: req.body.growthId }).populate('babyId', 'age');
            const babyId = babyGrowthData.babyId;
            const babyData = await babyModel.findOne({ _id: babyId });
            const babyDOB = babyData.birthday;
            const babyAgeInWeeks = Math.floor((new Date() - new Date(babyDOB)) / (7 * 24 * 60 * 60 * 1000));
    
            const compareDataWith = await comparegrowth.findOne({ _id: req.body.compareId });
            return res.status(200).json({
                message: "Growth data fetched successfully",
                babyAgeInWeeks: babyAgeInWeeks,
                babyGrowthData,
                compareDataWith
            });
        } catch (error) {
            return helper.failed(error);
        }
    }
    



}