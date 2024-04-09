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
          // image: "required"
        });
        const errorResponse = await helper.checkValidation(v);
        if (errorResponse) {
          return helper.failed(res, errorResponse);
        }

        if (req.files && req.files.image) {
          var image = req.files.image;
          if (image) {
              req.body.image = helper.imageUpload(image, "images");
          }
        }
        const addmemories = await memories_model.create({
          userId,
          ...req.body,
        });
    
        return helper.success(res, "Memories added successfully", addmemories );
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
      const get_baby_memories = await memories_model.
      find({babyId: babyId, deleted: false })
      .sort({createdAt: -1})
      .populate("userId", "name");

      return helper.success(res, "baby memories", get_baby_memories)
    } catch (error) {
      console.log(error)
    }
  },

  delete_images : async(req, res)=> {
    try {
      let memoryId = req.body;
      // let imageId = req.body.imageId;
      const findmemory = await memories_model.findOneAndUpdate(
        {_id: req.body.memoryId},
        {deleted: true}
      );
      if (!findmemory) {
        return helper.failed(res, "memories not found")
      }
      const updatedmemories = await memories_model.findOne({_id: req.body.memoryId}) 
    
      return helper.success(res, "image removed successfully", updatedmemories)
    } catch (error) {
      console.log(error)
    }
  }


}