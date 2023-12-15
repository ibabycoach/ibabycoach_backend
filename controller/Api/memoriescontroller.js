const memories_model = require('../../model/Admin/memories')
const baby_model = require('../../model/Admin/baby')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');

module.exports = {

add_memories: async(req, res)=> {
    try {
        const v = new Validator(req.body, {
            babyId: "required"
            // note: "required",
          });
    
          const errorResponse = await helper.checkValidation(v);
          if (errorResponse) {
            return helper.failed(res, errorResponse);
          }
          let imgdata = [];
          if (req.files && req.files.image && Array.isArray(req.files.image))
              for (i in req.files.image) {
                  let image = req.files.image[i];
                  imgdata.push({ url: helper.imageUpload(image, "images") });
              }
          else {
              req.files && req.files.image;
              let image = req.files.image;
              imgdata.push({ url: helper.imageUpload(image, "images") });
          }
          req.body.image = imgdata;

        let userId = req.user.id;

        const addmemories = await memories_model.create({
            userId,
            ...req.body
        }) 

        return helper.success(res, "memories added successfully", addmemories )

    } catch (error) {
        console.log(error)
    }
}


}