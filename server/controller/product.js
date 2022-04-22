
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
  
  
  // ================================================= Apis for Products Ends =======================================================
  