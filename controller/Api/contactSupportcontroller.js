const contactSupport = require('../../model/Admin/contactSupport')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');

module.exports = {

  contactsupport: async(req, res)=> {
      try {
        const v = new Validator(req.body, {
          name: "required",
          email: "required",
          phone: "required",
          message: "required",
        });
          
        const errorResponse = await helper.checkValidation(v);
        if (errorResponse) {
          return helper.failed(res, errorResponse);
        }
          
        let userId = req.user.id;
          const sendmessage = await contactSupport.create({ 
            userId,
            ...req.body
          })
          return helper.success(res, "message send successfully", sendmessage)
      } catch (error) {
          console.log(error)
        }
  }, 



}