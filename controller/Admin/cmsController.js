const cmsModel = require('../../model/Admin/cms')
const helper = require('../../Helper/helper')

module.exports = {


    addCms: async (req, res)=> {
        try {
            const createcms = await cmsModel.create({
                title: req.body.title,
                description: req.body.description,
                role: req.body.role
            })
            return helper.success(res, "CMS added successfully")
        } catch (error) {
            console.log(error)
        }
    },

    aboutUs: async(req, res)=> {
        try {
            let title = "aboutUs"
            const aboutUsData = await cmsModel.findOne({role:1})
            res.render('Admin/cms/aboutUs', {title, aboutUsData, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
            console.log(error)
        }
    },

    privacyPolicy: async(req, res)=> {
        try {
            let title = "privacyPolicy"
            const policyData = await cmsModel.findOne({role:2})
            res.render('Admin/cms/privacyPolicy', {title, policyData, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
            console.log(error)
        }
    },

    termsConditions: async(req, res)=> {
        try {
            let title = "termsConditions"
            const termsData = await cmsModel.findOne({role:3})
            res.render('Admin/cms/termsConditions', {title, termsData, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
            console.log(error)
        }
    },

    updatecms: async(req, res)=> {
        try {
            const updatedata = await cmsModel.updateOne({ _id: req.body.id },
                {role: req.body.role,
                  description: req.body.description,
                });
            res.redirect("back")
        } catch (error) {
            console.log(error)
        }
    }






}