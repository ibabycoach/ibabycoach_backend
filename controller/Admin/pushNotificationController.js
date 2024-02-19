const userModel = require('../../model/Admin/user')
const notificationModel = require('../../model/Admin/push_notification')


module.exports = {

    pushNotification: async (req, res) => {
        try {
            let title = "push-notification"

            const getUser = await userModel.find({role: 1, status: 1});

            res.render('Admin/push_notification/pushNotification', {title, getUser, session:req.session.user, msg: req.flash("msg") });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        }
    },

    pushNotificationPost: async (req, res) => {
        try {
            const ids = req.body.users;
            let pushNotificationMsg = [];

            for (const id of ids) {
                pushNotificationMsg.push({
                    message: req.body.message,
                    userId2: id,
                    userId:req.session.user._id
                })
            }

            const pushNotification = await notificationModel.create(pushNotificationMsg)

            if (!pushNotification) {
                req.flash('msg', 'Unable to send push notification');
                res.redirect('/push-notification');
            }

            req.flash('msg', 'Push notification sent');
            res.redirect('/push-notification');

        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        }
    }


}