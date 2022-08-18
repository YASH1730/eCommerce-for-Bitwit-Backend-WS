const order = require("../../database/models/order");
const { v4: uuidv4 } = require('uuid');

// ================================================= Apis for banner ======================================================= 
//==============================================================================================================================

// place an order 

exports.placeOrder = async(req,res) => {   
    req.body.OID = `OID-${uuidv4()}`

    req.body.products = req.body.products.split(',')
    
    const data = order(req.body);
    await data.save(req.body)
    .then((response)=>{
       return res.status(200).send(response);
    })
    .catch((err)=>{
       return res.status(500)
    })
}

// list order

exports.listOrder = async(req,res) => {   
    req.body.OID = `OID-${uuidv4()}`

    await order.find({$sort: { order_time : -1 }})
    .then((response)=>{
       return res.status(200).send(response);
    })
    .catch((err)=>{
       return res.status(500)
    })
}

// get specific order

exports.searchOrder = async(req,res) => {   
    
    await order.find(req.query)
    .then((response)=>{
       return res.status(200).send(response);
    })
    .catch((err)=>{
       return res.status(500).send(err);
    })
}


// for Changing the Status of the Order

exports.changeOrderStatus = async(req,res) =>{
   console.log(req.body)
   await order.findByIdAndUpdate({_id : req.body._id},{status : req.body.status})
   .then((data)=>{
       console.log(data)
       res.send('all okay')
   })
 
   .catch((err)=>{
       console.log(err)
       res.status(203).send('Something went wrong !!!')
   })
 }