const pincode = require("../../../database/models/pincode");
const COD = require("../../../database/models/COD");
const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const products = require("../../../database/models/products");
const uuid = require("uuid");
const customer = require("../../../database/models/customer");

exports.uploadPincodeCSV = async (req, res) => {
  try {
    if (req.files["COD_File"] === undefined)
      return res.status(400).send({
        message: "Please select or formate the file in correct manner.",
      });
    let data = [];
    await fs
      .createReadStream(
        path.resolve(
          __dirname,
          "../../../upload",
          req.files["COD_File"][0].path.split("/")[1]
        )
      )
      .pipe(csv.parse({ headers: true }))
      .on("data", (row) => {
        console.log(row)
        data.push(row);
      })
      .on("error", (err) => {
        // console.log((err) => // console.log(err));
        return res
          .status(202)
          .send({ message: "File doesn't formatted in right scheme !!!" });
      })
      .on("end", async (rowCount) => {
        // promise to save data
        let response = await Promise.all(
          data.map((row) => {
            // console.log(row)
            let formateData = {
              pincode: row.pincode || row.Pincode || row.pin_code || 0,
              delivery_status: (row.Status && row.Status.toLowerCase() === 'true') ? true : false ,
            };
            return pincode.findOneAndUpdate(
              { pincode: formateData.pincode },
              formateData,
              { upsert: true }
            );
          })
        );
        // promise ends
        if (response)
          return res.send({ message: "CSV File Uploaded Successfully !!!" });
      });
  } catch (err) {
    console.log("Error >> ", err);
    res.status(500).send({ message: "Something went wrong !!!" });
  }
};

exports.listPinCode = async (req, res) => {
  try {
    // product.collection.drop()
    // console.log(req.query);

    const params = JSON.parse(req.query.filter);
    let total = await pincode.estimatedDocumentCount();

    let query = {};
    let filterArray = [];

    if (params.pincode !== "")
      filterArray.push({ pincode: parseInt(params.pincode) });

    // for checking the filter is free or not
    if (filterArray.length > 0) {
      query = { $and: filterArray };

      // this is for search document count
      let count = await pincode.aggregate([
        { $match: query },
        { $count: "Count" },
      ]);
      total = count.length > 0 ? count[0].Count : 0;
    }

    // final operation center

    const response = await pincode.aggregate([
      { $match: query },
      { $skip: params.page > 0 ? (params.page - 1) * params.limit : 0 },
      { $limit: params.limit },
    ]);

    return res.send({ data: response, total: total }), { allowDiskUse: true };
  } catch (err) {
    // console.log("Error>>>", err);
    return res.status(500).send("Something Went Wrong !!!");
  }
};

exports.statusDelivery = async (req, res) => {
  try {
    // console.log(req.body);
    let response = await pincode.findByIdAndUpdate(
      { _id: req.body._id },
      { delivery_status: req.body.delivery_status }
    );

    if (response) res.send({ message: "Delivery Status Updated !!!" });
  } catch (err) {
    // console.log(">>Error>>", err);
    res.status(500).send({ message: "Something went wrong !!!" });
  }
};

// delete category

exports.deletePincode = async (req, res) => {
  try {
    // console.log(req.query)
    let data = await pincode.deleteOne({ _id: req.query.ID });
    if (data) return res.send({ massage: "Pincode deleted !!!" });
  } catch (err) {
    // console.log(err);
    res.status(500).send({ message: "Something went wrong !!!" });
  }
};

exports.downloadCSV = async (req, res) => {
  try {
    let fileName = "currentCSV.csv";
    res.download(`upload/${fileName}`, `${fileName}`);
  } catch (err) {
    // console.log(err);
    res.status(500).send({ message: "Something went wrong !!!" });
  }
};

exports.getCod = async (req, res) => {
  try {
    // COD.collection.drop()
    let response = await COD.find();
    res.send(response[0]);
  } catch (err) {
    // console.log(err);
    res.status(500).send({ message: "Something went wrong !!!" });
  }
}



exports.uploadProduct = async (req, res) => {
  try {
    
    let data = [];
    await fs
      .createReadStream(
        path.resolve(
          __dirname,
          "../../../data",
          "product_data.csv"
        )
      )
      .pipe(csv.parse({ headers: true }))
      .on("data", (row) => {
        console.log(row)
        data.push(row);
      })
      .on("error", (err) => {
        // console.log((err) => // console.log(err));
        return res
          .status(202)
          .send({ message: "File doesn't formatted in right scheme !!!" });
      })
      .on("end", async (rowCount) => {
        // promise to save data
        let response = await Promise.all(
          data.map((row) => {


            if(row.Material2 = "" && row.Material !== '' )
            row.primary_material = [row.Material,row.Material2]
            else if(row.Material !== '')
            row.primary_material = [row.Material]
            else
            row.primary_material = []

            row.primary_material_name = row.Material + ","+ row.Material
            // ACIN number for variations
            row.ACIN = uuid.v4();

            // convert to integer
            row.selling_price = row.selling_price ? parseInt(row.selling_price) : 0
            row.MRP = row.MRP ? parseInt(row.MRP) : 0
            row.length_main = row.length_main ? parseInt(row.length_main) : 0
            row.breadth = row.breadth ? parseInt(row.breadth) : 0
            row.height = row.height ? parseInt(row.height) : 0
            row.status = true


            return products.findOneAndUpdate(
              { SKU: row.SKU },
              row,
              { upsert: true }
            );
          })
        );
        // promise ends
        if (response)
          return res.send({ message: "CSV File Uploaded Successfully !!!" });
      });
  } catch (err) {
    console.log("Error >> ", err);
    res.status(500).send({ message: "Something went wrong !!!" });
  }
};

// exports.uploadCustomer = async (req, res) => {
//   try {
    
//     let data = [];
//     await fs
//       .createReadStream(
//         path.resolve(
//           __dirname,
//           "../../../data",
//           "Customer_Data.csv"
//         )
//       )
//       .pipe(csv.parse({ headers: true }))
//       .on("data", (row) => {
//         // console.log(row)
//         data.push(row);
//       })
//       .on("error", (err) => {
//         // console.log((err) => // console.log(err));
//         return res
//           .status(202)
//           .send({ message: "File doesn't formatted in right scheme !!!" });
//       })
//       .on("end", async (rowCount) => {
//         // promise to save data
//         let response = await Promise.all(
//           data.map((row) => {

//             if(row.email && row.email !== undefined )
// {
//             row.CID =  `CID-${uuid.v4()}`;

//             if(row.name1 !== "" && row.name2 !== '' )
//             row.username = row.name1 +" "+ row.name2
//             else if(row.name1 !== '')
//             row.username = row.name1 
//             else
//             row.username = ""

//             if (row.mobile) row.mobile = parseInt(row.mobile.split("+91")[1])
//             else delete row.mobile  

//             delete row.name1
//             delete row.name2

//             console.log(row)

//             return customer.findOneAndUpdate(
//               { CID: row.CID },
//               row,
//               { upsert: true }
//             );
// }
// else {
// // console.log("empty",row.email)
//   return 1;
// }
//           })
//         );
//         // promise ends
//         if (response)
//           return res.send({ message: "CSV File Uploaded Successfully !!!" });
//       });
//   } catch (err) {
//     console.log("Error >> ", err);
//     res.status(500).send({ message: "Something went wrong !!!" });
//   }
// };

