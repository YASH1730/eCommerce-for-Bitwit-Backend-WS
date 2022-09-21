
const Door = require("../../database/models/door");


// ================================================= Apis for Door  ======================================================= 
//==============================================================================================================================

// add Door

exports.addDoor = async (req, res) => {

//console.log(req.body)

  const data = Door(req.body)

  await data.save()
    .then((response) => {
      res.send({message : 'Door Added successfully !!!',response})
    })
    .catch((error) => {
      //console.log(error)
      res.status(203).send({message : 'Duplicate Door !!!'})
    })

}

// get Door ===================

exports.getDoor = async (req, res) => {

  await Door.find()
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

// edit Door ====================== 626cb3a9b09eb22c92f25303


exports.editDoor = async (req, res) => {

  //console.log(req.body);

  await Door.findOneAndUpdate({ _id: req.body._id }, req.body)
      .then((data) => {
        if (data)
          return res.status(200).send({ message: 'Door is updated successfully.' })
        else
          return res.status(203).send({ message: 'No entries found' })
      })
      .catch((error) => {
        return res.status(500).send(error)
      })

}

// delete category

// exports.deleteCategory = async (req,res) =>{

//   // //console.log(req.query)

//    await categories.deleteOne({_id : req.query.ID}).then((data)=>{
//     // //console.log(data)
//     res.send({massage : 'Category deleted !!!'})
//   })

// }


// for Changing the Status of the category

exports.changeDoorStatus = async(req,res) =>{
  //console.log(req.body)
  await Door.findByIdAndUpdate({_id : req.body._id},req.body)
  .then((data)=>{
      //console.log(data)
      res.send('all okay')
  })

  .catch((err)=>{
      //console.log(err)
      res.send('Something went wrong !!!')
  })
}



// ================================================= Apis for Door Ends =======================================================
