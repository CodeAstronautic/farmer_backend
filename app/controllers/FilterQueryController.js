const Crops = require('../models/crop.model');


exports.getFilterQueryData = async (req,res)=>{
    const subcategoryname=req.body.name
    if(subcategoryname=="Fruits" || subcategoryname=="Vegetables" || subcategoryname=="Crops"){
    let findresult = await Crops.find({subcategoryname:subcategoryname});
    if (!findresult) return res.status(404).send({message:'No category found.'});
    res.status(200).send({ status: true, result:findresult });
    }else{
        if(subcategoryname=="") return res.send({Message:"Please Enter Some Value in Name..."});
        else{
        res.send({Message:"Please Enter Valid Name"})}
    }
}
 
exports.getFilterCommodity=async(req,res)=>{
    const name=req.body.name;
        let result = await Crops.find({name:name});
        if (!result) return res.status(404).send({ status:false, message:'No name found.'});
        else{
            if(result=="") return res.status(200).send({status:true,Message:"There Are No Data with Given Name"})
            else return res.status(200).send({ status: true, result:result });
        }
}
