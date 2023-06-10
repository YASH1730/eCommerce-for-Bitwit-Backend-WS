require("dotenv").config();
const order = require("../../../database/models/order");
const coupon = require("../../../database/models/coupon");
const customer = require("../../../database/models/customer");
const product = require("../../../database/models/products");
const abandoned = require("../../../database/models/abandoned");
const operations = require("../../../database/models/product_operations");
const cp = require("../../../database/models/customProduct");
const { v4: uuidv4 } = require("uuid");
const wishlist = require("../../../database/models/wishlist");
const { count } = require("../../../database/models/order");
const warehouse = require("../../../database/models/warehouse");
// ================================================= Apis for order =======================================================
//==============================================================================================================================

// place an order

exports.placeOrder = async (req, res) => {
  try {
    // console.log(req.body);

    if (req.body.CID === null) req.body.CID = "Not Registered";

    const data = order(req.body);

    let response = await data.save();
    if (response) {
      return res.send({ message: "Order Added !!!", response });
    }
  } catch (error) {
    // console.log("Error", error);
    return res.status(500).send("Something went wrong !!!");
  }
};

// list order

exports.listOrder = async (req, res) => {
  // order.collection.drop();
  try {
    // console.log(req.query);
    const params = JSON.parse(req.query.filter);
    let total = await order.estimatedDocumentCount();

    // filter Section Starts

    let query = {};
    let filterArray = [];

    if (params.O) filterArray.push({ O: params.O });

    if (params.customer_name)
      filterArray.push({
        customer_name: { $regex: params.customer_name, $options: "i" },
      });

    if (params.customer_email)
      filterArray.push({
        customer_email: { $regex: params.customer_email, $options: "i" },
      });

    // for checking the filter is free or not
    if (filterArray.length > 0) {
      query = { $and: filterArray };

      // this is for search document count
      let count = await order.aggregate([
        { $match: query },
        { $count: "Count" },
      ]);
      total = count.length > 0 ? count[0].Count : 0;
    }

    // filter ends

    // final operation center

    await order
      .aggregate([
        { $match: query },
        { $skip: params.page > 0 ? (params.page - 1) * params.limit : 0 },
        { $limit: params.limit },
        { $sort: { order_time: -1 } },
      ])
      .then((response) => {
        if (response) {
          return res.send({ data: response, total: total });
        }
      })
      .catch((err) => {
        // console.log(err);
        return res
          .sendStatus(500)
          .send({ message: "Something went wrong !!!" });
      }),
      { allowDiskUse: true };
  } catch (err) {
    // console.log("Error>>>", err);
    res.send(500);
  }
};

//   Get last product

exports.getLastOrder = async (req, res) => {
  await order
    .find({}, { _id: 0, O: 1 })
    .sort({ _id: -1 })
    .limit(1)
    .then((response) => {
      if (response !== null) {
        //console.log(response);
        res.send(response);
      } else {
        res.status(203).send("O-01001");
      }
    })
    .catch((err) => {
      //console.log(err)
      res.status(500).send({ message: "Some error occurred !!!" });
    });
};

// get specific order

exports.searchOrder = async (req, res) => {
  await order
    .find()
    .then((response) => {
      return res.status(200).send(response);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
};

// for Changing the Status of the Order

exports.changeOrderStatus = async (req, res) => {
  //console.log(req.body)
  await order
    .findByIdAndUpdate({ _id: req.body._id }, { status: req.body.status })
    .then((data) => {
      //console.log(data)
      res.send("all okay");
    })

    .catch((err) => {
      //console.log(err)
      res.status(203).send("Something went wrong !!!");
    });
};

// Customer search list

// in mongo 1 +>>> Select felids
// in mongo 0 +>>> Deselect felids

exports.customerCatalog = async (req, res) => {
  customer
    .find(
      {},
      {
        _id: 0,
        mobile: 1,
        username: 1,
        email: 1,
        address: 1,
        city: 1,
        state: 1,
        CID: 1,
      }
    )
    .then((data) => {
      if (data !== null) {
        return res.status(200).send(data);
      }
      return res.status(203).send([]);
    })
    .catch((err) => {
      //console.log(err)
      res.status(500).send({ message: "Something Went Wrong !!!" });
    });
};

exports.deleteOrder = async (req, res) => {
  order.deleteOne(req.query).then((response) => {
    res.send(response);
  });
};

// custom order apis
exports.addCustomProduct = async (req, res) => {
  //console.log(req.files)
  try {
    if (req.files["product_image"] !== undefined) {
      req.body.product_image = req.files["product_image"].map((val) => {
        return `${process.env.Official}/${val.path}`;
      });
    }
    if (req.files["polish_image"] !== undefined) {
      req.body.polish_image = req.files["polish_image"].map((val) => {
        return `${process.env.Official}/${val.path}`;
      });
    }

    // console.log(req.body);
    let data = await cp(req.body).save();
    if (data) {
      // console.log(data)
      return res.send({ message: "Custom Product added !!!", data });
    }
  } catch (err) {
    // console.log(err);
    return res.status(500).send("Something Went Wrong");
  }
};

// get last cp

exports.getLastCp = async (req, res) => {
  await cp
    .find({}, { _id: 0, CUS: 1 })
    .sort({ _id: -1 })
    .limit(1)
    .then((response) => {
      // console.log(response)
      if (response !== null) {
        res.send(response);
      } else {
        res.status(203).send("CUS-01001");
      }
    })
    .catch((err) => {
      //console.log(err)
      res.status(500).send({ message: "Some error occurred !!!" });
    });
};

// get custom order list
exports.customOrderList = async (req, res) => {
  // order.collection.drop('order')
  await order
    .find({ $sort: { order_time: -1 }, custom_order: true })
    .then((response) => {
      return res.status(200).send(response);
    })
    .catch((err) => {
      return res.status(500);
    });
};

// // place abandoned Checkout

// exports.placeAbandonedOrder = async (req, res) => {
//   try {
//     console.log(req.body);

//     if (req.body.CID === null) req.body.CID = "Not Registered";

//     const data = order(req.body);

//     let response = await data.save();
//     if (response) {
//       return res.send({ message: "Order Added !!!", response });
//     }
//   } catch (error) {
//     console.log("Error", error);
//     return res.status(500).send("Something went wrong !!!");
//   }
// };

//  list AbandonedOrder

exports.listAbandonedOrder = async (req, res) => {
  // order.collection.drop();
  try {
    // console.log(req.query);
    const params = JSON.parse(req.query.filter);
    let total = await abandoned.estimatedDocumentCount();

    // filter Section Starts

    let query = {};
    let filterArray = [];

    if (params.uuid) filterArray.push({ uuid: params.uuid });

    if (params.customer_name)
      filterArray.push({
        customer_name: { $regex: params.customer_name, $options: "i" },
      });

    if (params.customer_email)
      filterArray.push({
        customer_email: { $regex: params.customer_email, $options: "i" },
      });

    // for checking the filter is free or not
    if (filterArray.length > 0) {
      query = { $and: filterArray };

      // this is for search document count
      let count = await abandoned.aggregate([
        { $match: query },
        { $count: "Count" },
      ]);
      total = count.length > 0 ? count[0].Count : 0;
    }

    // filter ends

    // final operation center

    await abandoned
      .aggregate([
        { $match: query },
        { $skip: params.page > 0 ? (params.page - 1) * params.limit : 0 },
        { $limit: params.limit },
      ])
      .then((response) => {
        if (response) {
          return res.send({ data: response, total: total });
        }
      })
      .catch((err) => {
        // console.log(err);
        return res
          .sendStatus(500)
          .send({ message: "Something went wrong !!!" });
      }),
      { allowDiskUse: true };
  } catch (err) {
    // console.log("Error>>>", err);
    res.send(500);
  }
};

// list wish list

exports.getWishlist = async (req, res) => {
  // wishlist.collection.drop();
  try {
    // console.log(req.query);
    const params = JSON.parse(req.query.filter);
    let total = await wishlist.estimatedDocumentCount();

    let mostLiked = await wishlist.aggregate([
      { $unwind: "$product_id" },
      { $group: { _id: "$product_id", count: { $sum: 1 } } },
      { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
      {
        $lookup: {
          from: "new_products",
          localField: "_id",
          foreignField: "SKU",
          pipeline: [
            {
              $group: {
                _id: "$_id",
                product_title: { $first: "$product_title" },
              },
            },
          ],
          as: "product",
        },
      },
      { $sort: { count: -1 } },
      { $limit: params.limit },
    ]);

    // filter Section Starts

    let query = {};
    let filterArray = [];

    if (params.CID) filterArray.push({ CID: params.CID });

    // for checking the filter is free or not
    if (filterArray.length > 0) {
      query = { $and: filterArray };

      // this is for search document count
      let count = await wishlist.aggregate([
        { $match: query },
        { $count: "Count" },
      ]);
      total = count.length > 0 ? count[0].Count : 0;
    }

    // filter ends

    // final operation center

    let response = await wishlist.aggregate([
      { $match: query },
      { $skip: params.page > 0 ? (params.page - 1) * params.limit : 0 },
      {
        $lookup: {
          from: "customers",
          localField: "CID",
          foreignField: "CID",
          pipeline: [
            {
              $group: {
                _id: "$_id",
                CID: { $first: "$CID" },
                username: { $first: "$username" },
                mobile: { $first: "$mobile" },
                email: { $first: "$email" },
              },
            },
          ],
          as: "customer",
        },
      },
      { $limit: params.limit },
    ]);

    // console.log(mostLiked);

    if (response) return res.send({ data: response, total: total, mostLiked });
  } catch (err) {
    // console.log("Error>>>", err);
    res.send(500);
  }
};

// upload image
exports.uploadImage = async (req, res) => {
  try {
    let image_urls = [];
    let design_image_urls = [];

    if (req.files["polish_image"]) {
      req.files["polish_image"].map((val) => {
        image_urls.push(`${process.env.Official}/${val.path}`);
      });
    }
    if (req.files["design_image"]) {
      req.files["design_image"].map((val) => {
        design_image_urls.push(`${process.env.Official}/${val.path}`);
      });
    }

    return res.send({ polish: image_urls, design: design_image_urls });
  } catch (error) {
    // console.log(error);
    return res.status(500).send([]);
  }
};

// upload image
exports.getDetails = async (req, res) => {
  try {
    // console.log(req.query);
    if (req.query._id === "undefined")
      return res.status(203).send("Please provide a valid ID.");

    let data = await order.findOne({ _id: req.query._id });
    let custom_product = [];
    if (data) {
      custom_product = Object.keys(data.quantity).filter((row) =>
        row.includes("CUS")
      );
      default_product = Object.keys(data.quantity).filter((row) =>
        row.includes("P")
      );
      part_product = Object.keys(data.quantity).filter((row) =>
        row.includes("P")
      );

      custom_product =
        custom_product.length > 0
          ? await Promise.all(
              custom_product.map(async (row) => {
                let data = "";
                data = await cp.findOne(
                  { CUS: row },
                  {
                    _id: 1,
                    CUS: 1,
                    product_title: 1,
                    product_image: 1,
                    selling_price: 1,
                  }
                );
                return data;
              })
            )
          : [];
      default_product =
        default_product.length > 0
          ? await Promise.all(
              default_product.map(async (row) => {
                let data = "";
                data = await product.findOne(
                  { SKU: row.split("(")[0] },
                  {
                    _id: 1,
                    SKU: 1,
                    product_title: 1,
                    product_image: 1,
                    selling_price: 1,
                  }
                );
                return data;
              })
            )
          : [];

      default_product = default_product.map((row, i) => {
        row.SKU = part_product[i];
        return row;
      });

      // console.log(data, custom_product, default_product);
      return res.send({ data, custom_product, product: default_product });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).send([]);
  }
};

// list coupon

exports.listCoupon = async (req, res) => {
  try {
    // coupon.collection.drop();
    // console.log(req.query);
    const params = JSON.parse(req.query.filter);
    let total = await coupon.estimatedDocumentCount();

    // filter Section Starts

    let query = {};
    let filterArray = [];

    if (params.O) filterArray.push({ O: params.O });

    if (params.coupon_code)
      filterArray.push({
        coupon_code: { $regex: params.coupon_code, $options: "i" },
      });

    if (params.valid_from)
      filterArray.push({
        valid_from: params.valid_from,
      });

    if (params.expiry)
      filterArray.push({
        expiry: params.expiry,
      });

    // for checking the filter is free or not
    if (filterArray.length > 0) {
      query = { $and: filterArray };

      // this is for search document count
      let count = await coupon.aggregate([
        { $match: query },
        { $count: "Count" },
      ]);
      total = count.length > 0 ? count[0].Count : 0;
    }

    // filter ends

    // final operation center

    await coupon
      .aggregate([
        { $match: query },
        { $skip: params.page > 0 ? (params.page - 1) * params.limit : 0 },
        { $limit: params.limit },
      ])
      .then((response) => {
        if (response) {
          return res.send({ data: response, total: total });
        }
      })
      .catch((err) => {
        // console.log(err);
        return res
          .sendStatus(500)
          .send({ message: "Something went wrong !!!" });
      }),
      { allowDiskUse: true };
  } catch (err) {
    // console.log("Error>>>", err);
    res.send(500);
  }
};

exports.getCouponDetails = async (req, res) => {
  try {
    let response = await coupon.findOne({ coupon_code: req.query.code });
    if (response) {
      // console.log(response);
      return res.send(response);
    }
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong." });
  }
};

exports.getOrderByID = async (req, res) => {
  try {
    let newQuantity = {}

    // console.log(req.query);
    const data = await order.findOne(
      { O: req.query.O.trim() },
      { quantity: 1, O: 1, dispatched_qty : 1 }
    );

    if (data) {
       Object.keys(data.quantity).map(row=>{
        if(data.dispatched_qty[row])
        Object.assign(newQuantity,{[row] : data.quantity[row] - data.dispatched_qty[row].quantity })
        else
        Object.assign(newQuantity,{[row] : data.quantity[row] })
       })
       data.quantity = newQuantity
      return res.send(data);
    }
    return res.status(203).send({message : "May be invalid Order ID."});
  } catch (error) {
    // console.log("Error >>> ", error);
    return res.status(500).send("Something went wrong !!!");
  }
};

// this set Order Status will update the quantity in order as well i add the SKU in manufacturing
exports.setOrderStatus = async (req, res) => {
  try {

    
    let data = operations(req.body);
    let orderProduct = await order.findOne(
      { O: req.body.O },
      { dispatched_qty: 1 }
    );

    // return res.send("ALl")

    let dispatched_qty = orderProduct.dispatched_qty;
    
    // console.log(orderProduct.dispatched_qty)
    
    // return res.send("200")
    // this update the reserved Qty for order
    if (dispatched_qty[req.body.SKU] && dispatched_qty[req.body.SKU].status === req.body.status )
      dispatched_qty = {
        ...dispatched_qty,
        [req.body.SKU]: {
          quantity: dispatched_qty[req.body.SKU].quantity + parseInt(req.body.quantity),
          status: req.body.status,
        },
      };
    else
      dispatched_qty = { ...dispatched_qty, [req.body.SKU]: {
        quantity: parseInt(req.body.quantity),
        status: req.body.status}
      };

    // now Update the last dispatched_qty to new one
    orderProduct = await order.findOneAndUpdate(
      { O: req.body.O },
      { dispatched_qty }
    );
    if (orderProduct) {
      data = await data.save();
      if (data) {
        return res.send({ message: "Status saved." });
      }
      return res.status(203).send({ message: "Some issues with payload." });
    }
    else{
      return res.status(203).send({ message: "Some issues with payload." });
    }
  } catch (error) {
    // console.log("Error >>> ", error);
    return res.status(500).send("Something went wrong !!!");
  }
};
// this set Order Status will update status of the existing SKU stages
exports.setOrderStatusToNext = async (req, res) => {
  try {

    // updating the current one
    let currentStage = await operations.findOne({_id : req.body._id},{quantity: 1});
    currentStage = await operations.findOneAndUpdate({_id : req.body._id},{quantity : currentStage.quantity - req.body.quantity})
    
    // insert the the new entry
    delete req.body._id
    let newStage = operations(req.body);
    newStage = await newStage.save()

    if(newStage){
      return res.send({message : "Entry Saved."})
    }
    return res.status(203).send({message : "Some error occurred."})
  } catch (error) {
    // console.log("Error >>> ", error);
    return res.status(500).send("Something went wrong !!!");
  }
};

exports.getStageList = async (req,res)=>{
  try {

    let data = await operations.find({},{_id : 0,status : 1,quantity : 1});

   let status = {
    "Manufacturing" : 0,
    "Manufactured" : 0,
    "Caning" : 0,
    "Polish" : 0,
    "Packing" : 0,
    "Packed" : 0,
    "Committed" : 0
   }
    
   if(data)
   {
    data.map(row=>{
      if(row.quantity > 0)
      status = {...status,[row.status] : status[row.status] + 1 }
    })
   }
   
   return res.send(status)

  } catch (error) {
    // console.log("Error >>> ", error);
    return res.status(500).send("Something went wrong !!!");
  }
}

exports.getOrderStatus = async (req, res) => {
  try {
    // console.log(req.query)

    let {status,O} = req.query;

    let data;

    if(O !== undefined)
    data = await operations.find({status});
    else
    data = await operations.find({$and : [{status},{O}]});

    // console.log(data)

      if (data) {
        return res.send(data);
      }
  } catch (error) {
    // console.log("Error >>> ", error);
    return res.status(500).send("Something went wrong !!!");
  }
};

exports.getWarehouse = async (req,res) => {
  try {

    let list = await warehouse.find({});
    if(list)
    {
      return res.send(list)
    }

    return res.send([])

  } catch (error) {
    // console.log("Error >>> ", error);
    return res.status(500).send("Something went wrong !!!");
  }
}

exports.getWarehouseDetails = async (req,res) => {
  try {

    let list = await warehouse.findOne({_id : req.query._id});
    if(list)
    {
      return res.send(list)
    }

    return res.send([])

  } catch (error) {
    // console.log("Error >>> ", error);
    return res.status(500).send("Something went wrong !!!");
  }
}

exports.searchWarehouseDetails = async (req,res) => {
  try {

    let list = await warehouse.find({ name : {$regex : `${req.query.name}`, $options : "i"}},{name : 1});
    if(list)
    {
      // console.log(list)
      return res.send(list)
    }

    return res.send([])

  } catch (error) {
    // console.log("Error >>> ", error);
    return res.status(500).send("Something went wrong !!!");
  }
}
