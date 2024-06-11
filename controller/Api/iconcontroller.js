const helper = require('../../Helper/helper')
const iconModel = require('../../model/Admin/icon')

module.exports = {

    get_icons : async(req, res)=> {
    try {
        const allIcons = await iconModel.find({deleted:false, status:"1"})
        if (!allIcons) {
            return helper.failed(res, " No icon list found")
        }

        return helper.success(res, " Icons list", allIcons)
    } catch (error) {
       console.log(error) 
    }
    }

}