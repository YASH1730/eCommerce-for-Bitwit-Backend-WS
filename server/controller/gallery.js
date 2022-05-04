
const { parse } = require("dotenv")
const product = require("../../database/models/products")

const localhost = 'http://localhost:8000'

// ================================================= Apis for Gallery  ======================================================= 
//==============================================================================================================================

// get Handle ===================

exports.getGallery = async (req, res) => {

    console.log(req.query)
  await product.find({SKU : req.query.SKU})
    .then((data) => {

    
      if (data){
        console.log(data)
        res.send(data[0].product_image)}
      else
        res.status(203).send('no entries found')
    })
    .catch((error) => {
      res.status(203).send(error)
    })
    500
}

// add Photo ====================== 626cb3a9b09eb22c92f25303


exports.addimage = async (req, res) => {

  console.log(req.body);

  await product.findOneAndUpdate({ _id: req.body.SKU }, req.body)
      .then((data) => {
        if (data)
          return res.status(200).send({ message: 'Handle is updated successfully.' })
        else
          return res.status(203).send({ message: 'No entries found' })
      })
      .catch((error) => {
        return res.status(500).send(error)
      })

}

// delete image =========================

exports.deleteImage = async (req,res) => {
  
  console.log(req.query)
  
  await product.findOne({SKU :`WS-${req.query.SKU}`})

  .then(async(data)=>{
    const index = parseInt(req.query.imageIndex)
    const newAarry = []

    data.product_image.map((item,i)=>{
      if(i !== index)
        newAarry.push(item);
    })

    await product.findOneAndUpdate({SKU :`WS-${req.query.SKU}`},{product_image : newAarry})
    .then((data)=>{
      console.log(data);
      return res.send(req.query.SKU)
    })

  })
}
// update image =========================

exports.updateImage = async (req,res) => {
  
  console.log(req.files)
  console.log(req.body)
  
  await product.findOne({SKU :`WS-${req.body.SKU}`})

  .then(async(data)=>{
    const index = parseInt(req.body.ImageIndex)
    const newAarry = []

    data.product_image.map((item,i)=>{
      if(i !== index)
        newAarry.push(item);
      else 
        newAarry.push(`${localhost}/${req.files['category_image'][0].path}`);
    })

    await product.findOneAndUpdate({SKU :`WS-${req.body.SKU}`},{product_image : newAarry})

    .then((data)=>{
      console.log(data);
      return res.send({message : 'Image Updated Successfully !!!'})
    })
    .catch((error)=>{
      console.error
      return res.status(203).send({message : 'Something Went Worang'})
      
    })
    
  })
  .catch((error)=>{

    return res.status(203).send({message : 'Something Went Worang'})
  })
}
// addImage =========================

exports.addImage = async (req,res) => {
  
  console.log(req.files)
  console.log(req.body)

  let image_urls = []

  if (req.files['product_image'] !== null)
  {
      req.files['product_image'].map((val)=>{
              image_urls.push(`${localhost}/${val.path}`)
      })
  }
  else {
    res.status(203).send({message : 'Please at least one image'})
  }

  if(req.body.SKU === null) return res.status(203).send({message : 'SKU of the product in must'})

  
  await product.findOne({SKU : `${req.body.SKU}`})

  .then(async(data)=>{
    const index = parseInt(req.body.ImageIndex)
    const newAarry = []

    data.product_image = data.product_image.concat(image_urls)

    console.log(data.product_image)

    await product.findOneAndUpdate({SKU :`${req.body.SKU}`},{product_image : data.product_image})

    .then((data)=>{
      console.log(data);
      return res.send({message : 'Image Added Successfully !!!'})
    })
    .catch((error)=>{
      console.error
      return res.status(203).send({message : 'Something Went Worang'})
      
    })
    
  })
  .catch((error)=>{

    return res.status(203).send({message : 'Something Went Worang'})
  })
}

// ================================================= Apis for Gallery Ends =======================================================
