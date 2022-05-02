
const secondaryMaterial = require("../../database/models/secondaryMaterial");


// ================================================= Apis for sub categories ======================================================= 
//==============================================================================================================================

// add categoier ======================

const loacalBaseUrl = 'http://localhost:8000'

exports.addSecondaryMaterial = async (req, res) => {

console.log(req.body)

  const data = secondaryMaterial(req.body)

  await data.save()
    .then(() => {
      res.send({message : 'Secondary Material Added sucessfully !!!'})
    })
    .catch((error) => {
      console.log(error)
      res.status(203);
      res.send({message : 'Duplicate Category !!!'})
    })

}

// get categories ===================

exports.getSecondaryMaterial = async (req, res) => {

  await secondaryMaterial.find()
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


exports.editSecondaryMaterial = async (req, res) => {

  console.log(req.body);
  

  await secondaryMaterial.findOneAndUpdate({ _id: req.body._id }, req.body)
      .then((data) => {
        if (data)
          return res.status(200).send({ message: 'Primary Material is updated successfully.' })
        else
          return res.status(203).send({ message: 'No entries found' })
      })
      .catch((error) => {
        return res.status(500).send(error)
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

exports.changeSecondaryMaterialStatus = async(req,res) =>{
  console.log(req.body)
  await secondaryMaterial.findByIdAndUpdate({_id : req.body._id},{secondaryMaterial_status : req.body.secondaryMaterial_status})
  .then((data)=>{
      console.log(data)
      res.send('all okay')
  })

  .catch((err)=>{
      console.log(err)
      res.status(203).send('Somthing went worang !!!')
  })
}



// ================================================= Apis for categories Ends =======================================================
