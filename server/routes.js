const route = require("express").Router();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser')
const multer = require('multer')

// CONTROLLER
const user = require("./controller/user");
const categoier = require("./controller/categories");
const products = require("./controller/product");

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

// =============== User routes =======================

// home route
route.get("/", user.home);

// registration route
route.post("/register",encode,user.register);

// login route
route.post("/login", user.login);

// =============== Categories routes =======================

// addCategory route
route.post("/addCategory",AuthJwt,upload.single('category_image'),categoier.addCatagories);

// get list of the categories
route.get("/listCategory",AuthJwt,categoier.getCatagories);

// edit list of the categories
route.patch("/editCategory",AuthJwt,upload.single('category_image'),categoier.editCatagories);

// delete category 
route.delete("/deleteCategory",AuthJwt,categoier.deleteCategory);

// =============== Products routes =======================

// add product

route.post('/addProducts',AuthJwt,upload.single('product_image'),products.addProduct);

// Get the list product

route.get('/getListProduct',AuthJwt,products.getListProduct);

// Find last document for SKU id increment 

route.get('/getLastProduct',AuthJwt,products.getLastProduct);

module.exports = route;
