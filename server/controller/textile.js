
const textile = require("../../database/models/textile");


// ================================================= Apis for textile ======================================================= 
//==============================================================================================================================

// add categoier ======================

const localBaseUrl = 'http://localhost:8000'
const official  = 'https://woodshala.in'

exports.addTextile = async (req, res) => {

  //console.log(req.files['textile_image'])

  if (req.files['textile_image'] === undefined) return res.status(203).send({message : 'Textile Image Is Required !!!'})
  req.body.textile_image = `${official}/${req.files['textile_image'][0].path}` 
 
  const data = textile(req.body)

  await data.save()
  .then((response) => {
    console.log(response)
    res.send({message : 'Textile Added successfully !!!',response})
  })
  .catch((error) => {
    //console.log(error)
    res.status(203);
    res.send({message : 'Duplicate Textile !!!'})
  })

}

// get textile ===================

exports.getTextile = async (req, res) => {

  await textile.find()
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

// edit textile ======================


exports.editTextile = async (req, res) => {

  //console.log(req.body);
  //console.log(req.files['textile_image'])

  if (req.files['textile_image'] !== undefined) 
      req.body.textile_image = `${official}/${req.files['textile_image'][0].path}` 

  

  await textile.findOneAndUpdate({ _id: req.body._id }, req.body)
      .then((data) => {
        if (data)
          return res.status(200).send({ message: 'Textile is updated successfully.' })
        else
          return res.status(203).send({ message: 'No entries found' })
      })
      .catch((error) => {
        //console.log(error)
        return res.status(203).send({message : 'Something went wrong !!!'})
      })

}

// delete textile

exports.deleteTextile = async (req,res) =>{

  console.log(req.query)

   await textile.deleteOne(req.query).then((data)=>{
    console.log(data)   
    res.send({massage : 'Textile deleted !!!'})
  })

}


// for Changing the Status of the textile

exports.changeTextileStatus = async(req,res) =>{
  //console.log(req.body)
  await textile.findByIdAndUpdate({_id : req.body._id},{textile_status : req.body.textile_status})
  .then((data)=>{
      //console.log(data)
      res.send('all okay')
  })

  .catch((err)=>{
      //console.log(err)
      res.status(203).send('Something went wrong !!!')
  })
}



// ================================================= Apis for textile Ends =======================================================
