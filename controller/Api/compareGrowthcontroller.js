const comparegrowth = require('../../model/Admin/compare_growth');
const growthModel = require('../../model/Admin/growth');
const babyModel = require('../../model/Admin/baby')
let helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');

module.exports = {

    compare_growth_graph: async (req, res) => {
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

        // Calculate baby's age in weeks
        const babyAgeInWeeks = Math.floor((new Date() - new Date(babyDOB)) / (7 * 24 * 60 * 60 * 1000));

        const compareDataWith = await comparegrowth.findOne({ _id: req.body.compareId });
        
        // Extract growth data for comparison
        const babyHeightInInch = parseFloat(babyGrowthData.height_in_inch);  // Ensure height is a number
        const babyHeightInCm = parseFloat(babyGrowthData.height_in_cm);  // Ensure height is a number

        const babyWeightInKg = parseFloat(babyGrowthData.weight_in_kg);  // Ensure weight is a number
        const babyWeightInLbs = parseFloat(babyGrowthData.weight_in_lbs);  // Ensure weight is a number

        const babyHeadSizeInInch = parseFloat(babyGrowthData.headSize_in_inch);  // Ensure headSize is a number
        const babyHeadSizeInCm = parseFloat(babyGrowthData.headSize_in_cm);  // Ensure headSize is a number
        
        const compareHeight = parseFloat(compareDataWith.height_in_cm);  // Ensure height is a number
        const compareWeight = parseFloat(compareDataWith.weight_in_lbs);  // Ensure weight is a number

        const compareHeadSize = parseFloat(compareDataWith.headSize_in_cm);  // Ensure headSize is a number
        const compareAgeInWeeks = parseFloat(compareDataWith.total_duration_weeks);  // Ensure age in weeks is a number

        // Convert weight from lbs to kgs for comparison
        const weightInKgsForComparison = compareWeight * 0.453592;  // 1 lb = 0.453592 kg

        // Helper function to normalize percentages between 1% and 100%
        const normalizePercentage = (value) => {
            return Math.max(1, Math.min(100, value));  // Clamps the value between 1% and 100%
        };

        // Helper function to determine the direction (increase or decrease)
        const getChangeDirection = (difference) => {
            return difference > 0 ? "increase" : (difference < 0 ? "decrease" : "no change");
        };

        // Calculate percentage differences and determine increase or decrease
        let heightPercentageDiff = 'NaN';
        let weightPercentageDiff = 'NaN';
        let headSizePercentageDiff = 'NaN';
        let agePercentageDiff = 'NaN';

        let heightChange = 'no change';
        let weightChange = 'no change';
        let headSizeChange = 'no change';
        let ageChange = 'no change';

        // Height comparison percentage and direction
        if (!isNaN(babyHeightInCm) && !isNaN(compareHeight) && compareHeight !== 0) {
            const heightDiff = ((babyHeightInCm - compareHeight) / compareHeight) * 100;
            heightPercentageDiff = normalizePercentage(heightDiff);
            heightChange = getChangeDirection(heightDiff);
        }

        // Weight comparison percentage and direction (convert lbs to kg)
        if (!isNaN(babyWeightInLbs) && !isNaN(weightInKgsForComparison) && weightInKgsForComparison !== 0) {
            const weightDiff = ((babyWeightInLbs - weightInKgsForComparison) / weightInKgsForComparison) * 100;
            weightPercentageDiff = normalizePercentage(weightDiff);
            weightChange = getChangeDirection(weightDiff);
        }

        // Head size comparison percentage and direction
        if (!isNaN(babyHeadSizeInCm) && !isNaN(compareHeadSize) && compareHeadSize !== 0) {
            const headSizeDiff = ((babyHeadSizeInCm - compareHeadSize) / compareHeadSize) * 100;
            headSizePercentageDiff = normalizePercentage(headSizeDiff);
            headSizeChange = getChangeDirection(headSizeDiff);
        }

        // Age comparison percentage and direction
        if (!isNaN(babyAgeInWeeks) && !isNaN(compareAgeInWeeks) && compareAgeInWeeks !== 0) {
            const ageDiff = ((babyAgeInWeeks - compareAgeInWeeks) / compareAgeInWeeks) * 100;
            agePercentageDiff = normalizePercentage(ageDiff);
            ageChange = getChangeDirection(ageDiff);
        }

        // Send the customized response with only the required fields
        return helper.success( res, "Growth data fetched and compared successfully",
            {
            babyAgeInWeeks,
            babyGrowthData: {
                _id: babyGrowthData._id,
                userId: babyGrowthData.userId,
                babyId: babyGrowthData.babyId._id,  // Just showing babyId
                height: babyGrowthData.height_in_cm,
                weight: babyGrowthData.weight_in_lbs,
                headSize: babyGrowthData.headSize_in_cm
            },
            compareDataWith: {
                _id: compareDataWith._id,
                total_duration_weeks: compareDataWith.total_duration_weeks,
                height_in_cm: compareDataWith.height_in_cm,
                weight_in_lbs: compareDataWith.weight_in_lbs,
                headSize_in_cm: compareDataWith.headSize_in_cm
            },
            comparisonResults: {
                heightPercentageDifference: heightPercentageDiff.toFixed(2),
                heightChange: heightChange,
                weightPercentageDifference: weightPercentageDiff.toFixed(2),
                weightChange: weightChange,
                headSizePercentageDifference: headSizePercentageDiff.toFixed(2),
                headSizeChange: headSizeChange,
                agePercentageDifference: agePercentageDiff.toFixed(2),
                ageChange: ageChange
            }
        });
    } catch (error) {
        return helper.failed(res, "internal server error");
    }
    },

    list_to_compare_growth: async(req, res) => {
        try {
            const growthData = await comparegrowth.find({deleted:false });
            if (!growthData) {
                return helper.success(res, "No data found")
            }

            return helper.success(res, "Growth list to compare", growthData)
        } catch (error) {
            return helper.failed(res, "internal server error");
        }
    }

}