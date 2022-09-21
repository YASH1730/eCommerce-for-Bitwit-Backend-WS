
const { response } = require('express')
const product = require('../../database/models/products')
const localhost = 'http://localhost:8000'
const official  = 'https://woodshala.in'
// ================================================= Apis for Products ======================================================= 
//==============================================================================================================================

// Add Products 
     
exports.addProduct = async (req,res) =>{
    //console.log(req.files);

    // //console.log(req.files['product_image'])

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

    
    //console.log(req.body);

    const data = product(req.body);

    await data.save()
    .then((response)=>{
        console.log(response)
        res.send({message:'Product added successfully !!!',response})
    })
    .catch((err)=>{
        console.log(err)
        res.status(203).send({message:'Some error occurred !!!'})

    })


  }
 
// Get Product List 

exports.getDraftProduct = async(req,res)=>{
    await product.find()
    .then((response)=>{
      let disabled = [];
      let enabled = [];
        response.map((data,index)=>{
          if(data.status === false)
          disabled.push(data);
          else 
          enabled.push(data);
      })
    //   disabled.concat(enabled)
    //   //console.log(disabled,enabled)
      res.send(disabled.concat(enabled))
    })
    .catch((err)=>{
        // //console.log(err)
        res.send("Not Done !!!")
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
   //console.log(req.body);
   //console.log(req.files);

   if (req.files['featured_image'] !== undefined)
    req.body.featured_image = `${official}/${req.files['featured_image'][0].path}`;
   if (req.files['specification_image'] !== undefined)
    req.body.specification_image = `${official}/${req.files['specification_image'][0].path}`;



        if (req.body._id === undefined) return res.status(204).send('Payload is absent.')

        await product.findOneAndUpdate({ _id: req.body._id }, req.body)
            .then((data) => {
            if (data)
                return res.status(200).send({ message: 'Product is updated successfully.' })
            else
                return res.status(203).send({ message: 'No entries found' })
            })
            .catch((error) => {
            //console.log(error)    
            return res.status(203).send('Something Went Wrong')
            })
}


// for Changing the Status of the category

exports.changeProductStatus = async(req,res) =>{
    //console.log(req.body)
    await product.findByIdAndUpdate({_id : req.body._id},req.body,{_id: 1,status:1})
    .then((response)=>{
        console.log(response)
        res.send({message : 'Product Status Updated',response})
    })
  
    .catch((err)=>{
        //console.log(err)
        res.status(203).send('Something went wrong !!!')
    })
  }
  
  // ================================================= Apis for Products Ends =======================================================
  