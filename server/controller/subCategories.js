
const subCategories = require("../../database/models/subCategories");
const categories = require("../../database/models/categories");


// ================================================= Apis for sub categories ======================================================= 
//==============================================================================================================================

// add categoier ======================

require('dotenv').config();


exports.addSubCatagories = async (req, res) => {

console.log(req.body)

  const data = subCategories(req.body)

  await categories.findOne({"category_name":  { $regex : `^${req.body.sub_category_name}`, $options: 'i' } })
  .then(async (result)=>{
    if(result === null)
    {
      await data.save()
        .then((response) => {
          res.send({message : 'Sub Categories Added successfully !!!',response})
        })
        .catch((error) => {
          //console.log(error)
          res.status(203);
          res.send({message : 'Duplicate Sub Category !!!'})
        })
    }
    else {
      console.log(result)
      res.status(203);
      res.send({message : 'Sub Category Name is already exist in category!!!'})  
    }

  })
  .catch((error) => {
    //console.log(error)
    res.status(203);
    res.send({message : 'Something went wrong'})
  })

}

// get categories ===================

exports.getSubCatagories = async (req, res) => {

  await subCategories.find()
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


exports.editSubCatagories = async (req, res) => {

  console.log(req.body);
  await subCategories.findOneAndUpdate({ _id: req.body._id }, req.body)
      .then((data) => {
        if (data)
          return res.status(200).send({ message: 'Sub Category  is updated successfully.' })
        else
          return res.status(203).send({ message: 'No entries found' })
      })
      .catch((error) => {
        return res.status(500).send(error)
      })

}

// delete category

exports.deleteCategory = async (req,res) =>{

  // //console.log(req.query)

   await categories.deleteOne({_id : req.query.ID}).then((data)=>{
    // //console.log(data)
    res.send({massage : 'Category deleted !!!'})
  })

}


// for Changing the Status of the category

exports.changeSubStatus = async(req,res) =>{
  //console.log(req.body)
  await subCategories.findByIdAndUpdate({_id : req.body._id},{sub_category_status : req.body.sub_category_status})
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
