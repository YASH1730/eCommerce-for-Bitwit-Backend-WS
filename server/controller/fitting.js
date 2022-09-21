
const fitting = require("../../database/models/fitting");


// ================================================= Apis for Fitting  ======================================================= 
//==============================================================================================================================

// add fitting

exports.addFitting = async (req, res) => {

//console.log(req.body)

  const data = fitting(req.body)

  await data.save()
    .then((response) => {
      res.send({message : 'Fitting Added successfully !!!',response})
    })
    .catch((error) => {
      //console.log(error)
      res.status(203);
      res.send({message : 'Duplicate Fitting !!!'})
    })

}

// get categories ===================

exports.getFitting = async (req, res) => {

  await fitting.find()
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


exports.editFitting = async (req, res) => {

  //console.log(req.body);

  await fitting.findOneAndUpdate({ _id: req.body._id }, req.body)
      .then((data) => {
        if (data)
          return res.status(200).send({ message: 'Fitting is updated successfully.' })
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

exports.changeFittingStatus = async(req,res) =>{
  //console.log(req.body)
  await fitting.findByIdAndUpdate({_id : req.body._id},req.body)
  .then((data)=>{
      //console.log(data)
      res.send('all okay')
  })

  .catch((err)=>{
      //console.log(err)
      res.send('Something went wrong !!!')
  })
}



// ================================================= Apis for Fitting Ends =======================================================
