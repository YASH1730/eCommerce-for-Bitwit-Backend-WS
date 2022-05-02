
const knob = require("../../database/models/knob");


// ================================================= Apis for knob  ======================================================= 
//==============================================================================================================================

// add knob

exports.addKnob = async (req, res) => {

console.log(req.body)

  const data = knob(req.body)

  await data.save()
    .then(() => {
      res.send({message : 'Knob Added sucessfully !!!'})
    })
    .catch((error) => {
      console.log(error)
      res.status(203);
      res.send({message : 'Duplicate knob !!!'})
    })

}

// get knob ===================

exports.getKnob = async (req, res) => {

  await knob.find()
    .then((data) => {

      if (data)
        res.send(data)
      else
        res.send('no entries found')
    })
    .catch((error) => {
      res.status(203).send(error)
    })

}

// edit Knob ====================== 626cb3a9b09eb22c92f25303


exports.editKnob = async (req, res) => {

  console.log(req.body);

  await knob.findOneAndUpdate({ _id: req.body._id }, req.body)
      .then((data) => {
        if (data)
          return res.status(200).send({ message: 'Knob is updated successfully.' })
        else
          return res.status(203).send({ message: 'No entries found' })
      })
      .catch((error) => {
        return res.status(203).send(error)
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

exports.changeKnobStatus = async(req,res) =>{
  console.log(req.body)
  await knob.findByIdAndUpdate({_id : req.body._id},req.body)
  .then((data)=>{
      console.log(data)
      res.send('all okay')
  })

  .catch((err)=>{
      console.log(err)
      res.status(203).send('Somthing went worang !!!')
  })
}



// ================================================= Apis for knob Ends =======================================================
