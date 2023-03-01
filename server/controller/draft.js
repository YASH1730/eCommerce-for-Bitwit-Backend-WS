require("dotenv").config();
const draft = require("../../database/models/draft");
const product = require("../../database/models/products");
const hardware = require("../../database/models/hardware");
const categories = require("../../database/models/categories");
const subCategories = require("../../database/models/subCategories");
const material = require("../../database/models/primaryMaterial");
const polish = require("../../database/models/polish");
const customer = require("../../database/models/customer");

const uuid = require("uuid");
const blog = require("../../database/models/blog");

// Schema({
//     DID : {type: String, unique : true},
//     AID : {type : String},
//     type : {type : String},
//     payload : {type : String}
//  },{timestamps: {
//      createdAt: 'created_at',
//      updatedAt: 'updated_at'
//    }})

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
    // console.log(req.files);

    // console.log(req.body);

    // global var for switch case

    // selection stage
    switch (req.body.operation) {
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

        // console.log(req.body)

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

        console.log(req.body);
        data.message = `Alert : Hardware ${req.body.SKU} updating request.`;
        data.payload = req.body;
        break;
      case "deleteHardware":
        id = await draft
          .find({}, { _id: 0, DID: 1 })
          .sort({ _id: -1 })
          .limit(1);

        if (id) {
          console.log(">>>", id[0]);
          data.DID = `DID-0${parseInt(id[0].DID.split("-")[1]) + 1}`;
        } else {
          data.DID = "D-01001";
        }
        console.log(req.body);

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

        if (duplicate === null) {
          data.message = "Alert : New Category adding request.";
          data.payload = req.body;
        } else {
          res.status(203);
          return res.send({
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

        // const data = subCategories(req.body);
        let check = await categories.findOne({
          category_name: `${req.body.sub_category_name}`,
        });

        if (check === null) {
          data.message = "Alert : New Sub Category update request.";
          data.payload = req.body;
        } else {
          res.status(203);
          res.send({
            message: "Sub Category Name is already exist in category!!!",
          });
        }

        break;
      case "updateSubCategory":
        if (req.files["sub_category_image"] !== undefined)
          req.body.sub_category_image = `${process.env.Official}/${req.files["sub_category_image"][0].path}`;

        data.message = "Alert : New Sub Category update request.";
        data.payload = req.body;
        break;
      case "deleteBlog":
        id = await draft
          .find({}, { _id: 0, DID: 1 })
          .sort({ _id: -1 })
          .limit(1);

        if (id) {
          console.log(">>>", id[0]);
          data.DID = `DID-0${parseInt(id[0].DID.split("-")[1]) + 1}`;
        } else {
          data.DID = "D-01001";
        }
        console.log(req.body);

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
      case "deleteCustomer":
        id = await draft
          .find({}, { _id: 0, DID: 1 })
          .sort({ _id: -1 })
          .limit(1);

        if (id) {
          console.log(">>>", id[0]);
          data.DID = `DID-0${parseInt(id[0].DID.split("-")[1]) + 1}`;
        } else {
          data.DID = "D-01001";
        }
        console.log(req.body);

        data.message = "Alert : Customer deletion request.";

        data.payload = await customer.findOne(
          { CID: data.AID },
          { address: 0 }
        );
        break;
      default:
        console.log("May be operation type not found.");
    }

    // console.log(data);

    // return res.send("All Okay");

    if (!data.payload) return res.status(203).send("Type not found.");

    console.log(data);

    const insert = draft(data);

    let response = await insert.save();

    if (response) return res.send({ message: "Draft Added !!!" });
  } catch (err) {
    console.log("Error>> ", err);
    res.status(500).send({ message: "Something went wrong" });
  }
};

// Apis for Drop the Data into related table
exports.dropDraft = async (req, res) => {
  try {
    // console.log(req.files);
    // console.log(JSON.parse(req.body));
    console.log(req.body);

    // return res.send('All okay ')
    let response = "";
    let data = "";
    switch (req.body.operation) {
      case "insertProduct":
        data = product(req.body);
        response = await data.save();
        if (response) {
          //console.log(req.body.operation)
          draft
            .updateOne(
              { DID: req.body.DID },
              { draftStatus: req.body.draftStatus, AID: req.body.AID }
            )
            .then(() => {
              return res.send({ message: "Draft Resolved !!!" });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .send({ message: "Some Error Occurred !!!" });
            });
        }
        break;
      case "updateProduct":
        product
          .findOneAndUpdate({ SKU: req.body.AID }, req.body)
          .then(() => {
            //console.log(req.body.operation)
            draft
              .updateOne(
                { DID: req.body.DID },
                { draftStatus: req.body.draftStatus }
              )
              .then(() => {
                return res.send({ message: "Draft Resolved !!!" });
              })
              .catch((err) => {
                console.log(err);
                return res
                  .status(500)
                  .send({ message: "Some Error Occurred !!!" });
              });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).send({ message: "Some Error Occurred !!!" });
          });
        break;
      case "insertHardware":
        data = hardware(req.body);
        response = await data.save();
        if (response) {
          //console.log(req.body.operation)
          draft
            .updateOne(
              { DID: req.body.DID },
              { draftStatus: req.body.draftStatus, AID: req.body.AID }
            )
            .then(() => {
              return res.send({ message: "Draft Resolved !!!" });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .send({ message: "Some Error Occurred !!!" });
            });
        }
        break;
      case "updateHardware":
        response = await hardware.findOneAndUpdate(
          { SKU: req.body.AID },
          req.body
        );
        if (response) {
          // //console.log(req.body.operation)
          draft
            .updateOne(
              { DID: req.body.DID },
              { draftStatus: req.body.draftStatus }
            )
            .then(() => {
              return res.send({ message: "Draft Resolved !!!" });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .send({ message: "Some Error Occurred !!!" });
            });
        }
        break;
      case "deleteHardware":
        response = await hardware.findOneAndRemove({ SKU: req.body.SKU });
        console.log(req.body.operation);
        if (response) {
          draft
            .updateOne(
              { DID: req.body.DID },
              { draftStatus: req.body.draftStatus }
            )
            .then(() => {
              return res.send({ message: "Draft Resolved !!!" });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .send({ message: "Some Error Occurred !!!" });
            });
        }
        break;
      case "insertCategory":
        data = categories(req.body);
        response = await data.save();
        if (response) {
          //console.log(req.body.operation)
          draft
            .updateOne(
              { DID: req.body.DID },
              { draftStatus: req.body.draftStatus, AID: response._id }
            )
            .then(() => {
              return res.send({ message: "Draft Resolved !!!" });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .send({ message: "Some Error Occurred !!!" });
            });
        }
        break;
      case "updateCategory":
        response = await categories.findOneAndUpdate(
          { _id: req.body.AID },
          req.body
        );
        if (response) {
          // //console.log(req.body.operation)
          draft
            .updateOne(
              { DID: req.body.DID },
              { draftStatus: req.body.draftStatus }
            )
            .then(() => {
              return res.send({ message: "Draft Resolved !!!" });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .send({ message: "Some Error Occurred !!!" });
            });
        }
        break;
      case "insertSubCategory":
        data = subCategories(req.body);
        response = await data.save();
        if (response) {
          //console.log(req.body.operation)
          draft
            .updateOne(
              { DID: req.body.DID },
              { draftStatus: req.body.draftStatus, AID: response._id }
            )
            .then(() => {
              return res.send({ message: "Draft Resolved !!!" });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .send({ message: "Some Error Occurred !!!" });
            });
        }
        break;
      case "updateSubCategory":
        response = await subCategories.findOneAndUpdate(
          { _id: req.body.AID },
          req.body
        );
        if (response) {
          // //console.log(req.body.operation)
          draft
            .updateOne(
              { DID: req.body.DID },
              { draftStatus: req.body.draftStatus }
            )
            .then(() => {
              return res.send({ message: "Draft Resolved !!!" });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .send({ message: "Some Error Occurred !!!" });
            });
        }
        break;
      case "deleteBlog":
        response = await blog.findOneAndRemove({ _id: req.body._id });
        console.log(req.body.operation);
        if (response) {
          draft
            .updateOne(
              { DID: req.body.DID },
              { draftStatus: req.body.draftStatus }
            )
            .then(() => {
              return res.send({ message: "Draft Resolved !!!" });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .send({ message: "Some Error Occurred !!!" });
            });
        }
        break;
      case "insertMaterial":
        console.log(req.body);
        data = material(req.body);
        response = await data.save();
        if (response) {
          //console.log(req.body.operation)
          draft
            .updateOne(
              { DID: req.body.DID },
              { draftStatus: req.body.draftStatus, AID: response._id }
            )
            .then(() => {
              return res.send({ message: "Draft Resolved !!!" });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .send({ message: "Some Error Occurred !!!" });
            });
        }
        break;
      case "updateMaterial":
        material
          .findOneAndUpdate({ _id: req.body.AID }, req.body)
          .then(() => {
            //console.log(req.body.operation)
            draft
              .updateOne(
                { DID: req.body.DID },
                { draftStatus: req.body.draftStatus }
              )
              .then(() => {
                return res.send({ message: "Draft Resolved !!!" });
              })
              .catch((err) => {
                console.log(err);
                return res
                  .status(500)
                  .send({ message: "Some Error Occurred !!!" });
              });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).send({ message: "Some Error Occurred !!!" });
          });
        break;
      case "insertPolish":
        data = polish(req.body);
        response = await data.save();
        if (response) {
          //console.log(req.body.operation)
          draft
            .updateOne(
              { DID: req.body.DID },
              { draftStatus: req.body.draftStatus, AID: response._id }
            )
            .then(() => {
              return res.send({ message: "Draft Resolved !!!" });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .send({ message: "Some Error Occurred !!!" });
            });
        }
        break;
      case "updatePolish":
        polish
          .findOneAndUpdate({ _id: req.body.AID }, req.body)
          .then(() => {
            //console.log(req.body.operation)
            draft
              .updateOne(
                { DID: req.body.DID },
                { draftStatus: req.body.draftStatus }
              )
              .then(() => {
                return res.send({ message: "Draft Resolved !!!" });
              })
              .catch((err) => {
                console.log(err);
                return res
                  .status(500)
                  .send({ message: "Some Error Occurred !!!" });
              });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).send({ message: "Some Error Occurred !!!" });
          });
        break;
      case "insertBlog":
        data = blog(req.body);
        response = await data.save();
        if (response) {
          //console.log(req.body.operation)
          draft
            .updateOne(
              { DID: req.body.DID },
              { draftStatus: req.body.draftStatus, AID: response.uuid }
            )
            .then(() => {
              return res.send({ message: "Draft Resolved !!!" });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .send({ message: "Some Error Occurred !!!" });
            });
        }
        break;
      case "updateBlog":
        response = await blog.findOneAndUpdate({ _id: req.body.AID }, req.body);
        if (response) {
          // //console.log(req.body.operation)
          draft
            .updateOne(
              { DID: req.body.DID },
              { draftStatus: req.body.draftStatus }
            )
            .then(() => {
              return res.send({ message: "Draft Resolved !!!" });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .send({ message: "Some Error Occurred !!!" });
            });
        }
        break;
      case "deleteCustomer":
        response = await customer.findOneAndRemove({ CID: req.body.CID });
        console.log(req.body.operation);
        if (response) {
          draft
            .updateOne(
              { DID: req.body.DID },
              { draftStatus: req.body.draftStatus }
            )
            .then(() => {
              return res.send({ message: "Draft Resolved !!!" });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .send({ message: "Some Error Occurred !!!" });
            });
        }
        break;
      default:
        console.log("May be operation type not found.");
        break;
    }

    // return res.send("All Okay");
    // if (!data.payload) return res.sendStatus("203").send("Type not found.");
  } catch (err) {
    console.log("Error >> ", err);
    return res.status(500).send("Something went wrong !!!");
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
      // console.log(response);
      return res.send(response);
    } else {
      return res.status(203).send("D-01001");
    }
  } catch (err) {
    console.log(err);
    res.status(203).send({ message: "Some error occurred !!!" });
  }
};

// draft getting
exports.getDraft = async (req, res) => {
  try {
    // product.collection.drop();
    const params = JSON.parse(req.query.filter);
    let total = await draft.estimatedDocumentCount();
    // console.log(total);

    // console.log(params);
    // filter Section Starts

    let query = {};
    let filterArray = [];

    // if (params.title !== "")
    //   filterArray.push({
    //     product_title: { $regex: params.title, $options: "i" },
    //   });

    // if (params.SKU) filterArray.push({ SKU: params.SKU });

    // if (params.category)
    //   filterArray.push({
    //     category_name: { $regex: params.category, $options: "i" },
    //   });

    // if (params.subCategory)
    //   filterArray.push({
    //     sub_category_name: { $regex: params.subCategory, $options: "i" },
    //   });

    // // for checking the filter is free or not
    // if (filterArray.length > 0) {
    //   query = { $and: filterArray };

    //   // this is for search document count
    //   let count = await draft.aggregate([
    //     { $match: query },
    //     { $count: "Count" },
    //   ]);
    //   total = count.length > 0 ? count[0].Count : 0;
    // }

    // filter ends

    // final operation center

    const response = await draft.aggregate([
      { $match: query },
      { $sort: { _id: -1 } },
      { $skip: params.page > 0 ? (params.page - 1) * params.limit : 0 },
      { $limit: params.limit },
    ]);

    return res.send({ data: response, total: total }), { allowDiskUse: true };
  } catch (err) {
    console.log("Error>>>", err);
    return res.status(500).send("Something Went Wrong !!!");
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
    // console.log(typeof(response))
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

exports.update = async (req, res) => {
  let response = await draft.findOneAndUpdate(
    { DID: req.query.DID },
    { DID: req.query.changeTo }
  );
  res.send("Okay");
};

// ================================================= Apis for Products Ends =======================================================
