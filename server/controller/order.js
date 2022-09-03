const order = require("../../database/models/order");
const customer = require("../../database/models/customer");
const { v4: uuidv4 } = require('uuid');

// ================================================= Apis for order ======================================================= 
//==============================================================================================================================

// place an order 

exports.placeOrder = async(req,res) => {

    req.body.products = req.body.products.split(',');

    console.log(req.body)

   if(req.body.searchCustomer)
   {
      customer.findOne({mobile : req.body.searchCustomer})
      .then(async (data)=>{ 
         if(data !== null)
         {
            req.body.CID = data.CID 
            req.body.customer_name = data.username 
            req.body.customer_email = data.email 
            req.body.mobile = data.mobile 
            req.body.city = data.city 
            req.body.state = data.state 
            req.body.shipping = data.shipping

            const setdata = order(req.body);
            await setdata.save(req.body)
            .then((response)=>{
               return res.status(200).send({message : 'Order Placed !!!'});
            })
            .catch((err)=>{
               console.log(err)
               return res.status(500).send()
            })
         }
         else{
            return res.status(203).send({message : 'No Customer Found !!!'})
         }
      })
      .catch((err)=>{
         console.log(err)
         return res.status(404).send('Something Went Wrong !!!')
      })
   }
   else{

      req.body.CID = 'Customer not registered !!!'

    const data = order(req.body);
    await data.save(req.body)
    .then((response)=>{
       return res.status(200).send({message : 'Order Placed !!!'});
    })
    .catch((err)=>{
      console.log(err)
       return res.status(500).send()
    })

   }
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

//   Get last product

exports.getLastOrder = async(req,res)=>{
 
   await order.find({},'OID')
   .sort({_id:-1})
   .limit(1)
   .then((response)=>{
       if(response !== null)
       {
         //   console.log(response);
           res.send(response);
       }
       else{
           res.status(203).send('OID-01001')
       }
   })
   .catch((err)=>{
      //  console.log(err)
      res.status(404).send({message : 'Some error occurred !!!'})
   })
  
  }
  

// get specific order

exports.searchOrder = async(req,res) => {   
    
    await order.find()
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

// Customer search list 

// in mongo 1 +>>> Select felids 
// in mongo 0 +>>> Deselect felids 

exports.customerCatalog = async (req,res)=>{

   customer.find({},{_id:0,mobile  : 1, username : 1})
   .then((data)=>{
      if (data !== null)
      {
       return  res.status(200).send(data);
      }
      return res.status(203).send([])
   })
   .catch((err)=>{
      console.log(err)
      res.status(404).send({message : 'Something Went Wrong !!!'})
   })


}