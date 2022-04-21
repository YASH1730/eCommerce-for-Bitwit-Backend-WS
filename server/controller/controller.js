// packages 
const bcrypt = require("bcrypt");
const JWT = require('jsonwebtoken');

// DB modules 
const userDB = require("../../database/models/user");
const categories = require("../../database/models/categories");
const res = require("express/lib/response");


// for deafulting paging
exports.home = (req, res) => {
  res.send("This Apis is written for the WoodSala!!!");
};

// for registration API

exports.register = async (req, res) => {


  const data = userDB(req.body);

  data
    .save()
    .then((response) => {
      return res.status(200).send(req.body);
    })
    .catch((err) => {
      console.log({ err });
      return res.status(203).send({ massage: "User Not Added !!!" });
    });
};

// for login Api

// function for genrate JWT

function genrateJWT(data) {
  // console.log(process.env.JWT_Secreet)
  const token = JWT.sign(data, process.env.JWT_Secreet);
  return token;
}


exports.login = (req, res) => {

  if (req.body.email === undefined || req.body.password === undefined) return res.status(203).send('Please provides the vaild data')



  userDB
    .findOne({ email: req.body.email })
    .then((data) => {
      if (data != null) {
        bcrypt.compare(req.body.password, data.password, function (err, result) {
          console.log(data, result)

          if (result === true) {
            let token = genrateJWT(req.body);
            console.log(data)
            console.log("User Found !!!", data);
            return res.send({ massage: "Log In Sucessfully !!!", token, name: data.user_Name, email: data.email })

          }
          else
            return res.status(203).send({ massage: "User Not Found !!!" })
        });
      }
      else {
        return res.status(203).send({ massage: "User Not Found !!!" })
        console.log({ massage: "User Not Found !!!" });
      }
    })
    .catch((err) => {
      console.log({ massage: "User Not Found !!!", err });
      return res.status(203).send({ massage: "User Not Found !!!", err })
    })

}


// Apis for categories 


// add categoier ======================
const loacalBaseUrl = 'http://localhost:8000'

exports.addCatagories = async (req, res) => {

   console.log(req.file)
   console.log(req.body)

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
      console.log(error)
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

  console.log(req.body);
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

  console.log(req.query)

   await categories.deleteOne({_id : req.query.ID}).then((data)=>{
    console.log(data)
    res.send({massage : 'Category deleted !!!'})
  })

}

// Categories Module Ends here ===================
