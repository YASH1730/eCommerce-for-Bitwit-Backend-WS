const route = require("express").Router();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const multer = require("multer");
// CONTROLLER
const user = require("./controller/user");
const customer = require("./controller/customer");
const categories = require("./controller/categories");
const products = require("./controller/product");
const mergeProduct = require("./controller/mergeProduct");
const banner = require("./controller/banner");
const order = require("./controller/order");
const subCategories = require("./controller/subCategories");
const primaryMaterial = require("./controller/primaryMaterial");
const secondaryMaterial = require("./controller/secondaryMaterial");
const polish = require("./controller/polish");
const hinge = require("./controller/hinge");
const fitting = require("./controller/fitting");
const knob = require("./controller/knob");
const Supplier = require("./controller/supplier");
const Handle = require("./controller/handle");
const Gallery = require("./controller/gallery");
const blog = require("./controller/blog");
const hardware = require("./controller/hardware");
// const like = require("./controller/like");
// const review = require("./controller/review");
const draft = require("./controller/draft");
const fabric = require("./controller/fabric");
const textile = require("./controller/textile");
const stock = require("./controller/stock");
const logging = require("../database/models/logging");
const cod = require("./controller/cod");
const { default: axios } = require("axios");
const review = require("./controller/review");

// middleware for the multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// check on files
const fileFilter = (req, file, cb) => {
  // for removing the space between the image file name to save it properly for URL
  file.originalname = file.originalname.replace(/ /g, "");
  console.log(file);
  // reject a file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/svg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "text/csv" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    if (file.fieldname === "COD_File") {
      file.originalname = "currentCSV.csv";
    }
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// multer fields and configurations here
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
  fileFilter: fileFilter,
}).fields([
  { name: "product_image" },
  { name: "featured_image" },
  { name: "category_image" },
  { name: "sub_category_image" },
  { name: "web_banner" },
  { name: "mobile_banner" },
  { name: "specification_image" },
  { name: "fabric_image" },
  { name: "textile_image" },
  { name: "primaryMaterial_image" },
  { name: "profile_image" },
  { name: "mannequin_image" },
  { name: "hardware_image" },
  { name: "outDoor_image" },
  { name: "inDoor_image" },
  { name: "COD_File" },
  { name: "review_images" },
  { name: "banner_image" },
  { name: "polish_image" },
]);

// middleware for encryption
function encode(req, res, next) {
  const saltRounds = 10;

  if (
    req.body.user_Name == undefined ||
    req.body.phoneNumber == undefined ||
    req.body.email == undefined ||
    req.body.password == undefined ||
    req.body.address == undefined ||
    req.body.role == undefined
  )
    return res
      .status(204)
      .send({ error_massage: "Please enter all the required felids." });

  // code to hash the password

  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      // //console.log(">>>>>", hash);
      if (hash !== null) {
        req.body.password = hash;
        //console.log(req.body.password);
        next();
      }
    });
  });
}

// middleware to parse the body
route.use(bodyParser.urlencoded({ extended: true }));
route.use(bodyParser.json());

// Middleware For Authentication
function AuthJwt(req, res, next) {
  // //console.log(req.headers)

  if (req.headers.authorization === undefined) return res.sendStatus(401);

  let token = req.headers.authorization.split("Bearer ")[1];

  JWT.verify(token, process.env.JWT_Secrete, (err, user) => {
    if (err)
      return res
        .status(403)
        .send({ message: "Please, request with valid token." });
    req.user = user;
    next();
  });
}

// middleware to track the IP of user
async function tracker(req, res, next) {
  const response = await axios.get("https://geolocation-db.com/json/");
  // console.log(response);
  console.log(">>>", req.body);
  let data = logging({
    email: req.body.email,
    role: req.body.role,
    ip: response.data.IPv4,
    city: response.data.city,
    location: {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
    },
  });
  data = await data.save();
  if (data) {
    next();
  } else {
    res.status(500).send({ message: "Problem with tracking !!!" });
  }
}

// =============== User routes =======================

// home route
route.get("/", user.home);

// registration route
route.post("/register", encode, user.register);

// login route
route.post("/login", upload, tracker, user.login);

// =============== Categories routes =======================

// addCategory route
route.post("/addCategory", AuthJwt, upload, categories.addCatagories);

// get list of the categories
route.get("/listCategory", AuthJwt, categories.getCatagories);

// edit list of the categories
route.patch("/editCategory", AuthJwt, upload, categories.editCatagories);

// delete category
route.delete("/deleteCategory", AuthJwt, categories.deleteCategory);

// change category status
route.post("/changeStatusCategory", upload, AuthJwt, categories.changeStatus);

// change category status
route.get("/getCategoryList", AuthJwt, categories.getCategoryList);

// change category status
route.post("/applyDiscount", upload, AuthJwt, categories.applyDiscount);

route.get("/getCategoryDetails", AuthJwt, categories.getCategoryDetails);

// =============== Products routes =======================

// add product

route.post("/addProducts", AuthJwt, upload, products.addProduct);

// Get the list product

route.get("/getListProduct", AuthJwt, upload, products.getListProduct);

// delete product

route.delete("/deleteProduct", products.deleteProduct);

// update product

route.patch("/updateProduct", AuthJwt, upload, products.updateProduct);

// Find last document for SKU id increment

route.get("/getLastProduct", products.getLastProduct);

// Update Bulk

route.post("/updateBulk", AuthJwt, upload, products.updateBulk);

// Get SKUs

route.get("/getPresentSKUs", AuthJwt, upload, products.getPresentSKUs);

// Get getProductDetails

route.get("/getProductDetails", AuthJwt, upload, products.getProductDetails);

// add variation

route.post("/variation", AuthJwt, upload, products.variation);

// get  hardware item for dropdown

route.get("/getHardwareDropdown", AuthJwt, products.getHardwareDropdown);

route.get("/getArticlesId", products.getArticlesId);

// =============== Merge Product routes =======================

// add product

route.post("/addMergeProduct", AuthJwt, upload, mergeProduct.addMergeProduct);

// Get the list product

route.get("/getListMergeProduct", AuthJwt, mergeProduct.getListMergeProduct);

// delete MergeProduct

route.delete("/deleteMergeProduct", AuthJwt, mergeProduct.deleteMergeProduct);

// update MergeProduct

route.patch(
  "/updateMergeProduct",
  AuthJwt,
  upload,
  mergeProduct.updateMergeProduct
);

// Find last document for SKU id increment

route.get("/getLastMergeProduct", AuthJwt, mergeProduct.getLastMergeProduct);

// Update Bulk

// route.post('/updateBulk', AuthJwt,upload, mergeMergeProduct.updateBulk);

// ================== Banner Routes =============================

// list banners

route.get("/listBanner", AuthJwt, banner.listBanner);

route.get("/getBannerDetails", AuthJwt, banner.getBannerDetails);

route.get("/getSequence", AuthJwt, banner.getSequence);

// ================== Order Routes =============================

// Make Order

route.post("/placeOrder", upload, order.placeOrder);

// List Order

route.get("/listOrders", AuthJwt, order.listOrder);

// Change Status

route.post("/changeOrderStatus", AuthJwt, upload, order.changeOrderStatus);

// Search Order
route.get("/searchOrder", order.searchOrder);

// getLastOrder
route.get("/getLastOrder", order.getLastOrder);

// get customer catalog
route.get("/customerCatalog", order.customerCatalog);

// add Custom product
route.post("/addCustomProduct", AuthJwt, upload, order.addCustomProduct);

// get last Custom product
route.get("/getLastCp", AuthJwt, order.getLastCp);

// get delete order
route.delete("/deleteOrder", AuthJwt, order.deleteOrder);

// get  Custom order
route.get("/customOrderList", AuthJwt, order.customOrderList);

// place abandoned checkouts
// route.post("/placeAbandonedOrder", upload, order.placeAbandonedOrder);
route.get("/listAbandonedOrder", AuthJwt, upload, order.listAbandonedOrder);

route.get("/getWishlist", AuthJwt, upload, order.getWishlist);

// ================== sub categories Routes =============================

// addCategory route
route.post(
  "/addSubCategories",
  AuthJwt,
  upload,
  subCategories.addSubCatagories
);

// list sub cat route
route.get("/getSubCatagories", AuthJwt, subCategories.getSubCatagories);

// change  status of sub cat route
route.patch("/changeSubStatus", AuthJwt, upload, subCategories.changeSubStatus);

// edit sub cat
route.patch(
  "/editSubCatagories",
  AuthJwt,
  upload,
  subCategories.editSubCatagories
);
// edit sub cat
route.get(
  "/getSubCategoryDetails",
  AuthJwt,
  upload,
  subCategories.getSubCategoryDetails
);

// ================== Primary Material Routes =============================

// addCategory route
route.post(
  "/addPrimaryMaterial",
  AuthJwt,
  upload,
  primaryMaterial.addPrimaryMaterial
);

// list sub cat route
route.get("/getPrimaryMaterial", AuthJwt, primaryMaterial.getPrimaryMaterial);

// change status of changePrimaryMaterialStatus route
route.patch(
  "/changePrimaryMaterialStatus",
  AuthJwt,
  upload,
  primaryMaterial.changePrimaryMaterialStatus
);

// edit editPrimaryMaterial
route.patch(
  "/editPrimaryMaterial",
  AuthJwt,
  upload,
  primaryMaterial.editPrimaryMaterial
);

// delete PrimaryMaterial
route.delete("/deletePrimaryMaterial", primaryMaterial.deletePrimaryMaterial);

// get material
route.get("/getMaterialDetails", AuthJwt, primaryMaterial.getMaterialDetails);

// ==================  Secondary Material Routes =============================

// addCategory route
route.post(
  "/addSecondaryMaterial",
  AuthJwt,
  upload,
  secondaryMaterial.addSecondaryMaterial
);

// list sub cat route
route.get(
  "/getSecondaryMaterial",
  AuthJwt,
  secondaryMaterial.getSecondaryMaterial
);

// change  status of changeSecondaryMaterialStatus route
route.patch(
  "/changeSecondaryMaterialStatus",
  AuthJwt,
  upload,
  secondaryMaterial.changeSecondaryMaterialStatus
);

// edit editPrimaryMaterial
route.patch(
  "/editSecondaryMaterial",
  AuthJwt,
  upload,
  secondaryMaterial.editSecondaryMaterial
);

// ==================  Polish  Routes =============================

// addCategory route
route.post("/addPolish", AuthJwt, upload, polish.addPolish);

// list sub cat route
route.get("/getPolish", AuthJwt, polish.getPolish);

// change  status of changePolishStatus route
route.patch("/changePolishStatus", AuthJwt, upload, polish.changePolishStatus);

// edit editPrimaryMaterial
route.patch("/editPolish", AuthJwt, upload, polish.editPolish);

// get Polish
route.get("/getPolishDetails", AuthJwt, polish.getPolishDetails);

// ==================  Hinge  Routes =============================

// addCategory route
route.post("/addHinge", AuthJwt, upload, hinge.addHinge);

// list sub cat route
route.get("/getHinge", AuthJwt, hinge.getHinge);

// change  status of changePolishStatus route
route.patch("/changeHingeStatus", AuthJwt, upload, hinge.changeHingeStatus);

// edit editPrimaryMaterial
route.patch("/editHinge", AuthJwt, upload, hinge.editHinge);

// ==================  Fitting  Routes =============================

// addFitting route
route.post("/addFitting", AuthJwt, upload, fitting.addFitting);

// list getFitting route
route.get("/getFitting", AuthJwt, fitting.getFitting);

// change  status of changeFittingStatus route
route.patch(
  "/changeFittingStatus",
  AuthJwt,
  upload,
  fitting.changeFittingStatus
);

// edit editPrimaryMaterial
route.patch("/editFitting", AuthJwt, upload, fitting.editFitting);

// ==================  Knob  Routes =============================

// addKnob route
route.post("/addKnob", AuthJwt, upload, knob.addKnob);

// list getKnob route
route.get("/getKnob", AuthJwt, knob.getKnob);

// change  status of changeKnobStatus route
route.patch("/changeKnobStatus", AuthJwt, upload, knob.changeKnobStatus);

// edit editKnob
route.patch("/editKnob", AuthJwt, upload, knob.editKnob);

// ==================  Supplier  Routes =============================

// addSupplier route
route.post("/addSupplier", AuthJwt, upload, Supplier.addSupplier);

// list getSupplier route
route.get("/getSupplier", AuthJwt, Supplier.getSupplier);

// edit editSupplier
route.patch("/editSupplier", AuthJwt, upload, Supplier.editSupplier);

// edit getLastSupplier
route.get("/getLastSupplier", Supplier.getLastSupplier);

// edit getLastSupplier
route.get("/getSupplierDropdown", Supplier.getSupplierDropdown);

// ==================  Handle  Routes =============================

// addHandle route
route.post("/addHandle", AuthJwt, upload, Handle.addHandle);

// list getHandle route
route.get("/getHandle", AuthJwt, Handle.getHandle);

// change  status of changeHandleStatus route
route.patch("/changeHandleStatus", AuthJwt, upload, Handle.changeHandleStatus);

// edit editHandle
route.patch("/editHandle", AuthJwt, upload, Handle.editHandle);

// ===================== Gallery Routes =============

// list getGallery route
route.get("/getGallery", AuthJwt, Gallery.getGallery);

// delete

route.delete("/deleteImage", AuthJwt, Gallery.deleteImage);

// updateImage

route.patch("/updateImage", AuthJwt, upload, Gallery.updateImage);

// addImage

route.post("/addImage", AuthJwt, upload, Gallery.addImage);

// =================== Curd for Blog  ==================

// create Blog
route.post("/createBlog", AuthJwt, upload, blog.createBlog);

// post Blog Image

route.post("/uploadImage", AuthJwt, upload, blog.uploadImage);

// get Blog Home
route.get("/getBlogHome", AuthJwt, upload, blog.getBlogHome);

// getBlog description
route.get("/getBlog", AuthJwt, upload, blog.getBlog);

// deleteBLog
route.delete("/deleteBLog", AuthJwt, upload, blog.deleteBLog);

// updateBlog
route.patch("/updateBlog", AuthJwt, upload, blog.updateBlog);

// ====================== For like Blog =========================

// post like
// route.post("/like", AuthJwt, upload, like.like)

// get like

// route.get("/getLike", AuthJwt, upload, like.like)

// post comment

// route.post("/comment", AuthJwt, upload, review.comment)

// ==================== Draft ===============================

route.post("/addDraft", AuthJwt, upload, draft.addDraft);

route.get("/getDraft", draft.getDraft);

route.get("/getDraftID", AuthJwt, draft.getDraftID);

route.delete("/deleteDraft", AuthJwt, draft.deleteDraft);

route.post("/dropDraft", AuthJwt, upload, draft.dropDraft);

route.get("/getMetaDraft", AuthJwt, draft.getMetaDraft);

// route.patch("/changeProductStatus", AuthJwt, upload, draft.changeProductStatus)

// =============== Fabric routes =======================

// addCategory route
route.post("/addFabric", AuthJwt, upload, fabric.addFabric);

// get list of the categories
route.get("/getFabric", AuthJwt, fabric.getFabric);

// edit list of the categories
route.patch("/editFabric", AuthJwt, upload, fabric.editFabric);

// delete category
route.delete("/deleteFabric", AuthJwt, fabric.deleteFabric);

// change category status
route.patch("/changeFabricStatus", upload, AuthJwt, fabric.changeFabricStatus);

// =============== Textile routes =======================

// addCategory route
route.post("/addTextile", AuthJwt, upload, textile.addTextile);

// get list of the categories
route.get("/getTextile", AuthJwt, textile.getTextile);

// edit list of the categories
route.patch("/editTextile", AuthJwt, upload, textile.editTextile);

// delete category
route.delete("/deleteTextile", AuthJwt, textile.deleteTextile);

// change category status
route.patch(
  "/changeTextileStatus",
  upload,
  AuthJwt,
  textile.changeTextileStatus
);

// =============== Customer routes =======================

// addCategory route
route.post("/addCustomer", AuthJwt, upload, customer.addCustomer);

// get list of the customer
route.get("/listCustomer", AuthJwt, customer.listCustomer);

// get delete of the customer
route.delete("/deleteCustomer", AuthJwt, customer.deleteCustomer);

// edit Customer
route.patch("/updateCustomer", AuthJwt, upload, customer.updateCustomer);

// delete category
route.delete("/deleteCustomer", AuthJwt, customer.deleteCustomer);

// =================== Stock route =========================

// // add to stock
// route.post('/addStock',AuthJwt,upload,stock.addStock);

// // list stock
// route.get('/listStock',AuthJwt,stock.listStock);

// // delete stock
// route.delete('/deleteStock',AuthJwt,stock.deleteStock);

// // update stock
// route.patch('/updateStock',AuthJwt ,upload ,stock.updateStock);

// // product preview
route.get("/getStockSKU", stock.getStockSKU);

route.post("/addInward", AuthJwt, upload, stock.addInward);

route.post("/addOutward", AuthJwt, upload, stock.addOutward);

route.post("/addTransfer", AuthJwt, upload, stock.addTransfer);

route.get("/listEntires", AuthJwt, stock.listEntires);

route.get("/totalEntries", AuthJwt, stock.totalEntries);

// =============== Hardware routes =======================

// addCategory route
route.post("/addHardware", AuthJwt, upload, hardware.addHardware);

// get list of the hardware
route.get("/getHardware", AuthJwt, hardware.getHardware);

// get last of the hardware
route.get("/getLastHardware", AuthJwt, hardware.getLastHardware);

// edit list of the hardware
route.patch("/editHardware", AuthJwt, upload, hardware.editHardware);

// delete category
route.delete("/deleteHardware", AuthJwt, hardware.deleteHardware);

// get hardware details
route.get("/getHardwareDetails", AuthJwt, hardware.getHardwareDetails);

// change category status
route.patch(
  "/changeHardwareStatus",
  upload,
  AuthJwt,
  hardware.changeHardwareStatus
);

// for token refresh
route.post("/refreshToken", upload, user.refreshToken);
route.get("/listLogs", user.listLogs);

// for pincode ===============

route.post("/uploadPincodeCSV", AuthJwt, upload, cod.uploadPincodeCSV);

route.get("/listPinCode", cod.listPinCode);

route.post("/statusDelivery", AuthJwt, upload, cod.statusDelivery);

route.delete("/deleteDelivery", cod.deletePincode);

route.get("/downloadCSV", cod.downloadCSV);

// reviews
route.get("/getReview", AuthJwt, review.getReview);

route.post("/changeStatus", AuthJwt, upload, review.changeStatus);

route.post("/addReply", AuthJwt, upload, review.addReply);

route.post("/addReview", AuthJwt, upload, review.addReview);

route.delete("/deleteReview", AuthJwt, review.deleteReview);

route.get("/metaReview", AuthJwt, review.metaReview);

route.patch("/updateReview", AuthJwt, upload, review.updateReview);

route.get("/getCOD", cod.getCod);

module.exports = route;
