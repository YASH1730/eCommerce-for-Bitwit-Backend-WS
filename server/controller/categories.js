
const categories = require("../../database/models/categories");


// ================================================= Apis for categories ======================================================= 
//==============================================================================================================================

// add categoier ======================

const loacalBaseUrl = 'http://localhost:8000'

exports.addCatagories = async (req, res) => {

  //  console.log(req.file)
  //  console.log(req.body)

  const data = categories({
    category_name: req.body.category_name,
    sub_category_name : req.body.category_sub_name,
    category_image: `${loacalBaseUrl}/${req.file.path}`
  })

  await data.save()
    .then(() => {
      res.send({message : 'Categories Added sucessfully !!!'})
    })
    .catch((error) => {
      // console.log(error)
      res.status(406);
      res.send({message : 'Duplicate Category !!!'})
    })

}

// get categories ===================

exports.getCatagories = async (req, res) => {

  await categories.find()
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

// edit categories ======================


exports.editCatagories = async (req, res) => {

  // console.log(req.body);
  if (req.file !== undefined)
    req.body.category_image = `${loacalBaseUrl}/${req.file.path}`;

  if (req.body._id === undefined) return res.status(204).send('Payload is absent.')

  await categories.findOneAndUpdate({ _id: req.body._id }, req.body)
      .then((data) => {
        if (data)
          return res.status(200).send({ message: 'Category name & image is updated successfully.' })
        else
          return res.status(203).send({ message: 'No entries found' })
      })
      .catch((error) => {
        return res.status(500).send(error)
      })

}

// delete category

exports.deleteCategory = async (req,res) =>{

  // console.log(req.query)

   await categories.deleteOne({_id : req.query.ID}).then((data)=>{
    // console.log(data)
    res.send({massage : 'Category deleted !!!'})
  })

}


// ================================================= Apis for categories Ends =======================================================
