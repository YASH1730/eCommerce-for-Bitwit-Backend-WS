const user = require("../../../database/models/user");
const customer = require("../../../database/models/customer");
const chat = require("../../../database/models/chat");
const client = require("../../redis/redis-config");


exports.listCustomer = async (req, res) => {
  try {
    let cusList = await customer.find({}, { username: 1, email: 1 });
    if (cusList) {
      cusList = cusList.map((row) => ({
        name: row.username,
        email: row.email,
      }));
      return res.send(cusList);
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).send("Something went wrong !!!");
  }
};
exports.listTeam = async (req, res) => {
  try {
    let team = await user.find({}, { user_name: 1, email: 1, _id: 0 });

    if (team) {
      team = await Promise.allSettled(
        team.map(async (row) => {
          let ids = await client.get(row.email);
          return { name: row.user_name, email: row.email, id: ids };
        })
      );
      team = team.map((row) => row.value);
      return res.status(200).send({
        status: 200,
        message: "List fetched successfully.",
        data: team,
      });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Something went Wrong.",
      data: [],
    });
  }
};
exports.getCustomerByEmail = async (req, res) => {
  try {
    let { email } = req.query;

    let data = await customer.find({ email });
    // console.log
    if (data) {
      return res.send({ data });
    }
    return res.status(203).send({ message: "no details found", data });
  } catch (error) {
    // console.log(error);
    return res.status(500).send("Something went wrong !!!");
  }
};

exports.getMessage = async (req, res) => {
  try {
    let { sender, receiver } = req.query;

    if (!sender || !receiver)
      return res.status(404).send({ message: "Payload is missing." });

    let data = await chat
      .find({
        $or: [
          {
            $and: [{ sender_email: sender }, { receiver_email: receiver }],
          },
          {
            $and: [{ sender_email: receiver }, { receiver_email: sender }],
          },
        ],
      })
      .sort({ time: 1 });
    if (data) return res.send({ message: data });
  } catch (error) {
    // console.log(error);
    res.status(500).send({ message: "Something Went Wrong !!!" });
  }
};


exports.uploadImageForSend = async (req,res)=>{
  try {
    // console.log(req.files)
    let {images} = req.files
    
    if(!images || images.length === 0)
    return res.send({ urls: [] });

    let image_urls = [];

    if (images) {
      images.map((val) => {
        // image_urls.push(`${process.env.Official}/${val.path}`);
        image_urls.push(`${process.env.localhost}/${val.path}`);
      });
    }

    return res.status(200).send({ status : 200, urls: image_urls });
  } catch (error) {
    console.log(error);
    return res.status(500).send({status : 500, urls: []});
  }
}
