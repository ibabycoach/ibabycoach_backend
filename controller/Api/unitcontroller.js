const unitModel = require('../../model/Admin/units')
const helper = require('../../Helper/helper')

module.exports = {

    update_unit: async(req, res)=> {
        try {    
            let userId = req.user._id;
            console.log(userId, ">>>>>>>>>>>>>>>>>>>>>>>>userId");
            
            const updateunits = await unitModel.findOneAndUpdate({ userId},
              {...req.body});
              
              const updatedunits = await unitModel.findOne({ userId}).populate('userId', '_id')
              // console.log(updatedunits, ">>>>>>>>>>>>>>>>>>>>>>>>updatedunits");return
         
          return helper.success(res, "Units updated successfully", updatedunits)
    
        } catch (error) {
          console.log(error)

        }
    },


}