
const Supplier = require("../../database/models/supplier");


// ================================================= Apis for Supplier  ======================================================= 
//==============================================================================================================================

// add Supplier

exports.addSupplier = async (req, res) => {

  //console.log(req.body)

  const data = Supplier(req.body)

  await data.save()
    .then((response) => {
      res.send({ message: 'Supplier Added successfully !!!', response })
    })
    .catch((error) => {
      //console.log(error)
      res.status(203).send({ message: 'Duplicate Supplier !!!' })
    })

}

// get Supplier ===================

exports.getSupplier = async (req, res) => {

  await Supplier.find()
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

// edit Supplier ====================== 626cb3a9b09eb22c92f25303


exports.editSupplier = async (req, res) => {

  console.log(req.body);

  await Supplier.findOneAndUpdate({ _id: req.body._id }, req.body)
    .then((data) => {
      if (data)
        return res.status(200).send({ message: 'Supplier is updated successfully.' })
      else
        return res.status(203).send({ message: 'No entries found' })
    })
    .catch((error) => {
      return res.status(500).send(error)
    })

}

//   Get last product

exports.getLastSupplier = async (req, res) => {

  await Supplier.find({}, { _id: 0, SID: 1 })
    .sort({ _id: -1 })
    .limit(1)
    .then((response) => {
      if (response !== null) {
        //  ////console.log(response);
        res.send(response);
      }
      else {
        res.status(203).send('SID-01001')
      }
    })
    .catch((err) => {
      //  ////console.log(err)
      res.status(203).send({ message: 'Some error occurred !!!' })
    })

}


// for getSupplierDropdown

exports.getSupplierDropdown = async (req, res) => {
  //console.log(req.body)
  try {
    // const H_SKU = await hardware.find({},{_id : 0,SKU : 1})
    const Suppliers = await Supplier.find({'SID': { $regex : req.query.search, $options : 'i' }},
        {_id : 0,'SID': 1}).limit(10)
        
    res.send({ Suppliers })
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}



// ================================================= Apis for Supplier Ends =======================================================
