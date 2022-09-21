
const categories = require("../../database/models/categories");
const subCategories = require("../../database/models/subCategories");


// ================================================= Apis for categories ======================================================= 
//==============================================================================================================================

// add categories ======================

const localBaseUrl = 'http://localhost:8000'
const official  = 'https://woodshala.in'

exports.addCatagories = async (req, res) => {

  //console.log(req.files['category_image'])

  if (req.files['category_image'] !== undefined) 
  req.body.category_image = `${official}/${req.files['category_image'][0].path}` 
 
  const data = categories(req.body)

  await subCategories.findOne({"sub_category_name":  { $regex : `^${req.body.category_name}`, $options: 'i' } })
  .then(async (result)=>{
    if(result === null)
    {
      await data.save()
        .then((response) => {
          //console.log(response)
          res.send({message : 'Sub Categories Added successfully !!!',response})
        })
        .catch((error) => {
          //console.log(error)
          res.status(203);
          res.send({message : 'Duplicate Sub Category !!!'})
        })
    }
    else {
      res.status(203);
      res.send({message : 'Category Name is already exist in sub category!!!'})  
    }

  })
  .catch((error) => {
    //console.log(error)
    res.status(203);
    res.send({message : 'Something went wrong'})
  })

}

// get categories ===================

exports.getCatagories = async (req, res) => {

  await categories.find()
  .sort({ category_name : 1 })
    .then((data) => {

      if (data)
        res.send(data)
      else
        res.send('no entries found')
    })
    .catch((error) => {
      res.status(500).send(error)
    })

}

// edit categories ======================


exports.editCatagories = async (req, res) => {

  //console.log(req.body);
  //console.log(req.files['category_image'])

  if (req.files['category_image'] !== undefined) 
      req.body.category_image = `${official}/${req.files['category_image'][0].path}` 

  

  await categories.findOneAndUpdate({ _id: req.body._id }, req.body)
      .then((data) => {
        if (data)
          return res.status(200).send({ message: 'Category is updated successfully.' })
        else
          return res.status(203).send({ message: 'No entries found' })
      })
      .catch((error) => {
        //console.log(error)
        return res.status(203).send({message : 'Something went wrong !!!'})
      })

}

// delete category

exports.deleteCategory = async (req,res) =>{

  // //console.log(req.query)

   await categories.deleteOne({_id : req.query.ID}).then((data)=>{
    
    res.send({massage : 'Category deleted !!!'})
  })

}


// for Changing the Status of the category

exports.changeStatus = async(req,res) =>{
  //console.log(req.body)
  await categories.findByIdAndUpdate({_id : req.body._id},{category_status : req.body.category_status})
  .then((data)=>{
      //console.log(data)
      res.send('all okay')
  })

  .catch((err)=>{
      //console.log(err)
      res.status(203).send('Something went wrong !!!')
  })
}



// ================================================= Apis for categories Ends =======================================================
