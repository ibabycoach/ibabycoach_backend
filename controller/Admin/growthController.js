const growthModel = require('../../model/Admin/growth');
let helper = require('../../Helper/helper')

module.exports = {

    add_growth: async(req, res)=> {
        try {

            let babygrowth = await growthModel.create({

                userId: req.body.userId,
                babyId: req.body.babyId,
                age: req.body.age,
                height: req.body.height,
                weight: req.body.weight,
               
            });
            
            res.json(babygrowth)
        } catch (error) {
            console.log(error)
        }
    },
    

}