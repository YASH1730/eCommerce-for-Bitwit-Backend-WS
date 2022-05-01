
const categories = require("../../database/models/categories");


// ================================================= Apis for categories ======================================================= 
//==============================================================================================================================

// add categoier ======================

const loacalBaseUrl = 'http://localhost:8000'

exports.addCatagories = async (req, res) => {

  console.log(req.files['category_image'])

  if (req.files['category_image'] === undefined) return res.status(203).send({message : 'Category Image Is Required !!!'})
  req.body.category_image = `${loacalBaseUrl}/${req.files['category_image'][0].path}` 

  

  const data = categories(req.body)

  await data.save()
    .then(() => {
      res.send({message : 'Categories Added sucessfully !!!'})
    })
    .catch((error) => {
      res.status(203);
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

  console.log(req.body);
  console.log(req.files['category_image'])

  if (req.files['category_image'] !== undefined) 
      req.body.category_image = `${loacalBaseUrl}/${req.files['category_image'][0].path}` 

  

  await categories.findOneAndUpdate({ _id: req.body._id }, req.body)
      .then((data) => {
        if (data)
          return res.status(200).send({ message: 'Category is updated successfully.' })
        else
          return res.status(203).send({ message: 'No entries found' })
      })
      .catch((error) => {
        console.log(error)
        return res.status(203).send({message : 'Somthing went worang !!!'})
      })

}

// delete category

exports.deleteCategory = async (req,res) =>{

  // console.log(req.query)

   await categories.deleteOne({_id : req.query.ID}).then((data)=>{
    
    res.send({massage : 'Category deleted !!!'})
  })

}


// for Changing the Status of the category

exports.changeStatus = async(req,res) =>{
  console.log(req.body)
  await categories.findByIdAndUpdate({_id : req.body._id},{category_status : req.body.category_status})
  .then((data)=>{
      console.log(data)
      res.send('all okay')
  })

  .catch((err)=>{
      console.log(err)
      res.status(203).send('Somthing went worang !!!')
  })
}



// ================================================= Apis for categories Ends =======================================================
