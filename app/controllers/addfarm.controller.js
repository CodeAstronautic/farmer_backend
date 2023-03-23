const Addfarm = require("../models/addfarm.model");
const User = require("../models/user.model")
exports.addfarm = (async(req, res) => {
    // try{
    //     const result = User.find({_id:req.body.farmer_id})
    //     console.log(result,"result");
    //     const data={
    //         soil_type:req.body.soil_type,
    //         land_type:req.body.land_type,
    //         farmer_id:req.body.farmer_id
    //     }
    //     // console.log("data",data);
    //     Addfarm.create(data, (err, result) => {
    //         if (err)
    //             throw err;
    //         else {
    //             res.send({ Message: "Add farm Successfully Done", result });
    //         }
    //     })
    // }catch(err){
    //     console.log(err);
    // }
        const farmer_id = req.body.farmer_id
      const farmer = await User.findOne({_id: farmer_id }, (err, result) => {
        console.log(result,"641a95a801e5d42ed0de7311")
            if (err) throw err
            else {
               
                if (result == null) {
                    res.send({ MSG: "Ple Enter Valid ID" })
                }
                else {
                    const data = {
                        soil_type: req.body.soil_type,
                        land_type: req.body.land_type,
                        farmer_id: req.body.farmer_id
                    }
                    // console.log("data",data);
                    Addfarm.create(data, (err, result) => {
                        if (err)
                            throw err;
                        else {
                            res.send({ Message: "Add farm Successfully Done", result });
                        }
                    })
                }

            }
})
})

exports.getfarm = async (req, res) => {
    let findresult = await Addfarm.find().populate("users_id");
    if (!findresult) return res.status(500).send({ message: "oops Can't found data." });
    if (findresult == "") return res.status(500).send({ Message: "oops Empty Set" })
    res.status(200).send({ status: true, result: findresult });
}

