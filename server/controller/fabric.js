
const fabric = require("../../database/models/fabric");


// ================================================= Apis for fabric ======================================================= 
//==============================================================================================================================

// add categoier ======================

const localBaseUrl = 'http://localhost:8000'
const official  = 'https://woodshala.in'

exports.addFabric = async (req, res) => {

  console.log(req.files['fabric_image'])

  if (req.files['fabric_image'] === undefined) return res.status(203).send({message : 'Fabric Image Is Required !!!'})
  req.body.fabric_image = `${official}/${req.files['fabric_image'][0].path}` 
 
  const data = fabric(req.body)

  await data.save()
  .then(() => {
    res.send({message : 'Fabric Added successfully !!!'})
  })
  .catch((error) => {
    console.log(error)
    res.status(203);
    res.send({message : 'Duplicate Fabric !!!'})
  })

}

// get fabric ===================

exports.getFabric = async (req, res) => {

  await fabric.find()
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

// edit fabric ======================


exports.editFabric = async (req, res) => {

  console.log(req.body);
  console.log(req.files['fabric_image'])

  if (req.files['fabric_image'] !== undefined) 
      req.body.fabric_image = `${official}/${req.files['fabric_image'][0].path}` 

  

  await fabric.findOneAndUpdate({ _id: req.body._id }, req.body)
      .then((data) => {
        if (data)
          return res.status(200).send({ message: 'fabric is updated successfully.' })
        else
          return res.status(203).send({ message: 'No entries found' })
      })
      .catch((error) => {
        console.log(error)
        return res.status(203).send({message : 'Something went wrong !!!'})
      })

}

// delete fabric

exports.deleteFabric = async (req,res) =>{

  // console.log(req.query)

   await fabric.deleteOne({_id : req.query.ID}).then((data)=>{
    
    res.send({massage : 'fabric deleted !!!'})
  })

}


// for Changing the Status of the fabric

exports.changeFabricStatus = async(req,res) =>{
  console.log(req.body)
  await fabric.findByIdAndUpdate({_id : req.body._id},{fabric_status : req.body.fabric_status})
  .then((data)=>{
      console.log(data)
      res.send('all okay')
  })

  .catch((err)=>{
      console.log(err)
      res.status(203).send('Something went wrong !!!')
  })
}



// ================================================= Apis for fabric Ends =======================================================
