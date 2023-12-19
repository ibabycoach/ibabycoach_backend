const cmsModel = require('../../model/Admin/cms')
const helper = require('../../Helper/helper')

module.exports = {

aboutUs: async(req, res)=> {
    try {
        const aboutUsData = await cmsModel.findOne({role:1})
       return helper.success(res, "About us", aboutUsData)
    } catch (error) {
        console.log(error)
    }
},

privacyPolicy: async(req, res)=> {
    try {
        const policyData = await cmsModel.findOne({role:2})
        return helper.success(res, "Privacy Policy", policyData)
    } catch (error) {
        console.log(error)
    }
},

termsConditions: async(req, res)=> {
    try {
        const termsData = await cmsModel.findOne({role:3})
        return helper.success(res, "Terms and conditions", termsData)
    } catch (error) {
        console.log(error)
    }
},

}