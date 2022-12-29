require('dotenv').config();
const hardware = require("../../database/models/hardware");


// ================================================= Apis for hardware ======================================================= 
//==============================================================================================================================

exports.addHardware = async (req, res) => {

  //console.log(req.files['fabric_image'])

  // hardware.collection.drop('hardware')
  if (req.files['hardware_image'] === undefined) return res.status(203).send({ message: 'Hardware Image Is Required !!!' })

  let image_urls = []

  if (req.files['hardware_image'] !== null) {
    req.files['hardware_image'].map((val) => {
      image_urls.push(`${process.env.Official}/${val.path}`)
    })
  }

  req.body.hardware_image = image_urls;
  req.body.warehouse = req.body.warehouse.split(',');
  // selling points conversation in array
  req.body.selling_points = JSON.parse(req.body.selling_points);

  console.log(req.body)

  // return res.status().send('all')

  const data = hardware(req.body)

  await data.save()
    .then((response) => {
      res.send({ message: 'Hardware Added successfully !!!', response })
    })
    .catch((error) => {
      console.log(error)
      res.status(203);
      res.send({ message: 'Duplicate Hardware !!!' })
    })

}

// get hardware ===================

exports.getHardware = async (req, res) => {

  await hardware.find()
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

// edit hardware ======================


exports.editHardware = async (req, res) => {

  console.log(req.body);
  //console.log(req.files['hardware_image'])

  await hardware.findOneAndUpdate({ _id: req.body._id }, req.body)
    .then((data) => {
      if (data)
        return res.status(200).send({ message: 'hardware is updated successfully.' })
      else
        return res.status(203).send({ message: 'No entries found' })
    })
    .catch((error) => {
      console.log(error)
      return res.status(203).send({ message: 'Something went wrong !!!' })
    })

}

// delete hardware

exports.deleteHardware = async (req, res) => {

  console.log(req.query)

  await hardware.deleteOne(req.query).then((data) => {

    res.send({ massage: 'Hardware deleted !!!' })
  })

}


// for Changing the Status of the hardware

exports.changeHardwareStatus = async (req, res) => {
  console.log(req.body)
  await hardware.findByIdAndUpdate({ _id: req.body._id }, { status: req.body.status })
    .then((data) => {
      console.log(data)
      res.send('all okay')
    })

    .catch((err) => {
      //console.log(err)
      res.status(203).send('Something went wrong !!!')
    })
}

//   Get last hardware

exports.getLastHardware = async (req, res) => {

  await hardware.find({}, { _id: 0, SKU: 1 })
    .sort({ _id: -1 })
    .limit(1)
    .then((response) => {
      if (response !== null) {
        //  //console.log(response);
        res.send(response);
      }
      else {
        res.status(203).send('H-01001')
      }
    })
    .catch((err) => {
      //  //console.log(err)
      res.status(203).send({ message: 'Some error occurred !!!' })
    })

}



// ================================================= Apis for hardware Ends =======================================================
