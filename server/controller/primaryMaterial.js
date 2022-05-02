
const primaryMaterial = require("../../database/models/primaryMaterial");


// ================================================= Apis for sub categories ======================================================= 
//==============================================================================================================================

// add categoier ======================

const loacalBaseUrl = 'http://localhost:8000'

exports.addPrimaryMaterial = async (req, res) => {

console.log(req.body)

  const data = primaryMaterial(req.body)

  await data.save()
    .then(() => {
      res.send({message : 'Primary Material Added sucessfully !!!'})
    })
    .catch((error) => {
      console.log(error)
      res.status(203);
      res.send({message : 'Duplicate Value Found !!!'})
    })

}

// get categories ===================

exports.getPrimaryMaterial = async (req, res) => {

  await primaryMaterial.find()
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

// edit categories ====================== 626cb3a9b09eb22c92f25303


exports.editPrimaryMaterial = async (req, res) => {

  console.log(req.body);
  

  await primaryMaterial.findOneAndUpdate({ _id: req.body._id }, req.body)
      .then((data) => {
        if (data)
          return res.status(200).send({ message: 'Primary Material is updated successfully.' })
        else
          return res.status(203).send({ message: 'No entries found' })
      })
      .catch((error) => {
        return res.status(203).send({ message: 'Somthing Went Worang' })
      })

}

// delete category

exports.deleteCategory = async (req,res) =>{

  // console.log(req.query)

   await categories.deleteOne({_id : req.query.ID}).then((data)=>{
    // console.log(data)
    res.send({massage : 'Category deleted !!!'})
  })

}


// for Changing the Status of the category

exports.changePrimaryMaterialStatus = async(req,res) =>{
  console.log(req.body)
  await primaryMaterial.findByIdAndUpdate({_id : req.body._id},{primaryMaterial_status : req.body.primaryMaterial_status})
  .then((data)=>{
      console.log(data)
      res.send('all okay')
  })

  .catch((err)=>{
      console.log(err)
      res.send('Somthing went worang !!!')
  })
}



// ================================================= Apis for categories Ends =======================================================
