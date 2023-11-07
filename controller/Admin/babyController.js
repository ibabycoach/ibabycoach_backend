const babyModel = require('../../model/Admin/baby')
const userModel = require('../../model/Admin/user')
const helper = require('../../Helper/helper')


module.exports = {

    addBaby: async(req, res)=> {
        try {
            let title = "BabyList"
            const userdata = await userModel.find()
            res.render('Admin/baby/addBaby', {title, userdata, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
           console.log(error) 
        }
    },

    createBaby: async(req, res)=> {
        try {

            if (req.files && req.files.image) {
                var image = req.files.image;
          
                if (image) {
                  req.body.image = helper.imageUpload(image, "images");

                }
            }
            const addBabies = await babyModel.create({
                name: req.body.name,
                image: req.body.image,
                gender: req.body.gender,
                birthday: req.body.birthday
            })

            res.json(addBabies)
        } catch (error) {
            console.log(error)
        }
    },
    

    editBaby: async(req, res)=> {
        try {
            let title = "babyList"
            const babydetail = await babyModel.findById({_id: req.params.id})
            res.render('Admin/baby/editBaby', {title, babydetail, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
           console.log(error) 
        }
    },

    babyList: async(req, res)=> {
        try {
            let title = "babyList"
        const babydata = await babyModel.find()
            res.render('Admin/baby/babyList', {title, babydata, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
           console.log(error) 
        }
    },

    viewBaby: async(req, res)=> {
        try {
            let title = "babyList"
            const babydata = await babyModel.findById({_id: req.params.id})
            res.render('Admin/baby/viewBaby', { title, babydata , session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
            console.log(error)
        }
    },

    deleteBaby: async(req, res)=> {
        try {
            let userId = req.body.id 
            const removebaby = await babyModel.deleteOne({_id: userId})
            res.redirect("/babyList") 
        } catch (error) {
                console.log(error)
        }
    }



    
}