const chat  = require('../../model/socket/message');

module.exports = {

    user_chat : async(req, res)=> {
        try {
            let title = "user_chat"
            const adminId = req.session.user._id;
            res.render('Admin/chat/user_chat', {title, session:req.session.user, adminId,  msg: req.flash('msg')})
        } catch (error) {
           console.log(error) 
        }
    }

}