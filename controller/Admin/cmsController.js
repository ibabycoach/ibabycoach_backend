const cmsModel = require('../../model/Admin/cms')
const helper = require('../../Helper/helper')

module.exports = {


    addCms: async (req, res)=> {
        try {
            const createcms = await cmsModel.create({
                title: req.body.title,
                description: req.body.description,
                version: req.body.version,
                role: 4
            })
            res.redirect("/changelog_list");
            // return helper.success(res, "CMS added successfully")
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
                  version:req.body.version
                });
            res.redirect("back")
        } catch (error) {
            console.log(error)
        }
    },

    add_log: async(req, res) => {
        try {
            let title = "changelog_list"
            res.render('Admin/change_Log/add_log', {title, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
            console.log(error)
        }
    },

    edit_changelog: async(req, res)=> {
        try {
            let title = "changelog_list"
            const changelogData = await cmsModel.findById({_id: req.params.id})
            res.render('Admin/change_Log/edit_changelog', {title, changelogData, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
            console.log(error)
        }
    },

    changelog_list: async(req, res)=> {
        try {
            let title = "changelog_list"
            const logList = await cmsModel.find({role: 4})
             
            res.render('Admin/change_Log/changelog_list', {title, logList, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
            console.log(error)
        }
    },




}