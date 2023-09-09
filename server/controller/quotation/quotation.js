const quotationDB = require("../../../database/models/quotation");

exports.placeQuotation = async (req, res) => {
  try {
    let images = {
      customUpholsteryImage: [],
      customDesignImage: [],
      customPolishImage: [],
    };

    if (req.files["customUpholsteryImage"] !== undefined) {
      req.files["customUpholsteryImage"].map((val) => {
        images.customUpholsteryImage.push(
          `${process.env.Official}/${val.path}`
        );
      });
    }

    if (req.files["customDesignImage"] !== undefined) {
      req.files["customDesignImage"].map((val) => {
        images.customDesignImage.push(`${process.env.Official}/${val.path}`);
      });
    }

    if (req.files["customPolishImage"] !== undefined) {
      req.files["customPolishImage"].map((val) => {
        images.customPolishImage.push(`${process.env.Official}/${val.path}`);
      });
    }

    let data = quotationDB({...images,...req.body});
    data = await data.save()

    if(data)
      return res.status(200).send({
        status: 200,
        message: "Quotation placed successfully.",
      });
    else  return res.status(200).send({
      status: 203,
      message: "Error occurred while saving the data.",
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: "Something went wrong !!!",
    });
  }
};
