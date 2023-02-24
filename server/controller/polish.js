const polish = require("../../database/models/polish");

// ================================================= Apis for sub categories =======================================================
//==============================================================================================================================

// add polish

exports.addPolish = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.files);

    let image_urls = [];

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

    // return res.send('All Okay')

    const data = polish(req.body);

    let response = await data.save();
    console.log(response);
    if (response)
      return res.send({ message: "Polish Added successfully !!!", response });

    return res.status(203).send({ message: "Duplicate polish !!!" });
  } catch (err) {
    console.log("Error >>> ", err);
    return res.status(500).send("Something Went Wrong !!!");
  }
};

// get categories ===================

exports.getPolish = async (req, res) => {
  // polish.collection.drop()
  await polish
    .find()
    .then((data) => {
      if (data) res.send(data);
      else res.send("no entries found");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

// edit categories ====================== 626cb3a9b09eb22c92f25303

exports.editPolish = async (req, res) => {
  try {
    console.log(req.body);

    let image_urls = JSON.parse(req.body.savedOutDoor);

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

    console.log(req.body);

    // return res.send('all good ')
    await polish
      .findOneAndUpdate({ _id: req.body._id }, req.body)
      .then((data) => {
        if (data)
          return res.status(200).send({
            message: "Polish is updated successfully.",
            response: req.body,
          });
        else return res.status(203).send({ message: "No entries found" });
      })
      .catch((error) => {
        return res.status(500).send(error);
      });
  } catch (err) {
    console.log(">>ERROR>> ", err);
    res.status(500).send("Something went Wrong !!!");
  }
};

// delete category

// exports.deleteCategory = async (req,res) =>{

//   // //console.log(req.query)

//    await categories.deleteOne({_id : req.query.ID}).then((data)=>{
//     // //console.log(data)
//     res.send({massage : 'Category deleted !!!'})
//   })

// }

// for Changing the Status of the category

exports.changePolishStatus = async (req, res) => {
  //console.log(req.body)
  await polish
    .findByIdAndUpdate(
      { _id: req.body._id },
      { polish_status: req.body.polish_status }
    )
    .then((data) => {
      //console.log(data)
      res.send("all okay");
    })

    .catch((err) => {
      //console.log(err)
      res.status(203).send("Something went Wrong !!!");
    });
};

// get specific polish

exports.getPolishDetails = async (req, res) => {
  let response = await polish.findOne({ _id: req.query.ID });
  console.log(response, req.query.ID);
  return res.send(response);
};

// ================================================= Apis for categories Ends =======================================================
