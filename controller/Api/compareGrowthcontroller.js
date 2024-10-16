const comparegrowth = require('../../model/Admin/compare_growth');
const growthModel = require('../../model/Admin/growth');
const babyModel = require('../../model/Admin/baby')
let helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');

module.exports = {

    // compareGrowths: async (req, res) => {
    //     try {
    //         const v = new Validator(req.body, {
    //             growthId: "required",
    //             compareId: "required"
    //         });
    //         const errorResponse = await helper.checkValidation(v);
    //         if (errorResponse) {
    //             return helper.failed(res, errorResponse);
    //         }
    
    //         const babyGrowthData = await growthModel.findOne({ _id: req.body.growthId }).populate('babyId', 'age');
    //         const babyId = babyGrowthData.babyId;
    //         const babyData = await babyModel.findOne({ _id: babyId });
    //         const babyDOB = babyData.birthday;
    //         const babyAgeInWeeks = Math.floor((new Date() - new Date(babyDOB)) / (7 * 24 * 60 * 60 * 1000));
    
    //         const compareDataWith = await comparegrowth.findOne({ _id: req.body.compareId });
    //         return res.status(200).json({
    //             message: "Growth data fetched successfully",
    //             babyAgeInWeeks: babyAgeInWeeks,
    //             babyGrowthData,
    //             compareDataWith
    //         });
    //     } catch (error) {
    //         return helper.failed(error);
    //     }
    // },

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
        
        // Calculate baby's age in weeks
        const babyAgeInWeeks = Math.floor((new Date() - new Date(babyDOB)) / (7 * 24 * 60 * 60 * 1000));

        const compareDataWith = await comparegrowth.findOne({ _id: req.body.compareId });

        // Extract growth data for comparison
        const babyHeight = parseFloat(babyGrowthData.height);  // Ensure height is a number
        const babyWeight = parseFloat(babyGrowthData.weight);  // Ensure weight is a number
        const babyHeadSize = parseFloat(babyGrowthData.headSize);  // Ensure headSize is a number

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
        if (!isNaN(babyHeight) && !isNaN(compareHeight) && compareHeight !== 0) {
            const heightDiff = ((babyHeight - compareHeight) / compareHeight) * 100;
            heightPercentageDiff = normalizePercentage(heightDiff);
            heightChange = getChangeDirection(heightDiff);
        }

        // Weight comparison percentage and direction (convert lbs to kg)
        if (!isNaN(babyWeight) && !isNaN(weightInKgsForComparison) && weightInKgsForComparison !== 0) {
            const weightDiff = ((babyWeight - weightInKgsForComparison) / weightInKgsForComparison) * 100;
            weightPercentageDiff = normalizePercentage(weightDiff);
            weightChange = getChangeDirection(weightDiff);
        }

        // Head size comparison percentage and direction
        if (!isNaN(babyHeadSize) && !isNaN(compareHeadSize) && compareHeadSize !== 0) {
            const headSizeDiff = ((babyHeadSize - compareHeadSize) / compareHeadSize) * 100;
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
        return res.status(200).json({
            message: "Growth data fetched and compared successfully",
            babyAgeInWeeks,
            babyGrowthData: {
                _id: babyGrowthData._id,
                userId: babyGrowthData.userId,
                babyId: babyGrowthData.babyId._id,  // Just showing babyId
                height: babyGrowthData.height,
                weight: babyGrowthData.weight,
                headSize: babyGrowthData.headSize
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
        return helper.failed(error);
    }
    }



}