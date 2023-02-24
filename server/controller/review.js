const review = require("../../database/models/review");

exports.getReview = async (req, res) => {
  try {
    // console.log(req.query);

    const params = JSON.parse(req.query.filter);
    let total = await review.estimatedDocumentCount();
    let active = await review.find({ hide: true }).count();
    let hide = await review.find({ hide: false }).count();

    // filter Section Starts

    let query = {};
    let filterArray = [];

    if (params.product_id)
      filterArray.push({
        product_id: { $regex: params.product_id, $options: "i" },
      });

    // for checking the filter is free or not
    if (filterArray.length > 0) {
      query = { $and: filterArray };

      // this is for search document count
      let count = await review.aggregate([
        { $match: query },
        { $count: "Count" },
      ]);
      total = count.length > 0 ? count[0].Count : 0;
    }

    // filter ends

    // final operation center

    const response = await review.aggregate([
      { $match: query },
      { $skip: params.page > 0 ? (params.page - 1) * params.limit : 0 },
      { $limit: params.limit },
    ]);

    return (
      res.send({ data: response, total: total, active: active, hide: hide }),
      { allowDiskUse: true }
    );
  } catch (err) {
    console.log("Error >>>", err);
    return res.send(500).send({ message: "Something went wrong !!!" });
  }
};

// for Changing the Status of the review

exports.changeStatus = async (req, res) => {
  console.log(req.body);
  try {
    let response = await review.findByIdAndUpdate(
      { _id: req.body._id },
      { hide: req.body.hide }
    );

    if (response) {
      //console.log(data)
      res.send("all okay");
    }
  } catch (err) {
    //console.log(err)
    res.status(203).send("Something went wrong !!!");
  }
};

// adding reply
exports.addReply = async (req, res) => {
  try {
    console.log("body>>>", req.body);
    let reply = JSON.parse(req.body.reply);

    let old = await review.findOne({ _id: req.body._id }, { admin_reply: 1 });

    console.log(old);

    reply = [...old.admin_reply, ...reply];

    let response = await review.findOneAndUpdate(
      { _id: req.body._id },
      { admin_reply: reply }
    );

    if (response) {
      return res.send("All okay");
    }
  } catch (error) {
    console.log("Error >>>", error);
    res.status(500).send({ message: "Something Went Wrong !!!" });
  }
};

// for adding a review
exports.addReview = async (req, res) => {
  try {
    console.log("Files >>>", req.files);
    console.log("Files >>>", req.body);

    let imageURLs = [];
    let videoURLs = [];

    if (req.files["review_images"]) {
      if (req.files["review_images"].length > 0) {
        req.files["review_images"].map((file) => {
          if (file.mimetype === "video/mp4")
            return videoURLs.push(`${process.env.Official}/${file.path}`);
          return imageURLs.push(`${process.env.Official}/${file.path}`);
        });
      }
    }

    req.body.review = JSON.parse(req.body.review);

    req.body.review_images = imageURLs;
    req.body.review_videos = videoURLs;

    if (req.body.review === undefined)
      return res.sendStatus(203).send("Review Box doesn't be empty.");
    console.log("Final Body >>>", req.body);

    const data = review(req.body);
    const response = await data.save();

    if (response)
      return res.send({ message: "Review Added Successfully !!!", response });

    return res.status(203).send({ message: "Something went wrong." });
  } catch (error) {
    console.log("ERROR>>>", error);
    return res.sendStatus(500);
  }
};

exports.deleteReview = async (req, res) => {
  try {
    console.log(req.query._id);
    let response = await review.findOneAndDelete({ _id: req.query._id });

    if (response) return res.send({ message: "Review has removed !!!" });
  } catch (err) {
    console.log("Error>>>", err);
    res.status(500).send({ message: "Something went wrong !!!" });
  }
};

exports.metaReview = async (req, res) => {
  try {
    let data = {
      total: await review.estimatedDocumentCount(),
      active: await review.find({ hide: true }).count(),
      hide: await review.find({ hide: false }).count(),
    };

    return res.send(data);
  } catch (err) {
    console.log("Error>>>", err);
    res.status(500).send({ message: "Something went wrong !!!" });
  }
};
