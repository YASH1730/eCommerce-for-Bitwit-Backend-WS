require("dotenv").config();

const primaryMaterial = require("../../../database/models/primaryMaterial");

// ================================================= Apis for sub categories =======================================================
//==============================================================================================================================

// add material ======================

exports.addPrimaryMaterial = async (req, res) => {
  //console.log(req.body,req.file)
  //console.log(req.files['primaryMaterial_image'])

  if (req.files["primaryMaterial_image"] !== undefined)
    req.body.primaryMaterial_image = `${process.env.Official}/${req.files["primaryMaterial_image"][0].path}`;

  const data = primaryMaterial(req.body);

  await data
    .save()
    .then((response) => {
      res.send({ message: "Material Added Successfully !!!", response });
    })
    .catch((error) => {
      //console.log(error)
      res.status(203);
      res.send({ message: "Duplicate Value Found !!!" });
    });
};

// get categories ===================

exports.getPrimaryMaterial = async (req, res) => {
  try {

    let data = await primaryMaterial.find({},{
      primaryMaterial_name : 1,
      _id : 1
    })

    if(data.length > 0)
    return res.status(200).send({
      status : 200,
      message : "List fetched for primary materials.",
      data
    })
    else
    return res.status(200).send({
      status : 200,
      message : "Please add some data.",
      data
    })
  } catch (error) {
   return res.status(500).send({
    status : 500,
    message : "Something went wrong !!!",
    data : []
   }) 
  }
};

// edit categories ====================== 626cb3a9b09eb22c92f25303

exports.editPrimaryMaterial = async (req, res) => {
  if (req.files["primaryMaterial_image"] !== undefined)
    req.body.primaryMaterial_image = `${process.env.Official}/${req.files["primaryMaterial_image"][0].path}`;

  await primaryMaterial
    .findOneAndUpdate({ _id: req.body._id }, req.body)
    .then((data) => {
      if (data)
        return res
          .status(200)
          .send({ message: "Material is updated successfully." });
      else return res.status(203).send({ message: "No entries found" });
    })
    .catch((error) => {
      return res.status(203).send({ message: "Something Went Wrong" });
    });
};

// delete category

exports.deletePrimaryMaterial = async (req, res) => {
  // //console.log(req.query)

  await primaryMaterial.deleteOne({ _id: req.query.ID }).then((data) => {
    // //console.log(data)
    res.send({ massage: "Material deleted !!!" });
  });
};

// for Changing the Status of the category

exports.changePrimaryMaterialStatus = async (req, res) => {
  //console.log(req.body)
  await primaryMaterial
    .findByIdAndUpdate(
      { _id: req.body._id },
      { primaryMaterial_status: req.body.primaryMaterial_status }
    )
    .then((data) => {
      //console.log(data)
      res.send("all okay");
    })

    .catch((err) => {
      //console.log(err)
      res.send("Something went Wrong !!!");
    });
};

// get specific material

exports.getMaterialDetails = async (req, res) => {
  let response = await primaryMaterial.findOne({ _id: req.query.ID });
  return res.send(response);
};

// ================================================= Apis for categories Ends =======================================================
