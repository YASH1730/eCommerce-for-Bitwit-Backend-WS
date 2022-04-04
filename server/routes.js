const route = require("express").Router();
const controller = require("./controller/controller");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// middilwear for encryption
function encode(req, res, next) {
  const saltRounds = 10;

  if (
    req.body.user_Name == undefined ||
    req.body.phoneNumber == undefined ||
    req.body.email == undefined ||
    req.body.password == undefined ||
    req.body.address == undefined
  )
    return res
      .status(204)
      .send({ error_massage: "Please enter all the required feilds." });

  // code to hash the password

  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      console.log(">>>>>", hash);
      if (hash !== null) {
        req.body.password = hash;
        console.log(req.body.password);
        next();
      }
    });
  });
}

// Midilwear For Authenticaion

function AuthJwt(req, res, next) {
  // console.log(req.headers)
  // when token is not sent by user while requesting
  if (req.headers.authorization === undefined) return res.sendStatus(401);

  let token = req.headers.authorization.split("Token ")[1];

  JWT.verify(token, process.env.JWT_Secreet, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// home route
route.get("/", controller.home);

// registration route
route.post("/register",encode,controller.register);

// login route
route.post("/login", controller.login);

module.exports = route;
