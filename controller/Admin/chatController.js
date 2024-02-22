const chat  = require('../../model/socket/message');

module.exports = {

    user_chat : async(req, res)=> {
        try {
            let title = "user_chat"
            res.render('Admin/chat/user_chat', {title, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
           console.log(error) 
        }
    }

}