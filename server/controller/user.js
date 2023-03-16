// packages
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

// DB modules
const userDB = require("../../database/models/user");
const logging = require("../../database/models/logging");

// ================================================= Apis for User =======================================================
//==============================================================================================================================

// for defaulting paging
exports.home = (req, res) => {
  res.send("This Apis is written for the WoodSala!!!");
};

exports.delete = async (req, res) => {
  userDB.deleteOne({ _id: req.query._id }).then((data) => {
    //console.log(data)
    res.send(data);
  });
};

// for registration API

exports.register = async (req, res) => {
  try {
    console.log(req.body);
    req.body.access = req.body.access.split(',')

    let data = await userDB(req.body).save();
    if(data)
    {
      return res.send({message :'User Added Successfully !!!', response : data})
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong !!!")
  }
};

exports.updateUser = async (req, res) => {
  try {
    req.body.access = req.body.access.split(',')
    let data = await userDB.findOneAndUpdate({_id:req.body._id},req.body);
    if(data)
    {
      return res.send({message : 'User Updated Successfully !!!'})
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong !!!")
  }
};

// list users 
exports.listUser = async (req, res) => {
  try {
    let data = await userDB.find({});
    if(data)
    {
      return res.send(data)
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong !!!")
  }
};


// for login Api

// function for generate JWT


function generateJWT(data) {
  const token = JWT.sign(data, process.env.JWT_Secrete, { expiresIn: "3h" });
  return token;
}

exports.login = async (req, res) => {
  // console.log(req.body)

  if (req.body.email === undefined || req.body.password === undefined)
    return res.status(203).send("Please provides the valid data");

  try {
    let data = await userDB.findOne({ email: req.body.email });

    if (data != null) {
      bcrypt.compare(req.body.password, data.password, function (err, result) {
        // if password is correct
        if (result === true) {
          // check role here for corresponding Credentials
          if (req.body.role !== data.role)
            return res.status(203).send({ message: "Incorrect Role !!!" });

          // generating a new access token
          let token = generateJWT(req.body);
          return res.send({
            message: "Log In Successfully !!!",
            token,
            name: data.user_name,
            email: data.email,
            access : data.access,
            role: data.role,
            expireIn: new Date().getTime() + 7200000,
          });
        } else return res.status(203).send({ message: "User Not Found !!!" });
      });
    } else {
      return res.status(203).send({ message: "User Not Found !!!" });
    }
  } catch (err) {
    console.log("Error >> ", err);
    res.status(500).send("Something went wrong !!!");
  }
};

exports.refreshToken = async (req, res) => {
  // console.log(req.body)

  if (
    req.body.email === undefined ||
    req.body.password === undefined ||
    req.body.token === undefined
  )
    return res.status(203).send({ message: "Some data is missing !!!" });

  try {
    let data = await userDB.findOne({ email: req.body.email });

    if (data != null) {
      bcrypt.compare(req.body.password, data.password, function (err, result) {
        // if password is correct
        if (result === true) {
          // check role here for corresponding Credentials
          if (req.body.role !== data.role)
            return res.status(203).send({ message: "Incorrect Role !!!" });

          // generating a new access token
          let token = generateJWT(req.body);
          return res.status(200).send({
            message: "Token refreshed successfully !!!",
            token,
            name: data.user_name,
            email: data.email,
            role: data.role,
            access : data.access
          });
        } else return res.status(203).send({ message: "User Not Found !!!" });
      });
    } else {
      return res.status(203).send({ message: "User Not Found !!!" });
    }
  } catch (err) {
    console.log("Error >> ", err);
    res.status(500).send("Something went wrong !!!");
  }
};

// list logs
exports.listLogs = async (req, res) => {
  try {
    // logging.collection.drop()
    let response = await logging.find();
    // console.log(response)
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

// ================================================= Apis for User Ends =======================================================
