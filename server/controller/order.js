require("dotenv").config();
const order = require("../../database/models/order");
const customer = require("../../database/models/customer");
const product = require("../../database/models/products");
const abandoned = require("../../database/models/abandoned");
const cp = require("../../database/models/customProduct");
const { v4: uuidv4 } = require("uuid");
const wishlist = require("../../database/models/wishlist");
// ================================================= Apis for order =======================================================
//==============================================================================================================================

// place an order

exports.placeOrder = async (req, res) => {
  try {
    console.log(req.body);

    if (req.body.CID === null) req.body.CID = "Not Registered";

    const data = order(req.body);

    let response = await data.save();
    if (response) {
      return res.send({ message: "Order Added !!!", response });
    }
  } catch (error) {
    console.log("Error", error);
    return res.status(500).send("Something went wrong !!!");
  }
};

// list order

exports.listOrder = async (req, res) => {
  // order.collection.drop();
  try {
    console.log(req.query);
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
      ])
      .then((response) => {
        if (response) {
          return res.send({ data: response, total: total });
        }
      })
      .catch((err) => {
        console.log(err);
        return res
          .sendStatus(500)
          .send({ message: "Something went wrong !!!" });
      }),
      { allowDiskUse: true };
  } catch (err) {
    console.log("Error>>>", err);
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

    console.log(req.body);
    let data = await cp(req.body).save()
    if (data) {
      // console.log(data)
      return res.send({ message: "Custom Product added !!!", data });
    }
  }
  catch (err) {
    console.log(err);
    return res.status(500).send("Something Went Wrong");
  };
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
    console.log(req.query);
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
        console.log(err);
        return res
          .sendStatus(500)
          .send({ message: "Something went wrong !!!" });
      }),
      { allowDiskUse: true };
  } catch (err) {
    console.log("Error>>>", err);
    res.send(500);
  }
};

// list wish list

exports.getWishlist = async (req, res) => {
  // wishlist.collection.drop();
  try {
    console.log(req.query);
    const params = JSON.parse(req.query.filter);
    let total = await wishlist.estimatedDocumentCount();

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
          as: "customer",
        },
      },
      { $limit: params.limit },
    ]);

    if (response) return res.send({ data: response, total: total });
  } catch (err) {
    console.log("Error>>>", err);
    res.send(500);
  }
};


// upload image 
exports.uploadImage = async (req, res) => {
  try {
    let image_urls = []
    let design_image_urls = []


    if (req.files['polish_image']) {
      req.files["polish_image"].map((val) => {
        image_urls.push(`${process.env.Official}/${val.path}`);
      });
    }
    if (req.files['design_image']) {
      req.files["design_image"].map((val) => {
        design_image_urls.push(`${process.env.Official}/${val.path}`);
      });
    }

    return res.send({ polish: image_urls, design: design_image_urls })

  } catch (error) {
    console.log(error)
    return res.status(500).send([])
  }
}

// upload image 
exports.getDetails = async (req, res) => {
  try {

    console.log(req.query)
    if (req.query._id === 'undefined') return res.status(203).send('Please provide a valid ID.')

    let data = await order.findOne({ _id: req.query._id });
    let custom_product = [];
    if (data) {

      custom_product = Object.keys(data.quantity).filter(row => row.includes('CUS'))
      default_product = Object.keys(data.quantity).filter(row => row.includes('P'))

      custom_product = custom_product.length > 0 ? await Promise.all(custom_product.map(async row => {
        let data = '';
        data = await cp.findOne({ CUS: row }, {
          _id: 1,
          CUS: 1,
          product_title: 1,
          product_image: 1,
          selling_price: 1,
        })
        return data
      })) : []
      default_product = default_product.length > 0 ? await Promise.all(default_product.map(async row => {
        let data = '';
        data = await product.findOne({ SKU: row }, {
          _id: 1,
          SKU: 1,
          product_title: 1,
          product_image: 1,
          selling_price: 1,
        })
        return data
      })): []


      console.log(data, custom_product, default_product)
      return res.send({ data, custom_product, product : default_product })

    }
  } catch (error) {
    console.log(error)
    return res.status(500).send([])
  }
}