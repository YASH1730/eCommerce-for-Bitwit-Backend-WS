const stock = require("../../database/models/stock");
const inward = require("../../database/models/Inward");
const outward = require("../../database/models/outward");
const product = require("../../database/models/products");
const transfer = require("../../database/models/transfer");
const uuid = require("uuid");

// ============================ APIs for Stock ======================================

// exports.addStock = async(req,res)=>{

//     //console.log(req.body);

//     // this will check the row is exist or if yes then update it or insert it on not
//     await stock.findOneAndUpdate({product_id : req.body.product_id, warehouse : req.body.warehouse  },req.body,{upsert : true})
//     .then((response)=>{
//         //console.log(response)
//       return  res.send({message : 'Stock Added !!!',response})
//     })
//     .catch((err)=>{
//         //console.log(err)
//        return res.status(404).send('Something Went Wrong !!!')
//     })

// }
// exports.updateStock = async(req,res)=>{

//     //console.log(req.body);

//     // this will check the row is exist or if yes then update it or insert it on not
//     await stock.findOneAndUpdate({product_id : req.body.product_id, warehouse : req.body.warehouse  },req.body,{upsert : true})
//     .then((response)=>{
//         //console.log(response)
//       return  res.send({message : 'Stock Updated Successfully !!!'})
//     })
//     .catch((err)=>{
//         //console.log(err)
//        return res.status(404).send('Something Went Wrong !!!')
//     })

// }

// exports.listStock = async (req,res)=>{

//         await stock.find()
//         .then((response)=>{
//             res.send(response)
//         })
//         .catch((err)=>{
//             res.status(404).send({message : 'Something went wrong !!!'})
//         })

// }

// exports.deleteStock = async (req,res)=>{

//         await stock.deleteOne(req.query)
//         .then((response)=>{
//             //console.log(response)
//             if (response.deletedCount > 0)
//                 return res.send({message : 'Stock Deleted !!!'})
//             else
//             return res.status(404).send({message : 'Something Went Wrong !!!'})

//         })
//         .catch((err)=>{
//             res.status(404).send({message : 'Something went wrong !!!'})
//         })

// }

// //  for product preview before adding

// exports.preview = async (req,res)=>{

//     product.findOne(req.query,{
//            _id : 0,
//             SKU : 1,
//             product_title : 1,
//             category_name : 1,
//             seo_title : 1,
//             featured_image : 1,
//             primary_material : 1,
//             length_main : 1,
//             breadth : 1,
//             height : 1,
//             MRP : 1,
//             selling_price : 1,
//             showroom_price : 1,
//             discount_limit : 1,
//             COD : 1,
//             returnable : 1,
//             show_on_mobile : 1,
//             range : 1,
//     })
//     .then((response)=>{
//         console.log(response)
//         if (response)
//         return res.send(response);

//         return res.send({message : 'No product found !!!'})
//     })
//     .catch((err)=>{
//         //console.log(err);
//         res.status(500).send('Something Went Wrong !!!')
//     })

// }

// ========================= Inward ===================

exports.addInward = async (req, res) => {
  try {
    req.body.inward_id = uuid.v4();
    req.body.order_no = uuid.v4();
    req.body.product_articles = JSON.parse(req.body.product_articles);
    req.body.hardware_articles = JSON.parse(req.body.hardware_articles);

    // this will check the row is exist or if yes then update or insert it or insert it on not

    // ============== For Product ===================
    if (req.body.product_articles.length > 0) {
      // this loop is for creating new entries
      let newData = req.body.product_articles.map((row) => {
        let key = Object.keys(row)[0];
        return {
          product_id: key,
          stock: row[key],
          warehouse: req.body.warehouse,
        };
      });

      // this will insert all updated product entires into Stock collection
      await Promise.all(
        newData.map(async (row) => {
          let response = await stock.findOne({
            $and: [
              { product_id: row.product_id },
              { warehouse: req.body.warehouse },
            ],
          });

          if (response)
            row.stock = parseInt(row.stock) + parseInt(response.stock);

          // console.log(">>>", row);

          return stock.findOneAndUpdate(
            { product_id: row.product_id, warehouse: row.warehouse },
            row,
            { upsert: true }
          );
        })
      )
        .then(() => console.log(""))
        .catch((err) => {
          console.log(err);
        });
    }

    // ============== For Hardware ===================
    if (req.body.hardware_articles.length > 0) {
      // this loop is for creating new entries
      let newData = req.body.hardware_articles.map((row) => {
        let key = Object.keys(row)[0];
        return {
          product_id: key,
          stock: row[key],
          warehouse: req.body.warehouse,
        };
      });

      // this will insert all updated hardware entires into Stock collection
      await Promise.all(
        newData.map(async (row) => {
          let response = await stock.findOne({
            $and: [
              { product_id: row.product_id },
              { warehouse: req.body.warehouse },
            ],
          });

          if (response)
            row.stock = parseInt(row.stock) + parseInt(response.stock);

          // console.log(">>>", row);

          return stock.findOneAndUpdate(
            { product_id: row.product_id, warehouse: row.warehouse },
            row,
            { upsert: true }
          );
        })
      )
        .then(() => console.log(""))
        .catch((err) => {
          console.log(err);
        });
    }

    // final inward entries
    // console.log(req.body);

    let data = inward(req.body);
    data = await data.save();
    if (data)
      return res.send({ message: "Inward Entries added !!!", response: data });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500).send({ message: "Something went wrong !!!" });
  }
};

// ======================== Outward ==============

exports.addOutward = async (req, res) => {
  try {
    console.log(req.body);
    req.body.outward_id = uuid.v4();
    req.body.order_no = uuid.v4();
    req.body.product_articles = JSON.parse(req.body.product_articles);
    req.body.hardware_articles = JSON.parse(req.body.hardware_articles);

    // this will check the row is exist or if yes then update or insert it or insert it on not

    // ============== For Product =================
    if (req.body.product_articles.length > 0) {
      // this loop is for creating new entries
      let newData = req.body.product_articles.map((row) => {
        let key = Object.keys(row)[0];
        return {
          product_id: key.trim(),
          stock: row[key],
          warehouse: req.body.warehouse,
        };
      });

      // this will insert all updated product entires into Stock collection
      await Promise.all(
        newData.map(async (row) => {
          let response = await stock.findOne({
            $and: [
              { product_id: row.product_id },
              { warehouse: req.body.warehouse },
            ],
          });

          if (response)
            row.stock = Math.abs(
              parseInt(row.stock) - parseInt(response.stock)
            );

          // console.log(">>>", row);

          return stock.findOneAndUpdate(
            { product_id: row.product_id, warehouse: row.warehouse },
            row,
            { upsert: true }
          );
        })
      )
        .then(() => console.log(""))
        .catch((err) => {
          console.log(err);
        });
    }

    // ============== For Hardware ===================
    if (req.body.hardware_articles.length > 0) {
      // this loop is for creating new entries
      let newData = req.body.hardware_articles.map((row) => {
        let key = Object.keys(row)[0];
        return {
          product_id: key.trim(),
          stock: row[key],
          warehouse: req.body.warehouse,
        };
      });

      // this will insert all updated hardware entires into Stock collection
      await Promise.all(
        newData.map(async (row) => {
          let response = await stock.findOne({
            $and: [
              { product_id: row.product_id },
              { warehouse: req.body.warehouse },
            ],
          });

          if (response)
            row.stock = Math.abs(
              parseInt(row.stock) - parseInt(response.stock)
            );

          return stock.findOneAndUpdate(
            { product_id: row.product_id, warehouse: row.warehouse },
            row,
            { upsert: true }
          );
        })
      )
        .then(() => console.log(""))
        .catch((err) => {
          console.log(err);
        });
    }

    // console.log(req.body);

    let data = outward(req.body);
    data = await data.save();

    if (data)
      return res.send({ message: "Outward Entries added !!!", response: data });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500).send({ message: "Something went wrong !!!" });
  }
};

// ========================= Transfer ============
exports.addTransfer = async (req, res) => {
  try {
    req.body.transfer_id = uuid.v4();
    req.body.order_no = uuid.v4();
    req.body.product_articles = JSON.parse(req.body.product_articles);
    req.body.hardware_articles = JSON.parse(req.body.hardware_articles);

    // this will check the row is exist or if yes then update or insert it or insert it on not

    // ============== For Product =================
    if (req.body.product_articles.length > 0) {
      // this loop is for creating new entries
      let newData = req.body.product_articles.map((row) => {
        let key = Object.keys(row)[0];
        return {
          product_id: key.trim(),
          stock: row[key],
          warehouse: req.body.warehouse,
        };
      });

      // this will insert all updated product entires into Stock collection
      // from warehouse
      await Promise.all(
        newData.map(async (row) => {
          let response_sub = await stock.findOne({
            $and: [
              { product_id: row.product_id },
              { warehouse: req.body.warehouse },
            ],
          });

          let updated = {};
          if (response_sub) {
            updated = {
              product_id: row.product_id,
              stock: Math.abs(
                parseInt(row.stock) - parseInt(response_sub.stock)
              ),
              warehouse: req.body.warehouse,
            };
          }

          return stock.findOneAndUpdate(
            { product_id: row.product_id, warehouse: req.body.warehouse },
            updated,
            { upsert: true }
          );
        })
      )
        .then(() => console.log(""))
        .catch((err) => {
          console.log(err);
        });

      // to warehouse

      await Promise.all(
        newData.map(async (row) => {
          let response_add = await stock.findOne({
            $and: [
              { product_id: row.product_id },
              { warehouse: req.body.warehouse_to },
            ],
          });

          const entryTo = row;
          entryTo.warehouse = req.body.warehouse_to;

          if (response_add)
            entryTo.stock = Math.abs(
              parseInt(row.stock) + parseInt(response_add.stock)
            );

          return stock.findOneAndUpdate(
            { product_id: row.product_id, warehouse: req.body.warehouse_to },
            entryTo,
            { upsert: true }
          );
        })
      )
        .then(() => console.log(""))
        .catch((err) => {
          console.log(err);
        });
    }

    // ============== For Hardware ===================
    if (req.body.hardware_articles.length > 0) {
      // this loop is for creating new entries
      let newData = req.body.hardware_articles.map((row) => {
        let key = Object.keys(row)[0];
        return {
          product_id: key.trim(),
          stock: row[key],
          warehouse: req.body.warehouse,
        };
      });

      // this will insert all updated hardware entires into Stock collection
      await Promise.all(
        newData.map(async (row) => {
          let response_sub = await stock.findOne({
            $and: [
              { product_id: row.product_id },
              { warehouse: req.body.warehouse },
            ],
          });

          // if (response_sub) row.stock = Math.abs(parseInt(row.stock) - parseInt(response_sub.stock));
          let updated = {};
          if (response_sub) {
            updated = {
              product_id: row.product_id,
              stock: Math.abs(
                parseInt(row.stock) - parseInt(response_sub.stock)
              ),
              warehouse: req.body.warehouse,
            };
          }

          return stock.findOneAndUpdate(
            { product_id: row.product_id, warehouse: req.body.warehouse },
            updated,
            { upsert: true }
          );
        })
      )
        .then(() => console.log(""))
        .catch((err) => {
          console.log(err);
        });

      // this will insert all updated hardware entires into Stock collection
      await Promise.all(
        newData.map(async (row) => {
          let response_add = await stock.findOne({
            $and: [
              { product_id: row.product_id },
              { warehouse: req.body.warehouse_to },
            ],
          });

          const entryTo = row;
          entryTo.warehouse = req.body.warehouse_to;

          if (response_add)
            entryTo.stock = Math.abs(
              parseInt(row.stock) + parseInt(response_add.stock)
            );

          return stock.findOneAndUpdate(
            { product_id: row.product_id, warehouse: req.body.warehouse_to },
            entryTo,
            { upsert: true }
          );
        })
      )
        .then(() => console.log(""))
        .catch((err) => {
          console.log(err);
        });
    }

    // console.log(req.body);

    let data = transfer(req.body);
    data = await data.save();
    // console.log(data);

    if (data)
      return res.send({
        message: "Transfer Entries added !!!",
        response: data,
      });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500).send({ message: "Something went wrong !!!" });
  }
};

// list all entries
exports.listEntires = async (req, res) => {
  try {
    // inward.collection.drop();
    // outward.collection.drop();
    // stock.collection.drop();
    // transfer.collection.drop();
    const params = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50,
      type: req.query.type,
    };

    let data = "";
    let total = "";
    switch (params.type) {
      case "Inward":
        total = await inward.estimatedDocumentCount();
        data = await inward
          .find({})
          .skip(params.page > 0 ? (params.page - 1) * params.limit : 0)
          .limit(params.limit);
        if (data) return res.send({ data, total });
        break;
      case "Outward":
        total = await outward.estimatedDocumentCount();
        data = await outward
          .find({})
          .skip(params.page > 0 ? (params.page - 1) * params.limit : 0)
          .limit(params.limit);
        if (data) return res.send({ data, total });
        break;
      case "Transfer":
        total = await transfer.estimatedDocumentCount();
        data = await transfer
          .find({})
          .skip(params.page > 0 ? (params.page - 1) * params.limit : 0)
          .limit(params.limit);
        if (data) return res.send({ data, total });
        break;
      case "Stock":
        total = await stock.estimatedDocumentCount();
        data = await stock
          .find({})
          .skip(params.page > 0 ? (params.page - 1) * params.limit : 0)
          .limit(params.limit);
        if (data) return res.send({ data, total });
        break;
      default:
        return res.send({ data: [], total: 0 });
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(500).send({ message: "Something went wrong !!!" });
  }
};

// total entires
exports.totalEntries = async (req, res) => {
  try {
    let data = {};
    data.inward = await inward.estimatedDocumentCount();
    data.outward = await outward.estimatedDocumentCount();
    data.transfer = await transfer.estimatedDocumentCount();
    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

// get SKU of list for inward for outward entries
exports.getStockSKU = async (req, res) => {
  try {
    // console.log(req.query);

    let P_SKU = [];
    let H_SKU = [];

    if (req.query.warehouse === undefined || req.query.search === undefined)
      return res.send({ P_SKU, H_SKU });
    if (req.query.warehouse === "" || req.query.search === "")
      return res.send({ P_SKU, H_SKU });

    const response = await stock.aggregate([
      {
        $match: {
          $and: [
            { warehouse: req.query.warehouse },
            { product_id: { $regex: req.query.search, $options: "i" } },
          ],
        },
      },

      {
        $group: {
          _id: "$_id",
          product_id: { $first: "$product_id" },
          stock: { $first: "$stock" },
        },
      },
      { $limit: 10 },
    ]);

    if (response) {
      if (req.query.search.split("")[0].toUpperCase() === "P") P_SKU = response;
      else if (req.query.search.split("")[0].toUpperCase() === "H")
        H_SKU = response;
    }

    res.send({ P_SKU, H_SKU });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something Went Wrong !!!");
  }
};
