
const Handle = require("../../database/models/handle");


// ================================================= Apis for Handle  ======================================================= 
//==============================================================================================================================

// add Handle

exports.addHandle = async (req, res) => {

console.log(req.body)

  const data = Handle(req.body)

  await data.save()
    .then(() => {
      res.send({message : 'Handle Added sucessfully !!!'})
    })
    .catch((error) => {
      console.log(error)
      res.status(203);
      res.send({message : 'Duplicate Handle !!!'})
    })

}

// get Handle ===================

exports.getHandle = async (req, res) => {

  await Handle.find()
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

// edit Handle ====================== 626cb3a9b09eb22c92f25303


exports.editHandle = async (req, res) => {

  console.log(req.body);

  await Handle.findOneAndUpdate({ _id: req.body._id }, req.body)
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

// delete category

// exports.deleteCategory = async (req,res) =>{

//   // console.log(req.query)

//    await categories.deleteOne({_id : req.query.ID}).then((data)=>{
//     // console.log(data)
//     res.send({massage : 'Category deleted !!!'})
//   })

// }


// for Changing the Status of the category

exports.changeHandleStatus = async(req,res) =>{
  console.log(req.body)
  await Handle.findByIdAndUpdate({_id : req.body._id},req.body)
  .then((data)=>{
      console.log(data)
      res.send('all okay')
  })

  .catch((err)=>{
      console.log(err)
      res.send('Somthing went worang !!!')
  })
}



// ================================================= Apis for Handle Ends =======================================================
