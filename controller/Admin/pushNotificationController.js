const userModel = require('../../model/Admin/user')
const notificationModel = require('../../model/Admin/push_notification')
const helper = require('../../Helper/helper')


module.exports = {

    pushNotification: async (req, res) => {
        try {
            let title = "push-notification"

            const getUser = await userModel.find({role: 1, status: 1, deleted: false});

            res.render('Admin/push_notification/pushNotification', {title, getUser, session:req.session.user, msg: req.flash("msg") });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        }
    },

    pushNotificationPost: async (req, res) => {
        try {

            var ids = req.body.users;
            // let pushNotificationMsg = [];
            var newArr = []
            if(Array.isArray(ids)){
                for(let k in ids){
                    await notificationModel.create({
                        message: req.body.message,
                        receiverId: ids[k],
                        senderId:req.session.user._id
                    });
                    var findUsers = await userModel.findOne({_id: ids[k]});
                    newArr.push(findUsers);
                }
            }
             else {
                await notificationModel.create({
                    message: req.body.message,
                    receiverId: req.body.users,
                    senderId:req.session.user._id
                });
                var findUsers = await userModel.findOne({_id: req.body.users});
                newArr.push(findUsers);
            }
                
            for(const j in newArr){
                var payLoad = {
                    sender_name: req.session.user.name,
                    device_token: newArr[j].device_token,
                    message: `${req.session.user.name} Sent you a notification`,
                    type: 3,
                  };
                  await helper.send_push_notificationsAdmin(payLoad);
                }
            req.flash('msg', 'Push notification sent');
            res.redirect('/push-notification');

        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        }
    }


}