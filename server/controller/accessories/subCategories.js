const subCategories = require("../../../database/models/subCategories");
const categories = require("../../../database/models/categories");

// ================================================= Apis for sub categories =======================================================
//==============================================================================================================================

// add categoier ======================

require("dotenv").config();

exports.addSubCatagories = async (req, res) => {
  // console.log(req.body)

  if (req.files["sub_category_image"] !== undefined)
    req.body.sub_category_image = `${process.env.Official}/${req.files["sub_category_image"][0].path}`;

  const data = subCategories(req.body);
  await categories
    .findOne({ category_name: `${req.body.sub_category_name}` })
    .then(async (result) => {
      if (result === null) {
        await data
          .save()
          .then((response) => {
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
        // console.log(result);
        res.status(203);
        res.send({
          message: "Sub Category Name is already exist in category!!!",
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

exports.getSubCatagories = async (req, res) => {
  try {
    let { list } = req.query;

    if (list === "true") list = {};
    else
      list = {
        _id: 1,
        category_id: 1,
        category_name: 1,
        sub_category_name: 1,
        sub_category_status: 1,
      };

    let data = await subCategories
      .find({}, list)
      .sort({ sub_category_name: 1 });
    if (data.length > 0)
      return res.status(200).send({
        status: 200,
        message: "Sub Catagories list fetched successfully.",
        data,
      });
    else
      return res.status(200).send({
        status: 200,
        message: "Please add some sub catagories.",
        data: [],
      });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Something went wrong !!!",
      data: [],
    });
  }
};

// edit categories ======================

exports.editSubCatagories = async (req, res) => {
  // console.log(req.body);
  if (req.files["sub_category_image"] !== undefined)
    req.body.sub_category_image = `${process.env.Official}/${req.files["sub_category_image"][0].path}`;

  await subCategories
    .findOneAndUpdate({ _id: req.body._id }, req.body)
    .then((data) => {
      if (data)
        return res
          .status(200)
          .send({ message: "Sub Category  is updated successfully." });
      else return res.status(203).send({ message: "No entries found" });
    })
    .catch((error) => {
      return res.status(500).send(error);
    });
};

// delete category

exports.deleteCategory = async (req, res) => {
  // //console.log(req.query)

  await categories.deleteOne({ _id: req.query.ID }).then((data) => {
    // //console.log(data)
    res.send({ massage: "Category deleted !!!" });
  });
};

// for Changing the Status of the category

exports.changeSubStatus = async (req, res) => {
  //console.log(req.body)
  await subCategories
    .findByIdAndUpdate(
      { _id: req.body._id },
      { sub_category_status: req.body.sub_category_status }
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

// get category details

exports.getSubCategoryDetails = async (req, res) => {
  let response = await subCategories.findOne({ _id: req.query.ID });
  return res.send(response);
};

// ================================================= Apis for categories Ends =======================================================
