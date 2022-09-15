
const product = require('../../database/models/products')
const localhost = 'http://localhost:8000'
const official  = 'https://woodshala.in'
// ================================================= Apis for Products ======================================================= 
//==============================================================================================================================

// Add Products 
     
exports.addProduct = async (req,res) =>{
    console.log(req.files);

    // console.log(req.files['product_image'])

    if (req.files['specification_image'] === undefined || req.files['featured_image'] === undefined || req.files['product_image'] === undefined) return res.status(203).send({message : 'Please Provide the required images !!!'})
    

    let image_urls = []

    if (req.files['product_image'] !== null)
    {
        req.files['product_image'].map((val)=>{
                image_urls.push(`${official}/${val.path}`)
        })
    }

    req.body.product_image = image_urls;
    
    req.body.featured_image = `${official}/${req.files['featured_image'][0].path}`;

   req.body.specification_image = `${official}/${req.files['specification_image'][0].path}`;

    
    console.log(req.body);

    const data = product(req.body);

    await data.save()
    .then((response)=>{
        console.log(response)
        res.send({message:'Product added successfully !!!'})
    })
    .catch((err)=>{
        console.log(err)
        res.status(203).send({message:'Some error occurred !!!'})

    })


  }
 
// Get Product List 

exports.getListProduct = async(req,res)=>{
    await product.find()
    .then((response)=>{
    //   console.log(response)
      res.send(response)
    })
    .catch((err)=>{
        // console.log(err)
        res.send("Not Done !!!")
    })
}


//   Get last product

exports.getLastProduct = async(req,res)=>{
 
 await product.find({},'SKU')
 .sort({_id:-1})
 .limit(1)
 .then((response)=>{
     if(response !== null)
     {
        //  console.log(response);
         res.send(response);
     }
     else{
         res.status(203).send('WS-01001')
     }
 })
 .catch((err)=>{
    //  console.log(err)
    res.status(203).send({message : 'Some error occurred !!!'})
 })

}

// delete products 

exports.deleteProduct = async (req,res)=>{
    product.deleteOne({_id: req.query.ID})
    .then((data)=>{
        res.send({message : "Product deleted successfully !!!"})
    })
    .catch((err)=>{
        res.send({message : 'Some error occurred !!!'})

    })
}

// update products 

exports.updateProduct = async (req,res)=>{
   console.log(req.body);
   console.log(req.files);

   if (req.files['featured_image'] !== undefined)
    req.body.featured_image = `${official}/${req.files['featured_image'][0].path}`;
   if (req.files['specification_image'] !== undefined)
    req.body.specification_image = `${official}/${req.files['specification_image'][0].path}`;



        if (req.body._id === undefined) return res.status(204).send('Payload is absent.')

        await product.findOneAndUpdate({ _id: req.body._id }, req.body)
            .then((data) => {
                console.log(data)
            if (data)
                return res.status(200).send({ message: 'Product is updated successfully.' })
            else
                return res.status(203).send({ message: 'No entries found' })
            })
            .catch((error) => {
            console.log(error)    
            return res.status(203).send('Something Went Wrong')
            })
}

// update in bulk 
exports.updateBulk = async (req,res)=>{

    let arr = [];

    let skus = JSON.parse(req.body.SKUs);
    await skus.map((obj,index)=>{

        arr.push({SKU : obj.SKU});
    })


    await product.updateMany({ $or : arr }, req.body)
    .then((data) => {
        res.status(200).send({ message: 'Product is updated successfully.' })
    })
    .catch((error) => {
    console.log(error)    
     res.status(203).send('Something Went Wrong')

    })
        
}



// get present SKUs
exports.getPresentSKUs = async (req,res) =>{
 
    await product.find({},{
        _id : 0,
        SKU : 1,
        product_title : 1,
        featured_image : 1,
        length_main : 1,
        breadth : 1,
        height : 1,
        MRP : 1,
        selling_price : 1,
        discount_limit : 1,
        range : 1,
    })
    .then((response)=>{
        if(response !== null)
        {
            res.send(response);
        }
        else
        {
            res.status(203).send({message : 'Please Add Some Products First !!!'})
        }
    })
    .catch((err)=>{
       //  console.log(err)
       res.status(203).send({message : 'Some error occurred !!!'})
    })
   
}


  // ================================================= Apis for Products Ends =======================================================
  
