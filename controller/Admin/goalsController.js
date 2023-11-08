const helper = require('../../Helper/helper');
const goals = require('../../model/Admin/goals');


module.exports = {
    addGoal: async (req, res) => {
        try {
            let title = "Activity"
            res.render('Admin/Goal/addGoale', { title, session: req.session.user, msg: req.flash('msg') })
        } catch (error) {
            console.log(error)
        }
    },

    saveGoal: async (req, res) => {
        try {

            if (req.files && req.files.image) {
                var image = req.files.image;
                if (image) {
                    req.body.image = helper.imageUpload(image, "images");
                }
            }
            let addData = await goals.create({
                name: req.body.name,
                image: req.body.image,
                weeksdays: req.body.weeksdays,
                title: req.body.title,
                description: req.body.description,
                date: req.body.date

            })
            res.redirect("/Goal_List")

        } catch (error) {
            console.log(error);
        }
    },

    Goal_List: async (req, res) => {
        try {
            let title = "Activity"
            const GoalData = await goals.find()

            res.render('Admin/Goal/goalList', { title, GoalData, session: req.session.user, msg: req.flash('msg') })
        } catch (error) {
            console.log(error)
        }
    },

    goal_view: async (req, res) => {
        try {
            let title = "Activity"
            const goalView = await goals.findById({ _id: req.params.id })
            res.render('Admin/Goal/viewgoal', { title, goalView, session: req.session.user, msg: req.flash('msg') })
        } catch (error) {
            console.log(error)
        }
    },

    editGoal: async (req, res) => {
        try {
            let title = "Activity"
            const Goaldetail = await goals.findById({ _id: req.params.id })
            res.render('Admin/Goal/editGoal', { title, Goaldetail, session: req.session.user, msg: req.flash('msg') })
        } catch (error) {
            console.log(error)
        }
    },

    updateGole: async (req, res) => {
        try {
            if (req.files && req.files.image) {
                var image = req.files.image;
                if (image) {
                    req.body.image = helper.imageUpload(image, "images");
                }
            }
            const updateData = await goals.updateOne({ _id: req.body.id },

                {
                    name: req.body.name,
                    image: req.body.image,
                    weeksdays: req.body.weeksdays,
                    title: req.body.title,
                    description: req.body.description,
                    date: req.body.date

                })

            res.redirect("/Goal_List")
        } catch (error) {
            console.log(error)
        }
    },

    delete_goale: async (req, res) => {
        try {
            let growthID = req.body.id
            const removesubs = await goals.deleteOne({ _id: growthID })
            res.redirect("/Goal_List")
        } catch (error) {
            console.log(error)
        }
    },

    goaleStatus: async (req, res) => {
        try {

            var check = await goals.updateOne(
                { _id: req.body.id },
                { status: req.body.value }
            );
            // req.flash("msg", "Status update successfully");

            if (req.body.value == 0) res.send(false);
            if (req.body.value == 1) res.send(true);

        } catch (error) {
            console.log(error)
        }
    },


}