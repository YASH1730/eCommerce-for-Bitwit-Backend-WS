
const hinge = require("../../database/models/hinge");


// ================================================= Apis for Hinge ======================================================= 
//==============================================================================================================================

// add hinge

exports.addHinge = async (req, res) => {

console.log(req.body)

  const data = hinge(req.body)

  await data.save()
    .then(() => {
      res.send({message : 'Hinge Added successfully !!!'})
    })
    .catch((error) => {
      console.log(error)
      res.status(203);
      res.send({message : 'Duplicate Polish !!!'})
    })

}

// get categories ===================

exports.getHinge = async (req, res) => {

  await hinge.find()
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


exports.editHinge = async (req, res) => {

  console.log(req.body);

  await hinge.findOneAndUpdate({ _id: req.body._id }, req.body)
      .then((data) => {
        if (data)
          return res.status(200).send({ message: 'Polish is updated successfully.' })
        else
          return res.status(203).send({ message: 'No entries found' })
      })
      .catch((error) => {
        return res.status(500).send(error)
      })

}

// delete category

// exports.deleteCategory = async (req,res) =>{

//   // console.log(req.query)

//    await categories.deleteOne({_id : req.query.ID}).then((data)=>{
//     // console.log(data)
//     res.send({massage : 'Category deleted !!!'})
//   })

// }


// for Changing the Status of the category

exports.changeHingeStatus = async(req,res) =>{
  console.log(req.body)
  await hinge.findByIdAndUpdate({_id : req.body._id},req.body)
  .then((data)=>{
      console.log(data)
      res.send('all okay')
  })

  .catch((err)=>{
      console.log(err)
      res.status(203).send('Something went wrong !!!')
  })
}



// ================================================= Apis for categories Ends =======================================================
