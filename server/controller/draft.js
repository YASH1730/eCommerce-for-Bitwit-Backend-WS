require("dotenv").config();
const draft = require("../../database/models/draft");
const product = require("../../database/models/products");
const hardware = require("../../database/models/hardware");
const { v4: uuid } = require("uuid");

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
    // console.log(req.files);

    // console.log(req.body);

    // global var for switch case
    let image_urls = [];

    // selection stage
    switch (req.body.operation) {
      case "insertProduct":
        let Product_image_urls = [];

        if (req.files["product_image"] !== undefined) {
          req.files["product_image"].map((val) => {
            Product_image_urls.push(`${process.env.Official}/${val.path}`);
          });
        }

        req.body.primary_material = req.body.primary_material.split(",");
        req.body.polish = req.body.polish.split(",");
        req.body.warehouse = req.body.warehouse.split(",");

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

        req.body.selling_points = JSON.parse(req.body.selling_points);

        // ACIN number for variations
        req.body.ACIN = uuid();

        data.message = "Alert : New Product adding request.";

        data.payload = req.body;

        break;
      case "updateProduct":
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

        console.log(req.body);
        data.message = `Alert : Hardware ${req.body.SKU} updating request.`;
        data.payload = req.body;
        break;
      case "deleteHardware":
        let id = await draft
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

      //  await hardware.deleteOne(req.query); // deleting article
      default:
        console.log("May be operation type not found.");
    }

    if (!data.payload) return res.sendStatus("203").send("Type not found.");

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
      default:
        console.log("May be operation type not found.");
        break;
    }

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
      console.log(response);
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
