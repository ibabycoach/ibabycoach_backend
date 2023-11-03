const subscriptions = require('../../model/Admin/subscriptions')

module.exports = {

    createSubscription: async(req, res)=> {
        try {

            const addsubscription = await subscriptions.create({
                name: req.body.name,
                price: req.body.price,
                tenure: req.body.tenure
            })

            res.json(addsubscription)
        } catch (error) {
            console.log(error)
        }
    },

    subscriptionList: async(req, res)=> {
        try {
            let title = "subscriptionList"
            const subscriptionsData = await subscriptions.find()
            res.render('Admin/subscriptions/subscriptionList', {title, subscriptionsData, session:req.session.user})
        } catch (error) {
            console.log(error)
        }
    },

    viewSubscription: async(req, res)=> {
        try {
            let title = "subscriptionList"
            const subdetails = await subscriptions.findById({_id: req.params.id})
            res.render('Admin/subscriptions/viewSubscription', { title, subdetails, session:req.session.user })
        } catch (error) {
            console.log(error)
        }
    },

    editSubscription: async(req, res)=> {
        try {
            let title = "subscriptionList"
            const subsdetail = await subscriptions.findById({_id: req.params.id})
            res.render('Admin/subscriptions/editSubscription', {title, subsdetail, session:req.session.user})
        } catch (error) {
           console.log(error) 
        }
    },

    updateSubscription: async(req, res)=> {
        try {
            const updateData = await subscriptions.updateOne({_id: req.body.id},
                
                {   name: req.body.name,
                    price: req.body.price,
                    tenure:req.body.tenure
                })

            res.redirect("/subscriptionList")
        } catch (error) {
           console.log(error) 
        }
    },

   
    // deleteSubscription: async(req, res)=> {
    //     try {
    //         let userId = req.body.id 
    //         const removeuser = await subscriptions.deleteOne({_id: userId})
    //         res.redirect("/subscriptionList") 
    //     } catch (error) {
    //             console.log(error)
    //     }
    // }



}