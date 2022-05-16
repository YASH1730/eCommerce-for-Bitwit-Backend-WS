
const product = require('../../database/models/products')
const localhost = 'http://localhost:8000'
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
                image_urls.push(`${localhost}/${val.path}`)
        })
    }

    req.body.product_image = image_urls;
    
    req.body.featured_image = `${localhost}/${req.files['featured_image'][0].path}`;

   req.body.specification_image = `${localhost}/${req.files['specification_image'][0].path}`;

    
    console.log(req.body);

    const data = product(req.body);

    await data.save()
    .then((response)=>{
        console.log(response)
        res.send({message:'Product added successfully !!!'})
    })
    .catch((err)=>{
        console.log(err)
        res.status(203).send({message:'Some error occured !!!'})

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
 
 await product.find()
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
    res.status(203).send({message : 'Some error ouccers !!!'})
 })

}

// delete products 

exports.deleteProduct = async (req,res)=>{
    product.deleteOne({_id: req.query.ID})
    .then((data)=>{
        res.send({message : "Product deleted successfully !!!"})
    })
    .catch((err)=>{
        res.send({message : 'Some error occures !!!'})

    })
}

// update products 

exports.updateProduct = async (req,res)=>{
   console.log(req.body);
   console.log(req.files);

   if (req.files['featured_image'] !== undefined)
    req.body.featured_image = `${localhost}/${req.files['featured_image'][0].path}`;
   if (req.files['specification_image'] !== undefined)
    req.body.specification_image = `${localhost}/${req.files['specification_image'][0].path}`;



        if (req.body._id === undefined) return res.status(204).send('Payload is absent.')

        await product.findOneAndUpdate({ _id: req.body._id }, req.body)
            .then((data) => {
            if (data)
                return res.status(200).send({ message: 'Product is updated successfully.' })
            else
                return res.status(203).send({ message: 'No entries found' })
            })
            .catch((error) => {
            console.log(error)    
            return res.status(203).send('Somthing Went Worang')
            })
}
  // ================================================= Apis for Products Ends =======================================================
  