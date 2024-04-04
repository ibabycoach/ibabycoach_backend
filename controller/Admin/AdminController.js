const userModel = require('../../model/Admin/user')
const babyModel = require('../../model/Admin/baby')
const subscriptions = require('../../model/Admin/subscriptions')
const activityModel = require('../../model/Admin/activity')
const weekGoals = require('../../model/Admin/goals')
const bcrypt = require('bcrypt')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');

module.exports = {

    loginPage: async (req, res) => {
        try {
            res.render('Admin/admin/loginPage', {msg: req.flash('msg')})
        } catch (error) {
            console.log(error)
        }
    },

    login: async (req, res) => {
        try {

            var findUser = await userModel.findOne({ email: req.body.email, role: "0" })
            if (findUser) {
                let checkPassword = await bcrypt.compare(req.body.password, findUser.password);

                if (checkPassword == true) {
                    req.session.user = findUser;

                    req.flash('msg', 'Login successfully');
                    res.redirect("/dashboard")
                } else {
                    console.log("incorrect password")
                    req.flash('msg', 'Incorrect password');
                    res.redirect("/loginPage")
                }
            } else {
                console.log("incorrect email")
                req.flash('msg', 'Incorrect email');
                res.redirect("/loginPage")
            }
        } catch (error) {
            console.log(error)
        }
    },

    dashboard: async (req, res) => {
        try {
            let title = "dashboard"
            let users = await userModel.count({ role: 1, deleted:false })
            let subUser = await userModel.count({ role:2 , deleted: false})
            let babies = await babyModel.count({deleted: false})
            let subscription = await subscriptions.count({deleted: false})
            let activity = await activityModel.count({activity_type:'1', deleted:false})
            let weekly_goals = await weekGoals.count({deleted: false})
            let customActivity = await activityModel.count({activity_type:'2', deleted: false})
            const baby = await babyModel.aggregate([
                {
                    $project: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    }
                },
                {
                    $group: {
                        _id: { month: "$month", year: "$year" },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        "_id.year": 1, "_id.month": 1
                    }
                }
            ]);
            const babyCount = Array.from({ length: 12 }).fill(0);
           await baby.forEach(babyDAta => {
                const monthIndex = babyDAta._id.month - 1;
                babyCount[monthIndex] = babyDAta.count;
            });
            const results = await userModel.aggregate([
                {
                    $match: { role: "1" }
                },
                {
                    $project: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    }
                },
                {
                    $group: {
                        _id: { month: "$month", year: "$year" },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        "_id.year": 1, "_id.month": 1
                    }
                }
            ]);
            const userCounts = Array.from({ length: 12 }).fill(0);
           await results.forEach(result => {
                const monthIndex = result._id.month - 1;
                userCounts[monthIndex] = result.count;
            });
            res.render('Admin/admin/dashboard', { userCounts, babyCount, title, users, subUser, babies, weekly_goals, customActivity, subscription, activity, session: req.session.user, msg: req.flash('msg') })
        } catch (error) {
            console.log(error)
        }
    },

    profile: async (req, res) => {
        try {
            let title = "profile"
            res.render('Admin/admin/profile', { title, session: req.session.user, msg: req.flash('msg') })
        } catch (error) {
            console.log(error)
        }
    },

    editprofile: async (req, res) => {
        try {
            let title = "editprofile"
            res.render('Admin/admin/editprofile', { title, session: req.session.user, msg: req.flash('msg') })
        } catch (error) {
            console.log(error)
        }
    },

    updateAdminProfile: async (req, res) => {
        try {
            if (req.files && req.files.image) {
                var image = req.files.image;

                if (image) {
                    req.body.image = helper.imageUpload(image, "images")
                }
            }
            const updateData = await userModel.findByIdAndUpdate({ _id: req.session.user._id },
                {
                    name: req.body.name,
                    phone: req.body.phone,
                    email: req.body.email,
                    image: req.body.image
                });

            const data = await userModel.findById({ _id: req.session.user._id })
            req.session.user = data;
            // res.json("updated successfully")

            if (updateData) {
                res.redirect("back");
                // res.json("error")
            } else {
                res.redirect("back");
                // res.json("failed")
            }

            res.json("here")
            // res.redirect("/profile")
        } catch (error) {
            console.log(error)
        }
    },

    changePassword: async (req, res) => {
        try {
            let title = "changePassword"
            res.render('Admin/admin/changePassword', { title, session: req.session.user, msg: req.flash('msg') })
        } catch (error) {
            console.log(error)
        }
    },

    updatepassword: async function (req, res) {
        try {
            const V = new Validator(req.body, {
                oldPassword: "required",
                newPassword: "required",
                confirm_password: "required|same:newPassword",
            });

            V.check().then(function (matched) {
                console.log(matched);
                console.log(V.errors);
            });
            let data = req.session.user;

            if (data) {
                let comp = await bcrypt.compare(V.inputs.oldPassword, data.password);

                if (comp) {
                    const bcryptPassword = await bcrypt.hash(req.body.newPassword, 10);
                    let create = await userModel.updateOne(
                        { _id: data._id },
                        { password: bcryptPassword }
                    );
                    req.session.user = create;
                      req.flash('msg', 'Password updated successfully')
                    res.redirect("/loginPage");
                    // res.json("updated successfully")
                } else {
                      req.flash('msg', 'Invalid old password')
                    res.redirect("/changePassword");
                    // res.json("Old password do not match")
                }
            }
        } catch (error) {
            console.log(error)
        }
    },

    logout: async (req, res) => {
        try {
            req.session.destroy((err) => { });
            res.redirect("/loginPage");
        } catch (error) {
            helper.error(res, error);
        }
    },

    errorPage: async(req, res) => {
        try {
            res.render('Admin/admin/errorPage', {msg: req.flash('msg')})
        } catch (error) {
            console.log(error)
        }
    }


}