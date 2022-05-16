const route = require("express").Router();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser')
const multer = require('multer')

// CONTROLLER
const user = require("./controller/user");
const categoier = require("./controller/categories");
const products = require("./controller/product");
const banner = require("./controller/banner");
const order = require("./controller/order");
const subCategories = require("./controller/subCategories");
const primaryMaterial = require("./controller/primaryMaterial");
const secondaryMaterial = require("./controller/secondaryMaterial");
const polish = require("./controller/polish");
const hinge = require("./controller/hinge");
const fitting = require("./controller/fitting");
const knob = require("./controller/knob");
const Door = require("./controller/door");
const Handle = require("./controller/handle");
const Gallery = require("./controller/gallery");

// middilwear for the multer setup

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './upload/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + "_" + file.originalname);
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
}).fields([{ name: "product_image" }, { name: "featured_image" }, { name: "category_image" }, { name: 'banner_image' }, { name: 'specification_image' } ]);


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
        bcrypt.hash(req.body.password, salt, function(err, hash) {
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
route.post("/register", encode, user.register);

// login route
route.post("/login", upload, user.login);

// =============== Categories routes =======================

// addCategory route
route.post("/addCategory", AuthJwt, upload, categoier.addCatagories);

// get list of the categories
route.get("/listCategory", AuthJwt, categoier.getCatagories);

// edit list of the categories
route.patch("/editCategory", AuthJwt, upload, categoier.editCatagories);

// delete category 
route.delete("/deleteCategory", AuthJwt, categoier.deleteCategory);

// change category status 
route.post("/changeStatusCategory", upload, AuthJwt, categoier.changeStatus);

// =============== Products routes =======================

// add product

route.post('/addProducts', AuthJwt, upload, products.addProduct);

// Get the list product

route.get('/getListProduct', AuthJwt, products.getListProduct);

// delete product

route.delete('/deleteProduct', AuthJwt, products.deleteProduct);

// update product

route.patch('/updateProduct', AuthJwt, upload, products.updateProduct);

// Find last document for SKU id increment

route.get('/getLastProduct', AuthJwt, products.getLastProduct);

// ================== Banner Routes =============================

// add banners

route.post('/addBanner', AuthJwt, upload, banner.addBanner);

// list banners

route.get('/listBanner', AuthJwt, banner.listBanner);

// change status banners

route.patch('/chaneStatusBanner', upload, AuthJwt, banner.changeStatus);


// ================== Order Routes =============================

// Make Order

route.post('/makeOrder', upload, AuthJwt, order.makeOrder);

// List Order

route.get('/listOrder', AuthJwt, order.listOrder);

// ================== sub categories Routes =============================


// addCategory route
route.post("/addSubCategories", AuthJwt, upload, subCategories.addSubCatagories);

// list sub cat route
route.get("/getSubCatagories", AuthJwt, subCategories.getSubCatagories);

// cahge status of sub cat route
route.patch("/changeSubStatus", AuthJwt, upload, subCategories.changeSubStatus);

// edit sub cat 
route.patch("/editSubCatagories", AuthJwt, upload, subCategories.editSubCatagories);

// ================== Primary Material Routes =============================


// addCategory route
route.post("/addPrimaryMaterial", AuthJwt, upload, primaryMaterial.addPrimaryMaterial);

// list sub cat route
route.get("/getPrimaryMaterial", AuthJwt, primaryMaterial.getPrimaryMaterial);

// cahge status of changePrimaryMaterialStatus route
route.patch("/changePrimaryMaterialStatus", AuthJwt, upload, primaryMaterial.changePrimaryMaterialStatus);

// edit editPrimaryMaterial 
route.patch("/editPrimaryMaterial", AuthJwt, upload, primaryMaterial.editPrimaryMaterial);


// ==================  Secondary Material Routes =============================


// addCategory route
route.post("/addSecondaryMaterial", AuthJwt, upload, secondaryMaterial.addSecondaryMaterial);

// list sub cat route
route.get("/getSecondaryMaterial", AuthJwt, secondaryMaterial.getSecondaryMaterial);

// cahge status of changeSecondaryMaterialStatus route
route.patch("/changeSecondaryMaterialStatus", AuthJwt, upload, secondaryMaterial.changeSecondaryMaterialStatus);

// edit editPrimaryMaterial 
route.patch("/editSecondaryMaterial", AuthJwt, upload, secondaryMaterial.editSecondaryMaterial);


// ==================  Polish  Routes =============================


// addCategory route
route.post("/addPolish", AuthJwt, upload, polish.addPolish);

// list sub cat route
route.get("/getPolish", AuthJwt, polish.getPolish);

// cahge status of changePolishStatus route
route.patch("/changePolishStatus", AuthJwt, upload, polish.changePolishStatus);

// edit editPrimaryMaterial 
route.patch("/editPolish", AuthJwt, upload, polish.editPolish);



// ==================  Hinge  Routes =============================


// addCategory route
route.post("/addHinge", AuthJwt, upload, hinge.addHinge);

// list sub cat route
route.get("/getHinge", AuthJwt, hinge.getHinge);

// cahge status of changePolishStatus route
route.patch("/changeHingeStatus", AuthJwt, upload, hinge.changeHingeStatus);

// edit editPrimaryMaterial 
route.patch("/editHinge", AuthJwt, upload, hinge.editHinge);


// ==================  Fitting  Routes =============================


// addFitting route
route.post("/addFitting", AuthJwt, upload, fitting.addFitting);

// list getFitting route
route.get("/getFitting", AuthJwt, fitting.getFitting);

// cahge status of changeFittingStatus route
route.patch("/changeFittingStatus", AuthJwt, upload, fitting.changeFittingStatus);

// edit editPrimaryMaterial 
route.patch("/editFitting", AuthJwt, upload, fitting.editFitting);



// ==================  Knob  Routes =============================


// addKnob route
route.post("/addKnob", AuthJwt, upload, knob.addKnob);

// list getKnob route
route.get("/getKnob", AuthJwt, knob.getKnob);

// cahge status of changeKnobStatus route
route.patch("/changeKnobStatus", AuthJwt, upload, knob.changeKnobStatus);

// edit editKnob 
route.patch("/editKnob", AuthJwt, upload, knob.editKnob);

// ==================  Door  Routes =============================


// addDoor route
route.post("/addDoor", AuthJwt, upload, Door.addDoor);

// list getDoor route
route.get("/getDoor", AuthJwt, Door.getDoor);

// cahge status of changeDoorStatus route
route.patch("/changeDoorStatus", AuthJwt, upload, Door.changeDoorStatus);

// edit editDoor 
route.patch("/editDoor", AuthJwt, upload, Door.editDoor);



// ==================  Handle  Routes =============================


// addHandle route
route.post("/addHandle", AuthJwt, upload, Handle.addHandle);

// list getHandle route
route.get("/getHandle", AuthJwt, Handle.getHandle);

// cahge status of changeHandleStatus route
route.patch("/changeHandleStatus", AuthJwt, upload, Handle.changeHandleStatus);

// edit editHandle 
route.patch("/editHandle", AuthJwt, upload, Handle.editHandle);

// ===================== Gallery Routes =============

// list getGallery route
route.get("/getGallery", AuthJwt, Gallery.getGallery);

// delete 

route.delete("/deleteImage", AuthJwt, Gallery.deleteImage)

// updateImage

route.patch("/updateImage", AuthJwt, upload, Gallery.updateImage)

// addImage

route.post("/addImage", AuthJwt, upload, Gallery.addImage)




module.exports = route;