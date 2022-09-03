const blogDB = require("../../database/models/blog");
const image = require("../../database/models/image");

const uuid = require("uuid");
const official  = 'https://woodshala.in'
// Api for card creation

exports.createBlog = async (req, res) => {
  // console.log(req.user)
  console.log(req.files)

  req.body.uuid = uuid.v4();

  if (req.files["banner_image"] === undefined)
    return res.status(203).send({ message: "Image Is Required !!!" });
  req.body.card_image = `${official}/${req.files["banner_image"][0].path}`;

  let SaveToDb = new blogDB(req.body);

  // saving data to db
  await SaveToDb.save()
    .then((data) => {
      console.log("Blog Added Successfully !!!");
      return res.send({ message: "Blog Added Successfully !!!" });
    })
    .catch((err) => {
      console.log({ massage: "Blog Not Added !!!", err });
      return res.status(203).send({ message: "Blog Not Added !!!" });
    });
};


// API for update the blog

exports.updateBlog = async (req, res) => {
  // console.log(req.user)
  console.log(req.files)

  // req.body.uuid = uuid.v4();

  if (req.files["banner_image"] !== undefined)
    req.body.card_image = `${official}/${req.files["banner_image"][0].path}`;

  await blogDB.findOneAndUpdate({_id: req.body._id},req.body)
    .then((data) => {
      console.log("Blog Update Successfully !!!");
      return res.send({ message: "Blog Update Successfully !!!" });
    })
    .catch((err) => {
      console.log({ massage: "Blog Not Update !!!", err });
      return res.status(203).send({ message: "Blog Not Update !!!" });
    });
};


// Api for card extraction for Home

exports.getBlogHome =  async(req, res) => {
  // get data from db
  await blogDB
    .find()
    .then((data) => {
      // console.log("Data fetched", data);
      if (data != null) return res.send(data);
      else return res.send({ message: "No post yet" });
    })

    .catch((err) => {
      // console.log({ massage: "No Data !!!", err });
      return res.status(203).send({ massage: "No data !!!" });
    });
};


exports.uploadImage = async (req, res) => {
  // console.log(req.files);

  if (req.files["banner_image"] === undefined)
    return res.status(203).send({ message: "Image Is Required !!!" });
  req.body.image_url = `${official}/${req.files["banner_image"][0].path}`;

  const data = image(req.body);

  await data
    .save()
    .then((data) => {
      console.log(data);
      return res.send({
        url: data.image_url,
        message: "Copy your image url !!!",
      });
    })
    .catch(() => {
      return res.status("203").send({ message: "Something Went Wrong !!!" });
    });
};

// get specific blog by uuid

exports.getBlog = async(req,res) =>{
  console.log(req.query)
  await blogDB.findOne({uuid : req.query.uuid})
  .then((data)=>{
    console.log(data)
    res.send(data)
  })
  .catch((err) => {
    console.log(err)
    return res.status("203").send({ message: "Something Went Wrong !!!" });
  });
}


// delete specific blog by uuid

exports.deleteBLog = async(req,res) =>{
  console.log(req.query)
  await blogDB.deleteOne({_id : req.query._id})
  .then((data)=>{
    res.send({message : 'Blog Deleted Successfully !!!'})
  })
  .catch((err) => {
    console.log(err)
    return res.status("203").send({ message: "Something Went Wrong !!!" });
  });
}


