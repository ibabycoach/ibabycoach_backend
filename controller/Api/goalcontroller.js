const goalModel = require('../../model/Admin/goals')
const helper = require('../../Helper/helper')


module.exports = {

    get_goals: async(req, res)=> {
        try {
            const goalslist = await goalModel.find()

            return helper.success(res, "goals list", goalslist)
        } catch (error) {
            console.log(error)
        }
    }



}