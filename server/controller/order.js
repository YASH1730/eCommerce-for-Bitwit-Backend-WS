const order = require("../../database/models/order");

const localBaseUrl = 'http://localhost:8000'



// ================================================= Apis for banner ======================================================= 
//==============================================================================================================================

// add order 

exports.makeOrder = async(req,res) => {

    // console.log(req.body)

    const data =  order(req.body);

    await data.save()
    .then((response)=>{
    // console.log(response)
        res.send(response)
    })
    .catch((err)=>{
     res.send(err)
    })

}

// list order

exports.listOrder = async(req,res) => {

    await order.find()

    .then((data)=>{
        
        return res.send(data)
    })

    .catch((err)=>{
        console.log(err)
        return res.send('Something went worang !!!')
    })
    

}