const contactUs = require('../../model/Admin/contactSupport')

module.exports = {

    createContactUs: async(req, res)=> {
        try {
            const contactus = await contactUs.create({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                message: req.body.message
            })
            res.json(contactus)
        } catch (error) {
            console.log(error)
        }
    },

    contactUsList: async(req, res)=> {
        try {
            let title = "contactUsList"
            const contactUsData = await contactUs.find()
            res.render('Admin/cms/contactUsList', {title, contactUsData, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
            console.log(error)
        }
    },

    viewContactUs: async(req, res)=> {
        try {
            let title = "contactUsList"
            const contactUsDetail = await contactUs.findOne({_id: req.params.id})
            res.render('Admin/cms/viewContactUs', {title, contactUsDetail, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
            console.log(error)
        }
    },

    delete_contact: async(req, res)=> {
        try {
            let contactId = req.body.id 
            const removesubs = await contactUs.deleteOne({_id: contactId})
            res.redirect("/contactUsList") 
        } catch (error) {
                console.log(error)
        }
    },


}