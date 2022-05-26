const blogDB = require("../../database/models/blog");
const image = require("../../database/models/image");

const uuid = require("uuid");

// Api for card creation

exports.createBlog = (req, res) => {
  // console.log(req.user)
  console.log(req.files)

  req.body.uuid = uuid.v4();

  if (req.files["banner_image"] === undefined)
    return res.status(203).send({ message: "Image Is Required !!!" });
  req.body.card_image = `${localBaseUrl}/${req.files["banner_image"][0].path}`;

  let SaveToDb = new blogDB(req.body);

  // saving data to db
  SaveToDb.save()
    .then((data) => {
      console.log("Blog Added Successfully !!!");
      return res.send({ message: "Blog Added Successfully !!!" });
    })
    .catch((err) => {
      console.log({ massage: "Blog Not Added !!!", err });
      return res.status(203).send({ message: "Blog Not Added !!!" });
    });
};


// Api for card extraction for Home

exports.getBlogHome = (req, res) => {
  // get data from db
  blogDB
    .find()
    .then((data) => {
      console.log("Data fetched", data);
      if (data != null) return res.send(data);
      else return res.send({ message: "No post yet" });
    })

    .catch((err) => {
      console.log({ massage: "No Data !!!", err });
      return res.status(203).send({ massage: "No data !!!" });
    });
};

// upload image

const localBaseUrl = "http://localhost:8000";

exports.uploadImage = (req, res) => {
  // console.log(req.files);

  if (req.files["banner_image"] === undefined)
    return res.status(203).send({ message: "Image Is Required !!!" });
  req.body.image_url = `${localBaseUrl}/${req.files["banner_image"][0].path}`;

  const data = image(req.body);

  data
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
