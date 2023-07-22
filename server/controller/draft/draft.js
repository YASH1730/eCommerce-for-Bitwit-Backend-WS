require("dotenv").config();
const draft = require("../../../database/models/draft");
const product = require("../../../database/models/products");
const hardware = require("../../../database/models/hardware");
const categories = require("../../../database/models/categories");
const subCategories = require("../../../database/models/subCategories");
const material = require("../../../database/models/primaryMaterial");
const polish = require("../../../database/models/polish");
const customer = require("../../../database/models/customer");
const coupon = require("../../../database/models/coupon");
const review = require("../../../database/models/review");
const uuid = require("uuid");
const blog = require("../../../database/models/blog");
const order = require("../../../database/models/order");
const banner = require("../../../database/models/banner");
const cod = require("../../../database/models/COD");
const cp = require("../../../database/models/customProduct");
const merge = require("../../../database/models/mergeProduct");
const pincode = require("../../../database/models/pincode");
const warehouse = require("../../../database/models/warehouse");
const purchase = require("../../../database/models/purchase_order");

// crypt
const Crypt = require("cryptr");
const crypt = new Crypt(process.env.PASS_Secrete);

// ================================================= Apis for Draft Products =======================================================
//==============================================================================================================================

// Add Draft

exports.addDraft = async (req, res) => {
  try {
    let data = {
      DID: req.body.DID,
      AID: req.body.AID,
      type: req.body.type,
      operation: req.body.operation,
    };
    let id = undefined;
    let image_urls = [];
    let previousImages = [];
    let videoURLs = [];
    let checkForCategory = 0;
    let checkForSubCategory = 0;
    let {operation} = req.body;
    
    if (!operation)
    return res.status(203).send({
      status : 203,
      message : "Please Operation Identification."
    })

    // getting the DID
    id = await draft.find({}, { _id: 0, DID: 1 }).sort({ _id: -1 }).limit(1);

    if (id.length > 0) {
      data.DID = `DID-0${parseInt(id[0].DID.split("-")[1]) + 1}`;
    } else {
      data.DID = "DID-01001";
    }

    // global var for switch case

    // selection stage
    switch (operation) {
      case "insertProduct":
        let Product_image_urls = [];

        if (req.files["product_image"] !== undefined) {
          req.files["product_image"].map((val) => {
            Product_image_urls.push(`${process.env.Official}/${val.path}`);
          });
        }

        req.body.product_image = Product_image_urls;

        req.body.featured_image = req.files["featured_image"]
          ? `${process.env.Official}/${req.files["featured_image"][0].path}`
          : "";

        req.body.specification_image = req.files["specification_image"]
          ? `${process.env.Official}/${req.files["specification_image"][0].path}`
          : "";

        req.body.mannequin_image = req.files["mannequin_image"]
          ? `${process.env.Official}/${req.files["mannequin_image"][0].path}`
          : "";

        req.body.primary_material = req.body.primary_material.split(",");
        req.body.polish = req.body.polish.split(",");
        req.body.warehouse = req.body.warehouse.split(",");

        req.body.selling_points = JSON.parse(req.body.selling_points);

        // ACIN number for variations
        req.body.ACIN = uuid.v4();

        data.message = "Alert : New Product adding request.";

        data.payload = req.body;

        break;
      case "updateProduct":
        req.body.primary_material = req.body.primary_material.split(",");
        req.body.polish = req.body.polish.split(",");
        req.body.warehouse = req.body.warehouse.split(",");

        if (req.files["product_image"] !== undefined) {
          req.files["product_image"].map((val) => {
            image_urls.push(`${process.env.Official}/${val.path}`);
          });
        }

        // check for previously saved image
        previousImages = JSON.parse(req.body.savedImages);

        if (previousImages.length > 0) image_urls.push(...previousImages);

        req.body.product_image = image_urls;

        // check for Images
        if (req.files["featured_image"] !== undefined)
          req.body.featured_image = `${process.env.Official}/${req.files["featured_image"][0].path}`;
        if (req.files["specification_image"] !== undefined)
          req.body.specification_image = `${process.env.Official}/${req.files["specification_image"][0].path}`;
        if (req.files["mannequin_image"] !== undefined)
          req.body.mannequin_image = `${process.env.Official}/${req.files["mannequin_image"][0].path}`;

        // check for product ID
        if (req.body._id === undefined)
          return res.status(204).send("Payload is absent.");

        // selling points conversation in array
        req.body.selling_points = JSON.parse(req.body.selling_points);

        data.message = `Alert : Product ${req.body.SKU} updating request.`;

        data.payload = req.body;
        break;
      case "variantProduct":
        image_urls = [];

        if (req.files["product_image"] !== undefined) {
          req.files["product_image"].map((val) => {
            image_urls.push(`${process.env.Official}/${val.path}`);
          });
        }

        req.body.primary_material = req.body.primary_material.split(",");
        req.body.polish = req.body.polish.split(",");
        req.body.warehouse = req.body.warehouse.split(",");

        // check for previously saved image
        let previousImages = JSON.parse(req.body.savedImages);

        if (previousImages.length > 0) image_urls.push(...previousImages);

        req.body.product_image = image_urls;

        // check for Images
        if (req.files["featured_image"] !== undefined)
          req.body.featured_image = `${process.env.Official}/${req.files["featured_image"][0].path}`;
        if (req.files["specification_image"] !== undefined)
          req.body.specification_image = `${process.env.Official}/${req.files["specification_image"][0].path}`;
        if (req.files["mannequin_image"] !== undefined)
          req.body.mannequin_image = `${process.env.Official}/${req.files["mannequin_image"][0].path}`;
        // selling points conversation in array
        req.body.selling_points = JSON.parse(req.body.selling_points);

        data.message = "Alert : New Product adding request.";

        data.payload = req.body;

        break;
      case "insertHardware":
        if (req.files["hardware_image"] !== undefined) {
          if (req.files["hardware_image"] !== null) {
            req.files["hardware_image"].map((val) => {
              image_urls.push(`${process.env.Official}/${val.path}`);
            });
          }
        }
        req.body.hardware_image = image_urls;

        req.body.featured_image = req.files["featured_image"]
          ? `${process.env.Official}/${req.files["featured_image"][0].path}`
          : "";

        req.body.specification_image = req.files["specification_image"]
          ? `${process.env.Official}/${req.files["specification_image"][0].path}`
          : "";

        req.body.primary_material = req.body.primary_material.split(",");

        req.body.warehouse = req.body.warehouse.split(",");
        // selling points conversation in array
        req.body.selling_points = JSON.parse(req.body.selling_points);

        

        data.message = "Alert : New HardWare adding request.";

        data.payload = req.body;

        break;
      case "updateHardware":
        if (req.files["hardware_image"] !== undefined) {
          req.files["hardware_image"].map((val) => {
            image_urls.push(`${process.env.Official}/${val.path}`);
          });
          req.body.hardware_image = image_urls;
        }

        // check for previously saved image
        previousImages = JSON.parse(req.body.savedImages);

        if (previousImages.length > 0) image_urls.push(...previousImages);

        req.body.hardware_image = image_urls;

        // check for Images
        if (req.files["featured_image"] !== undefined)
          req.body.featured_image = `${process.env.Official}/${req.files["featured_image"][0].path}`;
        if (req.files["specification_image"] !== undefined)
          req.body.specification_image = `${process.env.Official}/${req.files["specification_image"][0].path}`;

        req.body.primary_material = req.body.primary_material.split(",");

        
        data.message = `Alert : Hardware ${req.body.SKU} updating request.`;
        data.payload = req.body;
        break;
      case "deleteHardware":
        data.message = "Alert : HardWare deletion request.";
        data.payload = await hardware.findOne({ _id: req.body._id });
      case "insertCategory":
        if (req.files["category_image"] !== undefined)
          req.body.category_image = `${process.env.Official}/${req.files["category_image"][0].path}`;

        let duplicate = await categories.findOne({
          category_name: {
            $regex: `^${req.body.category_name}`,
            $options: "i",
          },
        });

        
        if (!duplicate) {
          data.message = "Alert : New Category adding request.";
          data.payload = req.body;
        } else {
          res.status(203);
          return res.send({
            status : 203,
            message: "Category Name is already exist in sub category!!!",
          });
        }

        break;
      case "updateCategory":
        if (req.files["category_image"] !== undefined)
          req.body.category_image = `${process.env.Official}/${req.files["category_image"][0].path}`;

        data.message = "Alert : New Category update request.";
        data.payload = req.body;
        break;
      case "insertSubCategory":
        if (req.files["sub_category_image"] !== undefined)
          req.body.sub_category_image = `${process.env.Official}/${req.files["sub_category_image"][0].path}`;

          console.log(req.body.sub_category_name)
         checkForCategory = await categories.find({
          category_name: { $regex : `${req.body.sub_category_name}`,$options : "i"},
        }).count();
         checkForSubCategory = await subCategories.find({$and : [
          {category_name: { $regex : `${req.body.category_name}`,$options : "i"}},
          {sub_category_name: { $regex : `${req.body.sub_category_name}`,$options : "i"}}
        ]
        }).count();

        console.log(checkForCategory,checkForSubCategory)
        if (checkForCategory === 0 && checkForSubCategory === 0) {
          data.message = "Alert : New Sub Category update request.";
          data.payload = req.body;
        } else {
          return res.status(203).send({
            message: "Sub Category Name is already exist in category!!!",
          });
        }
        break;
      case "updateSubCategory":
        if (req.files["sub_category_image"] !== undefined)
          req.body.sub_category_image = `${process.env.Official}/${req.files["sub_category_image"][0].path}`;

          checkForCategory = await categories.find({
            category_name: { $regex : `${req.body.sub_category_name}`,$options : "i"},
          }).count();
          checkForSubCategory = await subCategories.find({$and : [
            {category_name: { $regex : `${req.body.category_name}`,$options : "i"}},
            {sub_category_name: { $regex : `${req.body.sub_category_name}`,$options : "i"}}
          ]
          }).count();
  
          console.log(checkForCategory,checkForSubCategory)
          if (checkForCategory === 0 && checkForSubCategory === 0) {
            data.message = "Alert : New Sub Category update request.";
            data.payload = req.body;
    
          } else {
            return res.status(203).send({
              message: "Sub Category Name is already exist in category!!!",
            });
          } 

        break;
      case "deleteBlog":
        data.message = "Alert : Blog deletion request.";

        data.payload = await blog.findOne({ _id: req.body._id });
        break;
      case "insertMaterial":
        if (req.files["primaryMaterial_image"] !== undefined)
          req.body.primaryMaterial_image = `${process.env.Official}/${req.files["primaryMaterial_image"][0].path}`;

        data.message = "Alert : New Material adding request.";
        data.payload = req.body;
        break;
      case "updateMaterial":
        if (req.files["primaryMaterial_image"] !== undefined)
          req.body.primaryMaterial_image = `${process.env.Official}/${req.files["primaryMaterial_image"][0].path}`;

        data.message = `Alert : Material ${req.body.AID} updating request.`;
        data.payload = req.body;
        break;
      case "insertPolish":
        image_urls = [];

        if (req.files["outDoor_image"] !== undefined) {
          req.files["outDoor_image"].map((val) => {
            image_urls.push(`${process.env.Official}/${val.path}`);
          });
        }

        req.body.outDoor_image = image_urls;

        image_urls = [];

        if (req.files["inDoor_image"] !== undefined) {
          req.files["inDoor_image"].map((val) => {
            image_urls.push(`${process.env.Official}/${val.path}`);
          });
        }

        req.body.inDoor_image = image_urls;

        data.message = "Alert : New Polish adding request.";

        data.payload = req.body;
        break;
      case "updatePolish":
        image_urls = JSON.parse(req.body.savedOutDoor);

        if (req.files["outDoor_image"] !== undefined) {
          req.files["outDoor_image"].map((val) => {
            image_urls.push(`${process.env.Official}/${val.path}`);
          });
        }

        req.body.outDoor_image = image_urls;

        image_urls = JSON.parse(req.body.savedIndoor);

        if (req.files["inDoor_image"] !== undefined) {
          req.files["inDoor_image"].map((val) => {
            image_urls.push(`${process.env.Official}/${val.path}`);
          });
        }
        req.body.inDoor_image = image_urls;

        data.message = `Alert : Polish ${req.body._id} updating request.`;

        data.payload = req.body;
        break;
      case "insertBlog":
        req.body.uuid = uuid.v4();

        if (req.files["banner_image"] === undefined)
          return res.status(203).send({ message: "Image Is Required !!!" });
        req.body.card_image = `${process.env.Official}/${req.files["banner_image"][0].path}`;

        data.message = "Alert : New Blog adding request.";
        data.payload = req.body;

        break;
      case "updateBlog":
        if (req.files["banner_image"] !== undefined)
          req.body.card_image = `${process.env.Official}/${req.files["banner_image"][0].path}`;

        data.message = `Alert : BLog ${req.body._id} updating request.`;

        data.payload = req.body;
        break;
      case "deleteCustomer":
        data.message = "Alert : Customer deletion request.";

        data.payload = await customer.findOne(
          { CID: data.AID },
          { address: 0 }
        );
        break;
      case "createOrder":
        if (req.body.CID === null) req.body.CID = "Not Registered";

        // this step is for fulfillment obj of the  product
        req.body.items = {};

        // {
        //   fulfilled: false,
        //   trackingId: '',
        //   shipping_carrier: '',
        //   qty: 0,
        //   date : ""
        // }
        Object.keys(req.body.quantity).map(
          (row) =>
            (req.body.items = {
              ...req.body.items,
              [row]: [],
            })
        );

        data.message = "Alert : Create Order request.";
        data.payload = req.body;
        break;
      case "addBanner":
        
        // Web
        if (req.files["web_banner"] !== undefined)
          req.body.web_banner = `${process.env.Official}/${req.files["web_banner"][0].path}`;
        // Mobile
        if (req.files["mobile_banner"] !== undefined)
          req.body.mobile_banner = `${process.env.Official}/${req.files["mobile_banner"][0].path}`;
        req.body.uuid = uuid.v4();
        
        data.message = "Alert : Add Banner request.";
        data.payload = req.body;
        break;
      case "updateBanner":
        
        // Web
        if (req.files["web_banner"] !== undefined)
          req.body.web_banner = `${process.env.Official}/${req.files["web_banner"][0].path}`;
        // Mobile
        if (req.files["mobile_banner"] !== undefined)
          req.body.mobile_banner = `${process.env.Official}/${req.files["mobile_banner"][0].path}`;
        
        data.message = "Alert : Update Banner request.";
        data.payload = req.body;
        break;
      case "deleteBanner":
        data.message = "Alert : Banner deletion request.";

        data.payload = await banner.findOne({ uuid: data.AID });
        break;
      case "applyCOD":
        data.message = "Alert : Update COD limits.";
        data.payload = req.body;
        break;
      case "addCoupon":
        data.message = "Alert : Add new coupon request.";
        data.payload = req.body;
        break;
      case "deleteCoupon":
        data.message = "Alert : Coupon deletion request.";

        data.payload = await coupon.findOne({ coupon_code: data.AID });
        break;
      case "updateCoupon":
        data.message = "Alert : Update coupon request.";
        data.payload = req.body;
        break;
      case "addReview":
        if (req.files["review_images"]) {
          if (req.files["review_images"].length > 0) {
            req.files["review_images"].map((file) => {
              if (file.mimetype === "video/mp4")
                return videoURLs.push(`${process.env.Official}/${file.path}`);
              return image_urls.push(`${process.env.Official}/${file.path}`);
            });
          }
        }

        // req.body.review = JSON.parse(req.body.review);

        req.body.review_images = image_urls;
        req.body.review_videos = videoURLs;

        data.message = "Alert : Add review request.";
        data.payload = req.body;
        break;
      case "updateReview":
        data.message = "Alert : Update review request.";
        data.payload = req.body;
        break;
      case "addReply":
        data.message = "Alert : Add reply request.";

        data.payload = req.body;
        break;
      case "deleteReview":
        data.message = "Alert : Review deletion request.";
        data.payload = await review.findOne({ _id: data.AID });
        break;
      case "addCustomer":
        req.body.CID = `CID-${uuid.v4()}`;
        if (req.files["profile_image"] !== undefined)
          req.body.profile_image = `${process.env.Official}/${req.files["profile_image"][0].path}`;
        req.body.password = crypt.encrypt(req.body.password);
        req.body.address = JSON.parse(req.body.shipping);
        req.body.billing = JSON.parse(req.body.billing);
        data.message = "Alert : Add customer request.";
        data.payload = req.body;
        break;
      case "editOrder":
        
        let products = JSON.parse(req.body.quantity);
        let productPrice = JSON.parse(req.body.product_price);
        let discount = JSON.parse(req.body.discount_per_product);
        req.body.items = JSON.parse(req.body.items);

        req.body.quantity = products;

        const ids = Object.keys(products);

        let price = await product.find(
          { SKU: { $in: ids } },
          { SKU: 1, selling_price: 1 }
        );
        let Cprice = await cp.find(
          { CUS: { $in: ids } },
          { CUS: 1, selling_price: 1 }
        );

        // assigning the new product price to it
        price.map((row) => {
          if (!productPrice.hasOwnProperty(row.SKU))
            Object.assign(productPrice, { [row.SKU]: row.selling_price });
        });
        // assigning gthe new product price to it
        Cprice.map((row) => {
          if (!productPrice.hasOwnProperty(row.CUS))
            Object.assign(productPrice, { [row.CUS]: row.selling_price });
        });

        // assigning gthe new product discount to it
        ids.map((row) => {
          if (!discount.hasOwnProperty(row))
            Object.assign(discount, { [row]: 0 });
        });

        price = Object.keys(productPrice).reduce((sum, row) => {
          return sum + products[row] * productPrice[row];
        }, 0);

        

        req.body.product_price = productPrice;
        req.body.discount_per_product = discount;

        req.body.subTotal = price;
        req.body.total =
          req.body.discount_type === "percentage"
            ? price - (price / 100) * req.body.discount
            : price - req.body.discount;

        data.message = "Alert : Update order request.";
        data.payload = req.body;
        break;
      case "addOrderFulfillment":
        req.body.items = JSON.parse(req.body.items);
        
        data.message = "Alert : Order fulfillment  request.";
        data.payload = req.body;
        break;
      case "updateProductStatus":
        
        // check for product ID
        if (req.body._id === undefined)
          return res.status(204).send("Payload is absent.");

        data.message = `Alert : Product updating request.`;

        data.payload = req.body;
        break;
      case "updateMergeProductStatus":
        if (req.body._id === undefined)
          return res.status(204).send("Payload is absent.");

        data.message = `Alert : Merge Product updating request.`;

        data.payload = req.body;
        break;
      case "deletePinCode":
        data.message = "Alert : Pin code deletion request.";
        data.payload = await pincode.findOne({ _id: data.AID });
        break;
      case "addWarehouse":
        data.message = "Alert : Adding warehouse request.";
        data.payload = req.body;
        break;
      case "updateWarehouse":
        // check for product ID
        if (req.body._id === undefined)
          return res.status(204).send("Payload is absent.");
        data.message = "Alert : Update Warehouse request.";
        data.payload = req.body;
        break;
      case "deleteWarehouse":
        data.message = "Alert : Delete warehouse request.";
        data.payload = req.body;
        break;
      case "add_purchase_order" :
        req.body.product_articles = JSON.parse(req.body.product_articles)
        req.body.hardware_articles = JSON.parse(req.body.hardware_articles)
        
        data.message = "Alert : Placing a purchase order request.";
        data.payload = req.body;
        break;
        case "deletePurchaseOrder":
          data.message = "Alert : Purchase order deletion request.";
          data.payload = await purchase.findOne({ PID: req.body.PID });  break; 
          default:
        return res.status(203).send({ status: 203, message: "Type not found." });
      }
      

    if (!data.payload)
      return res.status(203).send({ status: 203, message: "Type not found." });


    const insert = draft(data);

    let response = await insert.save();

    if (response)
      return res.status(200).send({ status: 200, message: "Draft Added !!!" });
  } catch (err) {
    console.log("Error>> ", err);
    res.status(500).send({ status: 500, message: "Something went wrong" });
  }
};

async function finalDrop(req, res) {
  try {
    
    let response = await draft.updateOne(
      { DID: req.body.DID },
      { draftStatus: req.body.draftStatus, AID: req.body.AID },
      );
    return response.modifiedCount > 0
      ? res
          .status(200)
          .send({ status: 200, message: "Draft resolved successfully." })
      : res
          .status(203)
          .send({ status: 203, message: "Error while resolving the draft." });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ status: 500, message: "Some Error Occurred !!!" });
  }
}

// Apis for Drop the Data into related table
exports.dropDraft = async (req, res) => {
  try {
    
    let data = " ";

    let {operation} = req.body

    if(!operation) return res.status(203).send({
      status : 203,
      message : "Operation is missing !!!"
    })

    switch (operation) {
      case "insertProduct":
        req.body.SKU = await getSKU();
        data = product(req.body);
        return await data.save() ? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" }); 
      case "variantProduct":
        req.body.SKU = await getSKU();
        data = product(req.body);
        return await data.save() ? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" }); 
      case "updateProduct":
        return await product.findOneAndUpdate({ _id: req.body._id }, req.body) ? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" }); 
      case "insertHardware":
        req.body.SKU = await getHKU();
        data = hardware(req.body);
        return await data.save() ? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "updateHardware":
        return await hardware.findOneAndUpdate(
          { SKU: req.body.AID },
          req.body
        ) ? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "deleteHardware":
         return await hardware.findOneAndRemove({ SKU: req.body.SKU }) ? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "insertCategory":
        data = categories(req.body);
         return await data.save()? finalDrop(req,res): res
         .status(500)
         .send({ message: "Some Error Occurred !!!" }); 
      case "updateCategory":
        return await categories.findOneAndUpdate(
          { _id: req.body.AID },
          req.body
        )? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "insertSubCategory":
        data = subCategories(req.body);
        return  await data.save()? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "updateSubCategory":
        return await subCategories.findOneAndUpdate(
          { _id: req.body.AID },
          req.body
        )? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "deleteBlog":
        return await blog.findOneAndRemove({ _id: req.body._id }) ? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "insertMaterial":
        data = material(req.body);
        return await data.save() ? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "updateMaterial":
        return await material
          .findOneAndUpdate({ _id: req.body.AID }, req.body)
          ? finalDrop(req,res): res
          .status(500)
          .send({ message: "Some Error Occurred !!!" });
      case "insertPolish":
        data = polish(req.body);
        return await data.save() ? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "updatePolish":
        return await polish
          .findOneAndUpdate({ _id: req.body.AID }, req.body)
          ? finalDrop(req,res): res
          .status(500)
          .send({ message: "Some Error Occurred !!!" });
      case "insertBlog":
        data = blog(req.body);
        return await data.save()? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "updateBlog":
        return await blog.findOneAndUpdate({ _id: req.body.AID }, req.body)? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "deleteCustomer":
        return await customer.findOneAndRemove({ CID: req.body.CID }) ? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "createOrder":
        req.body.O = getO();
        data = order(req.body);
        return await data.save()? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "addBanner":
        data = banner(req.body);
        return await data.save()? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "deleteBanner":
        return await banner.findOneAndRemove({ uuid: req.body.uuid })? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "updateBanner":
        return  await banner.findOneAndUpdate(
          { uuid: req.body.AID },
          req.body
        )? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "applyCOD":
      return await cod.findOneAndUpdate(
          { limit: req.body.limit },
          req.body,
          { upsert: true }
        )? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "addCoupon":
        data = coupon(req.body);
        return await data.save()? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "deleteCoupon":
        return await coupon.findOneAndRemove({ _id: req.body._id })? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "updateCoupon":
        return  await coupon.findOneAndUpdate(
          { coupon_code: req.body.AID },
          req.body
        )? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "addReview":
        data =  review(req.body);
        return await data.save()? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "updateReview":
        return await review.findOneAndUpdate(
          { _id: req.body.AID },
          req.body
        )? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "addReply":
        let reply = JSON.parse(req.body.reply);

        let old = await review.findOne(
          { _id: req.body._id },
          { admin_reply: 1 }
        );

        reply = [...old.admin_reply, ...reply];

        return await review.findOneAndUpdate(
          { _id: req.body._id },
          { admin_reply: reply }
        )
      case "deleteReview":
        return await review.findOneAndRemove({ _id: req.body._id })? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "addCustomer":
        data = customer(req.body);
        return await data.save()? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "editOrder":
        return await order.findOneAndUpdate({ O: req.body.AID }, req.body)? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "addOrderFulfillment":
        
        return  await order.findOneAndUpdate({ O: req.body.AID }, req.body)? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "updateProductStatus":
       return await  product
          .findOneAndUpdate({ _id: req.body.AID }, req.body)? finalDrop(req,res): res
          .status(500)
          .send({ message: "Some Error Occurred !!!" });
      case "updateMergeProductStatus":
        return await merge
          .findOneAndUpdate({ _id: req.body.AID }, req.body)
          ? finalDrop(req,res): res
          .status(500)
          .send({ message: "Some Error Occurred !!!" });
      case "deletePinCode":
        return await pincode.findOneAndRemove({ _id: req.body._id })? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "addWarehouse":
        data = warehouse(req.body);
        return await data.save()? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "updateWarehouse":
        return await warehouse.findOneAndUpdate(
          { _id: req.body.AID },
          req.body
        )? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      case "add_purchase_order":
          req.body.PID = await getPID();
          data = purchase(req.body);
          return await data.save() ? finalDrop(req,res): res
          .status(500)
          .send({ message: "Some Error Occurred !!!" });
      case "add_purchase_order":
          req.body.PID = await getPID();
          data = purchase(req.body);
          return await data.save() ? finalDrop(req,res): res
          .status(500)
          .send({ message: "Some Error Occurred !!!" });
      case "deletePurchaseOrder":
         return await purchase.findOneAndRemove({ PID: req.body.PID }) ? finalDrop(req,res): res
        .status(500)
        .send({ message: "Some Error Occurred !!!" });
      default:
        return res.status(203).send({
          status : 203,
          message : "No Operation found !!!"
        })
      }
  } catch (err) {
    console.log("Error >> ", err);
    return res
      .status(500)
      .send({ status: 500, message: "Something went wrong !!!" });
  }
};

// Get Draft Id

exports.getDraftID = async (req, res) => {
  try {
    let response = await draft
      .find({}, { _id: 0, DID: 1 })
      .sort({ _id: -1 })
      .limit(1);

    if (response) {
      // // console.log(response);
      return res.send(response);
    } else {
      return res.status(203).send("D-01001");
    }
  } catch (err) {
    // console.log(err);
    res.status(203).send({ message: "Some error occurred !!!" });
  }
};

// draft getting
exports.getDraft = async (req, res) => {
  try {
    let { pending, approved, page, limit } = req.query;

    let query = {};

    if (pending === "true") query = { draftStatus: "Pending" };
    else if (approved === "true") query = { draftStatus: "Approved" };

    const response = await draft
      .find(query)
      .sort({ _id: -1 })
      .skip(page > 0 ? (page - 1) * limit : 0)
      .limit(limit);
    let total = await draft.estimatedDocumentCount();

    if (response)
      return res.status(200).send({
        status: 200,
        message: "Draft list fetched successfully.",
        data: response,
        total: total,
      });
    else
      return res.status(203).send({
        status: 203,
        message: "Facing an issue while fetching the draft list.",
        data: response,
        total: total,
      });
  } catch (err) {
    return res
      .status(500)
      .send({ status: 500, message: "Something Went Wrong !!!" });
  }
};

// delete products

exports.deleteDraft = async (req, res) => {
  draft
    .deleteOne({ _id: req.query.ID })
    .then((data) => {
      res.send({ message: "Product deleted successfully !!!" });
    })
    .catch((err) => {
      res.send({ message: "Some error occurred !!!" });
    });
};

// Analytics
exports.getMetaDraft = async (req, res) => {
  const data = {
    total: 0,
    pending: 0,
    resolved: 0,
  };
  try {
    const response = await draft.find({}, { _id: 1, draftStatus: 1 });

    if (response) {
      response.map((row) => {
        switch (row.draftStatus) {
          case "Approved":
            data.resolved += 1;
            break;
          case "Pending":
            data.pending += 1;
            break;
          default:
            break;
        }
      });

      data.total = response.length;
    }

    return res.send(data);
  } catch (error) {
    console.log(error);
    res.sendStatus("500").send({ message: "Something Went Wrong !!!" });
  }
};

// exports.update = async (req, res) => {
//   // console.log(req.query);
//   let response = await draft.findOneAndUpdate(
//     { $or: [{ DID: req.query.DID }, { _id: req.query.id }] },
//     { DID: req.query.changeTo }
//   );
//   res.send("Okay");
// };

async function getSKU() {
  let res = await product.find().count();
  return res > 0 ? `P-0${res + 1001}` : "P-01001";
}

async function getPID() {
  let res = await purchase.find().count();
  return res > 0 ? `PID-0${res + 1001}` : "PID-01001";
}


async function getHKU() {
  let res = await hardware.find().count();
  return res > 0 ? `H-0${res + 1001}` : "H-01001";
}


async function getO() {
  
  let res = await order.find().count();
  return res > 0 ? `O-0${res + 1001}` : "O-01001";
};

// async function deleteCat(){
//   let list = await subCategories.findOneAndDelete({sub_category_name : "Easy chair"})
//   console.log(list)
// }

// deleteCat()
// ================================================= Apis for Products Ends =======================================================

