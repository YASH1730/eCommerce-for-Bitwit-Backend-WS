require("dotenv").config();

const categories = require("../../database/models/categories");
const subCategories = require("../../database/models/subCategories");

// ================================================= Apis for categories =======================================================
//==============================================================================================================================

// add categories ======================

exports.addCatagories = async (req, res) => {
  //console.log(req.files['category_image'])

  if (req.files["category_image"] !== undefined)
    req.body.category_image = `${process.env.Official}/${req.files["category_image"][0].path}`;

  const data = categories(req.body);

  await subCategories
    .findOne({
      sub_category_name: {
        $regex: `^${req.body.category_name}`,
        $options: "i",
      },
    })
    .then(async (result) => {
      if (result === null) {
        await data
          .save()
          .then((response) => {
            //console.log(response)
            res.send({
              message: "Sub Categories Added successfully !!!",
              response,
            });
          })
          .catch((error) => {
            //console.log(error)
            res.status(203);
            res.send({ message: "Duplicate Sub Category !!!" });
          });
      } else {
        res.status(203);
        res.send({
          message: "Category Name is already exist in sub category!!!",
        });
      }
    })
    .catch((error) => {
      //console.log(error)
      res.status(203);
      res.send({ message: "Something went wrong" });
    });
};

// get categories ===================

exports.getCatagories = async (req, res) => {
  try {
    let response = await categories.find().sort({ category_name: 1 });
    if (response) res.send(response);
    else res.send("no entries found");
  } catch (error) {
    console.log(">>Error>>", error);
    res.status(500).send(error);
  }
};

// edit categories ======================

exports.editCatagories = async (req, res) => {
  //console.log(req.body);
  //console.log(req.files['category_image'])

  if (req.files["category_image"] !== undefined)
    req.body.category_image = `${process.env.Official}/${req.files["category_image"][0].path}`;

  await categories
    .findOneAndUpdate({ _id: req.body._id }, req.body)
    .then((data) => {
      if (data)
        return res
          .status(200)
          .send({ message: "Category is updated successfully." });
      else return res.status(203).send({ message: "No entries found" });
    })
    .catch((error) => {
      //console.log(error)
      return res.status(203).send({ message: "Something went wrong !!!" });
    });
};

// delete category

exports.deleteCategory = async (req, res) => {
  // //console.log(req.query)

  await categories.deleteOne({ _id: req.query.ID }).then((data) => {
    res.send({ massage: "Category deleted !!!" });
  });
};

// for Changing the Status of the category

exports.changeStatus = async (req, res) => {
  //console.log(req.body)
  await categories
    .findByIdAndUpdate(
      { _id: req.body._id },
      { category_status: req.body.category_status }
    )
    .then((data) => {
      //console.log(data)
      res.send("all okay");
    })

    .catch((err) => {
      //console.log(err)
      res.status(203).send("Something went wrong !!!");
    });
};

// list category for discount fields
exports.getCategoryList = async (req, res) => {
  try {
    if (req.query.search === undefined) return res.send([]);

    let response = await categories.aggregate([
      {
        $match: { category_name: { $regex: req.query.search, $options: "i" } },
      },
      {
        $group: {
          _id: "$_id",
          category_name: { $first: "$category_name" },
          discount_limit: { $first: "$discount_limit" },
        },
      },
      {
        $limit: 10,
      },
    ]);

    // console.log(response)

    if (response) return res.send(response);
  } catch (err) {
    console.log("error >> ", err);
    res.status(500).send("Something went wrong !!!");
  }
};

// apply discount
exports.applyDiscount = async (req, res) => {
  try {
    console.log("body >>", req.body.discount_array);
    if (req.body.discount_array.length > 0) {
      let discount = JSON.parse(req.body.discount_array);
      console.log(discount);

      let response = await Promise.all(
        discount.map(async (row) => {
          console.log(row);
          return await categories.findOneAndUpdate(
            { category_name: row.name },
            { discount_limit: parseInt(row.discount) }
          );
        })
      );

      if (response)
        return res.send({ message: "Discount Applied Successfully !!!" });
    } else {
      return res
        .status(203)
        .send({ message: "Please select some categories first." });
    }
  } catch (error) {
    console.log(">> error >>", error);
    res.status(500).send("Something Went Wrong !!!");
  }
};

// get category details

exports.getCategoryDetails = async (req, res) => {
  let response = await categories.findOne({ _id: req.query.ID });
  return res.send(response);
};

// ================================================= Apis for categories Ends =======================================================
