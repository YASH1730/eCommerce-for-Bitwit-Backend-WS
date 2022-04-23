
const products = require('../../database/models/products');
const product = require('../../database/models/products')
const localhost = 'http://localhost:8000/'
// ================================================= Apis for Products ======================================================= 
//==============================================================================================================================

// Add Products 
     
// a. SKU 
// b. Title
// c. Product Specification (Differentiating factor between each category/ sub-category)
// d. Product description
// e. Seo title
// f. Seo Description
// g. Blogs Embed (like in bed category bed blogs can be shown)
// h. Images / size photos / video (if any)
// i. MRP
// j. Selling Price
// k. Discount Limit
// l. Dispatch time

exports.addProduct = async (req,res) =>{
    console.log(req.file);
    
    req.body.product_image = `${localhost}${req.file.path}`
    
    console.log(req.body);

    const data = product(req.body);

    data.save()
    .then((response)=>{
        console.log(response)
        res.send({message:'Product added successfully !!!'})
    })
    .catch((err)=>{
        console.log(err)
        res.status(203).send({message:'Some error occured !!!'})

    })


  }
  

//   Get last product

exports.getLastProduct = async(req,res)=>{
 
 await product.find()
 .sort({_id:-1})
 .limit(1)
 .then((response)=>{
     if(response !== null)
     {
         console.log(response);
         res.send(response);
     }
     else{
         res.status(203).send('WS-01001')
     }
 })
 .catch((err)=>{
     console.log(err)
     res.send({message : 'Some error ouccers !!!'})
 })

}
  
  // ================================================= Apis for Products Ends =======================================================
  