// packages 
const bcrypt = require("bcrypt");
const JWT = require('jsonwebtoken');

// DB modules 
const userDB = require("../../database/models/user");
const categories = require("../../database/models/categories");


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

exports.addCatagories = async (req, res) => {

  //  console.log(req.file)
  //  console.log(req.body)

  const data = categories({
    category_name: req.body.category_name,
    category_image: req.file.path
  })

  await data.save()
    .then(() => {
      res.send('Categories Added sucessfully !!!')
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send(error)
    })

}

// get categories ===================

exports.getCatagories = async (req, res) => {

  await categories.find()
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      res.send(error)
    })

}

// edit categories ======================


exports.editCatagories = async (req, res) => {

  if (req.query.category_name === undefined) return res.status(204).send('Payload is absent.')

  if (req.file !== undefined && req.body.category_name !== undefined) {
    await categories.findOneAndUpdate({ category_name: req.query.category_name }, { category_name: req.body.category_name, category_image: req.file.path })
      .then((data) => {
        return res.status(200).send({ message: 'Category name & image is updated successfully.' })
      })
      .catch((error) => {
        return res.status(500).send(error)
      })
  }


  else if (req.file !== undefined) {
    await categories.findOneAndUpdate({ category_name: req.query.category_name }, { category_image: req.file.path })
      .then((data) => {
        return res.status(200).send({ message: 'Category image is updated successfully.' })

      })
      .catch((error) => {
        return res.status(500).send(error)
      })
  }


  else if (req.body.category_name !== undefined) {

    await categories.findOneAndUpdate({ category_name: req.query.category_name }, { category_name: req.body.category_name })
      .then((data) => {
        return res.status(200).send({ message: 'Category name  is updated successfully.' })

      })
      .catch((error) => {
        return res.status(500).send(error)
      })

  }
  else {
    return res.status(204).send('Payload is absent')
  }

}

// Categories Module Ends here ===================
