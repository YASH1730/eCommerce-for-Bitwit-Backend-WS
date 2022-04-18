const route = require("express").Router();
const controller = require("./controller/controller");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser')
const multer = require('multer')



// middilwear for the multer setup

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './upload/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() +"_"+ file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


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
      // console.log(">>>>>", hash);
      if (hash !== null) {
        req.body.password = hash;
        console.log(req.body.password);
        next();
      }
    });
  });
}


// midilwear to parse the body 
route.use(bodyParser.urlencoded({ extended: true }));
route.use(bodyParser.json());

// Midilwear For Authenticaion

function AuthJwt(req, res, next) {
  // console.log(req.headers)
  // when token is not sent by user while requesting
  if (req.headers.authorization === undefined) return res.sendStatus(401);

  let token = req.headers.authorization.split("Bearer ")[1];

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

// addCategory route
route.post("/addCategory",AuthJwt,upload.single('category_image'),controller.addCatagories);

// get list of the categories
route.get("/listCategory",AuthJwt,controller.getCatagories);

// edit list of the categories
route.patch("/editCategory",AuthJwt,upload.single('category_image'),controller.editCatagories);


module.exports = route;
