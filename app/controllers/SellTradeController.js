const SellModel = require("../models/sellTrade.model")

exports.sellTrade = async(req,res)=>{
    const data={
        pickuplocation:req.body.pickuplocation,
        category:req.body.category,
        product:req.body.product,
        variety:req.body.variety,
        grade:req.body.grade,
        price:req.body.price,
        quantity:req.body.quantity,
        image:req.file.path
    }
    // console.log("data",data)
    await SellModel.create(data,(err,result)=>{
        if(err) throw err;
        else{
            res.status(400).send({Message:"Selltrade Insert Successfully Done..",result})   
        }
    })
}

exports.GetSellTrade = async (req,res)=>{
    let findresult = await SellModel.find({});
    if (!findresult) return res.status(500).send({message:"oops Can't found data."});
    if(findresult=="")return res.status(500).send({Message:"oops Empty Set"})
    res.status(200).send({ status: true, result:findresult });
}

exports.GetBySellTrade = async (req,res)=>{
    const id = req.params.id
    let findresult = await SellModel.findOne({_id:id});
    if(!findresult) return res.status(500).send({Message:"oops Can't found data."})
    if(findresult=="")return res.status(500).send({Message:"oops Empty Set"})
    res.status(200).send({ status: true, result:findresult });
}

exports.updatesellTrade = async(req,res)=>{
    const sellTrade=await SellModel.findByIdAndUpdate(req.params.id,{
        pickuplocation:req.body.pickuplocation,
        category:req.body.category,
        product:req.body.product,
        variety:req.body.variety,
        grade:req.body.grade,
        price:req.body.price,
        quantity:req.body.quantity,
        image:req.file.path
    },{
        new:true
    })
    if(!sellTrade) return res.status(500).send({Message:"Can't found sellTrade Data with given id"})
    res.send({Message:"Your Data Successfully Updated",data:sellTrade})
}

exports.DeleteSellTrade = async (req,res)=>{
    const id = req.params.id
    let findresult = await SellModel.findByIdAndDelete({_id:id});
    if(!findresult)return res.status(500).send({Message:"Can't found data"})
    if(findresult=="")return res.status(500).send({Message:"oops Empty Set"})
    res.status(200).send({msg:"Data Deleted", status: true });
}