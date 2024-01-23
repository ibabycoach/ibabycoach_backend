const memories_model = require('../../model/Admin/memories')
const baby_model = require('../../model/Admin/baby')
const helper = require('../../Helper/helper')
const { Validator } = require('node-input-validator');

module.exports = {

add_memories: async (req, res) => {
    try {
      let userId = req.user.id;
  
      const v = new Validator(req.body, {
        babyId: "required",
      });
  
      const errorResponse = await helper.checkValidation(v);
      if (errorResponse) {
        return helper.failed(res, errorResponse);
      }
  
      let imgdata = [];
      if (req.files && req.files.image) {
        const images = Array.isArray(req.files.image) ? req.files.image : [req.files.image];
  
        for (let i = 0; i < images.length; i++) {
          let image = images[i];
          imgdata.push({ url: helper.imageUpload(image, "images") });
        }
      }
      req.body.image = imgdata;

      const addmemories = await memories_model.create({
        userId,
        ...req.body,
      });
  
      return helper.success(res, "Memories added successfully", addmemories);
    } catch (error) {
      console.log(error);
      return helper.failed(res, "Internal Server Error");
    }
},

get_memory_images: async(req, res) => {
  try {
    const v = new Validator(req.body, {
      babyId: "required"
    })
    const errorResponse = await helper.checkValidation(v);
    if(errorResponse) {
      return helper.failed(res, "something went wrong")
    }

    let babyId = req.body.babyId
    const get_baby_memories = await memories_model.findOne({babyId: req.body.babyId});

    return helper.success(res, "baby memories", get_baby_memories)
  } catch (error) {
      console.log(error)
  }
},

delete_images : async(req, res)=> {
  try {

    let memoryId = req.body.id;
    let imageId = req.body.imageId;
    
    const findmemory = await memories_model.findOne({_id: req.body.memoryId})

    if (!findmemory) {
      return helper.failed(res, "memories not found")
    }
    findmemory.image.pull(imageId)

    await findmemory.save();

    const updatedmemories = await memories_model.findOne({_id: req.body.memoryId}) 
   
    return helper.success(res, "image removed successfully", updatedmemories)

  } catch (error) {
    console.log(error)
  }
}
  


}