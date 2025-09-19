const userModel = require('../../model/Admin/user')
const message = require('../../model/socket/message')
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

                req.flash('msg', 'Push notification sent');
                res.redirect('/push-notification');
                
            for(const j in newArr){
                var payLoad = {
                    sender_name: req.session.user.name,
                    device_token: newArr[j].device_token,
                    message: `${req.session.user.name} Sent you a notification ${req.body.message}`,
                    type: 3,
                  };
                  await helper.send_push_notificationsAdmin(payLoad);
                }
          
            return
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        }
    },

    notificationhistory: async(req, res)=> {
            try {
               let title = "push-notification"
              
                const notifylist = await notificationModel.find({senderId: req.session.user})
                .populate('receiverId', 'name image')
                .sort({ createdAt: -1 })

                res.render('Admin/push_notification/notificationhistory', { title, notifylist, session:req.session.user,  msg: req.flash('msg')})
            } catch (error) {
               console.log(error) 
            }
    },

    deletehistry: async(req, res)=> {
            try {
                let userId = req.body.id 
                const removeuser = await notificationModel.deleteOne({_id: userId})
                  
                res.redirect("/notificationhistory") 
            } catch (error) {
            console.log(error)
            }
    },

    getNotificationCount: async (req, res) => {
        try {
            let session = req.session.user;
            
            const notification_count = await message.count({
                receiver_id: session._id,
                is_read: 0
            });

            res.status(200).json({ notification_count });
        } catch (error) {
            return helper.error(res, error);
        }
    }

}