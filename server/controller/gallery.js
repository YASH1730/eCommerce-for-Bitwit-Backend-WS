
const product = require("../../database/models/products")


// ================================================= Apis for Gallery  ======================================================= 
//==============================================================================================================================

// get Handle ===================

exports.getGallery = async (req, res) => {

    console.log(req.query)
  await product.find({SKU : req.query.SKU})
    .then((data) => {

      if (data){
        console.log(data)
        res.send(data[0].product_image)}
      else
        res.status(203).send('no entries found')
    })
    .catch((error) => {
      res.status(203).send(error)
    })
    500
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



// ================================================= Apis for Gallery Ends =======================================================
