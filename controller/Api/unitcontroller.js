const unitModel = require('../../model/Admin/units')
const helper = require('../../Helper/helper')

module.exports = {

    update_unit: async(req, res)=> {
        try {    
            let userId = req.user._id;
    
          const updateunits = await unitModel.findOneAndUpdate({ userId},
            {...req.body});

            const updatedunits = await unitModel.findOneAndUpdate({ userId})
         
          return helper.success(res, "baby details updated successfully", updatedunits)
    
        } catch (error) {
          console.log(error)
        }
    },


}