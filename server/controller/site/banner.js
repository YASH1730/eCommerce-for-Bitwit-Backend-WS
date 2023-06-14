require("dotenv").config();
const banner = require("../../../database/models/banner");
const introBanner = require("../../../database/models/introBanner");

// ================================================= Apis for banner =======================================================
//==============================================================================================================================

// this one not in use because this operation need pass action center
exports.addBanner = async (req, res) => {
  try {
    // console.log(req.files);
    // Web
    if (req.files["web_banner_image"] !== undefined)
      req.body.web_banner_image = `${process.env.Official}/${req.files["web_banner_image"][0].path}`;
    // Mobile
    if (req.files["mobile_banner_image"] !== undefined)
      req.body.mobile_banner_image = `${process.env.Official}/${req.files["mobile_banner_image"][0].path}`;
    // console.log(req.body);

    return res.send("All Okay");
  } catch (error) {
    // console.log(error);
    return res.send(500).send("Something went wrong !!!");
  }
};

// list all the banners

exports.listBanner = async (req, res) => {
  try {
    // console.log(req.query);
    const params = JSON.parse(req.query.filter);
    let total = await banner.estimatedDocumentCount();

    // console.log(params);

    // filter Section Starts

    let query = {};
    let filterArray = [];

    if (params.uuid) filterArray.push({ uuid: params.uuid });

    if (params.title)
      filterArray.push({
        banner_title: { $regex: params.title, $options: "i" },
      });

    // for checking the filter is free or not
    if (filterArray.length > 0) {
      query = { $and: filterArray };

      // this is for search document count
      let count = await banner.aggregate([
        { $match: query },
        { $count: "Count" },
      ]);
      total = count.length > 0 ? count[0].Count : 0;
    }

    // filter ends

    // final operation center

    let response = await banner.aggregate([
      { $match: query },
      { $skip: params.page > 0 ? (params.page - 1) * params.limit : 0 },
      { $limit: params.limit },
    ]);

    if (response) return res.send({ data: response, total: total });
  } catch (err) {
    // console.log("Error>>>", err);
    res.send(500);
  }
};

// for Changing the Status of the banner

exports.changeStatus = async (req, res) => {
  //// console.log(req.body)
  await banner
    .findByIdAndUpdate(
      { _id: req.body._id },
      { banner_Status: req.body.banner_Status }
    )
    .then((data) => {
      //// console.log(data)
      res.send("all okay");
    })
    .catch((err) => {
      //// console.log(err)
      res.send("Something went Wrong !!!");
    });
};

// get banner details
exports.getBannerDetails = async (req, res) => {
  try {
    // // console.log(req.query)
    if (req.query === {})
      return res.status(404).send({ message: "Please Provide the banner id." });

    let data = await banner.findOne(req.query);

    if (data) {
      return res.send(data);
    }
  } catch (err) {
    // console.log("error>>>", err);
    return res.status(500).send({ message: "Something went wrang !!!" });
  }
};

exports.getSequence = async (req, res) => {
  try {
    let data = await banner.find({}, { sequence_no: 1 });

    if (data) {
      data = data.map((row) => row.sequence_no);
      return res.send(data);
    }
  } catch (err) {
    // console.log("error>>>", err);
    return res.status(500).send({ message: "Something went wrang !!!" });
  }
};

// APIs for the mobile app banner intro 

exports.addMobileIntro = async (req, res) => {
  try {
    if (req.files["banner"] !== undefined)
    req.body.banner = `${process.env.Official}/${req.files["banner"][0].path}`;

    let data  = introBanner(req.body);
// console.log(req.body)
    data = await data.save();

    if(data)
      return res.send({
        status :200,
        message : "Banner Added successfully.",
        data
      })
    else
      return res.status(203).send({
        status :203,
        message : "Banner Added successfully.",
        data
      })

  } catch (err) {
    console.log("error>>>", err);
    return res.status(500).send({ message: "Something went wrang !!!" });
  }
};
exports.listMobileIntro = async (req, res) => {
  try {

    let data = await introBanner.find().limit(10);

    if(data)
      return res.send({
        status :200,
        message : "Intro banner for mobile fetched successfully.",
        data
      })
    else
      return res.status(203).send({
        status :203,
        message : "No banners found for mobile .",
        data
      })

  } catch (err) {
    // console.log("error>>>", err);
    return res.status(500).send({ message: "Something went wrang !!!" });
  }
};


exports.deleteIntroBanner = async (req, res) => {
  try {

      let deleteCat = await introBanner.findOneAndDelete({_id : req.query.id});

    if (deleteCat) {
      res.send({
        status: 200,
        message: "Intro banner delete successfully.",
      });
    } else {
      res.status(203).send({
        status: 203,
        message: "Error occurred in banner delete.",
      });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};



// ================================================= Apis for banner ends =======================================================
//==============================================================================================================================
