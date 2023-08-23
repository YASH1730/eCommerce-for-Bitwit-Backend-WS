require("dotenv").config();
const product = require("../../../database/models/products");
const hardware = require("../../../database/models/hardware");
const polish = require("../../../database/models/polish");
const catalog = require("../../../database/models/catalog");
const { match } = require("assert");
const purchase_order = require("../../../database/models/purchase_order");
const { randomUUID } = require("crypto");
const uuid = require('uuid')

// ================================================= Apis for Products =======================================================
//==============================================================================================================================

// Add Products this function is not is use

exports.addProduct = async(req, res) => {
    //// console.log('files>>>',req.files);
    // //// console.log(req.body);

    let image_urls = [];

    if (req.files["product_image"] !== undefined) {
        req.files["product_image"].map((val) => {
            image_urls.push(`${process.env.Official}/${val.path}`);
        });
    }

    req.body.product_image = image_urls;

    req.body.featured_image = req.files["featured_image"] ?
        `${process.env.Official}/${req.files["featured_image"][0].path}` :
        "";

    req.body.specification_image = req.files["specification_image"] ?
        `${process.env.Official}/${req.files["specification_image"][0].path}` :
        "";

    req.body.mannequin_image = req.files["mannequin_image"] ?
        `${process.env.Official}/${req.files["mannequin_image"][0].path}` :
        "";

    req.body.selling_points = JSON.parse(req.body.selling_points);

    //// console.log('Complete>>>',req.body);

    // return res.send('all okay')

    const data = product(req.body);

    await data
        .save()
        .then((response) => {
            ////// console.log(response)
            res.send({ message: "Product added successfully !!!", response });
        })
        .catch((err) => {
            // console.log(err);
            res.status(203).send({ message: "Some error occurred !!!" });
        });
};

// Get Product List

exports.getListProduct = async(req, res) => {
    try {
        // product.collection.drop();
        //  // console.log(req.query)
        const params = JSON.parse(req.query.filter);
        let total = await product.estimatedDocumentCount();

        // filter Section Starts

        let query = {};
        let filterArray = [];

        if (params.title !== "")
            filterArray.push({
                product_title: { $regex: params.title, $options: "i" },
            });

        if (params.SKU) filterArray.push({ SKU: params.SKU.toUpperCase() });

        if (params.category)
            filterArray.push({
                category_name: { $regex: params.category, $options: "i" },
            });

        if (params.subCategory)
            filterArray.push({
                sub_category_name: { $regex: params.subCategory, $options: "i" },
            });

        // for checking the filter is free or not
        if (filterArray.length > 0) {
            query = { $and: filterArray };

            // this is for search document count
            let count = await product.aggregate([
                { $match: query },
                { $count: "Count" },
            ]);
            total = count.length > 0 ? count[0].Count : 0;
        }

        // final operation center

        const response = await product.aggregate([
            { $match: query },
            { $skip: params.page > 0 ? (params.page - 1) * params.limit : 0 },
            { $limit: params.limit },
        ]);

        return res.send({ data: response, total: total }), { allowDiskUse: true };
    } catch (err) {
        // console.log("Error>>>", err);
        return res.status(500).send("Something Went Wrong !!!");
    }
};

//   Get last product

exports.getLastProduct = async(req, res) => {
    await product
        .find({}, { _id: 0, SKU: 1 })
        .sort({ _id: -1 })
        .limit(1)
        .then((response) => {
            if (response !== null) {
                // // console.log(">>>", response);
                res.send(response);
            } else {
                res.status(203).send("P-01001");
            }
        })
        .catch((err) => {
            //  ////// console.log(err)
            res.status(203).send({ message: "Some error occurred !!!" });
        });
};

// delete products

exports.deleteProduct = async(req, res) => {
    try {
        let { ID } = req.query;

        if (!ID)
            return res.status(203).send({
                status: 203,
                message: "Please provide the product ID !!!",
            });

        let check = await product.deleteOne({ _id: ID });

        if (check)
            return res.status(200).send({
                status: 200,
                message: "Product Deleted Successfully.",
            });
        else
            return res.status(203).send({
                status: 203,
                message: "No Product found!!!",
            });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            status: 500,
            message: "Something went wrong !!!",
        });
    }
};

// update products

exports.updateProduct = async(req, res) => {
    //// console.log("Files >>>>> ",req.files);

    // check for product images
    // let image_urls = [];

    // if (req.files["product_image"] !== undefined) {
    //   req.files["product_image"].map((val) => {
    //     image_urls.push(`${process.env.Official}/${val.path}`);
    //   });
    // }

    // // check for previously saved image
    // let previousImages = JSON.parse(req.body.savedImages);

    // if (previousImages.length > 0) image_urls.push(...previousImages);

    // req.body.product_image = image_urls;

    // // check for Images
    // if (req.files["featured_image"] !== undefined)
    //   req.body.featured_image = `${process.env.Official}/${req.files["featured_image"][0].path}`;
    // if (req.files["specification_image"] !== undefined)
    //   req.body.specification_image = `${process.env.Official}/${req.files["specification_image"][0].path}`;
    // if (req.files["mannequin_image"] !== undefined)
    //   req.body.mannequin_image = `${process.env.Official}/${req.files["mannequin_image"][0].path}`;

    // // check for product ID
    // if (req.body._id === undefined)
    //   return res.status(204).send("Payload is absent.");

    // // selling points conversation in array
    // req.body.selling_points = JSON.parse(req.body.selling_points);

    //// console.log("Complete >>>> ",req.body);

    // return res.send('ALl OKay')
    // console.log(req.query);
    await product
        .findOneAndUpdate({ SKU: req.query.search }, { SKU: req.query.SKU })
        .then((data) => {
            ////// console.log(data)
            if (data)
                return res.status(200).send({
                    message: "Product is updated successfully.",
                    // image: image_urls,
                });
            else return res.status(203).send({ message: "No entries found" });
        })
        .catch((error) => {
            // console.log(error);
            return res.status(203).send("Something Went Wrong !!!");
        });
};

// update in bulk
exports.updateBulk = async(req, res) => {
    let arr = [];

    let skus = JSON.parse(req.body.SKUs);
    await skus.map((obj, index) => {
        arr.push({ SKU: obj.SKU });
    });

    await product
        .updateMany({ $or: arr }, req.body)
        .then((data) => {
            res.status(200).send({ message: "Product is updated successfully." });
        })
        .catch((error) => {
            ////// console.log(error)
            res.status(203).send("Something Went Wrong");
        });
};

// get present SKUs
exports.getPresentSKUs = async(req, res) => {
    try {
        // console.log(req.query);

        let response = await product.aggregate([
            { $match: { SKU: { $regex: req.query.search, $options: "i" } } },

            {
                $group: {
                    _id: "$_id",
                    SKU: { $first: "$SKU" },
                    product_title: { $first: "$product_title" },
                    category_name: { $first: "$category_name" },
                    featured_image: { $first: "$featured_image" },
                    length_main: { $first: "$length_main" },
                    breadth: { $first: "$breadth" },
                    height: { $first: "$height" },
                    selling_price: { $first: "$selling_price" },
                    discount_limit: { $first: "$discount_limit" },
                    assembly_part: { $first: "$assembly_part" },
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category_name",
                    foreignField: "category_name",
                    pipeline: [{
                        $group: {
                            _id: "$_id",
                            discount_limit: { $first: "$discount_limit" },
                        },
                    }, ],
                    as: "category",
                },
            },
            {
                $lookup: {
                    from: "stocks",
                    localField: "SKU",
                    foreignField: "product_id",
                    pipeline: [{
                        $group: {
                            _id: "$_id",
                            SKU: { $first: "$product_id" },
                            quantity: { $first: "$stock" },
                            warehouse: { $first: "$warehouse" },
                        },
                    }, ],
                    as: "inventory",
                },
            },
            { $limit: 5 },
        ]);

        // checking the available inventory for product listing
        // if(response.length > 0)
        // {

        //   let check = fine({$and : [{SKU : {$in : response.map(row=>row.SKU)}},{ quantity : {$gt : 0}}]})

        // }

        if (response) {
            // console.log(response);
            if (response !== null) {
                res.send(response);
            } else {
                res.status(203).send({ message: "Please Add Some Products First !!!" });
            }
        }
    } catch (error) {
        res.status(203).send({ message: "Some error occurred !!!" });
    }
};

// for product detail to show
exports.getProductDetails = async(req, res) => {
    // // console.log(req.query)
    if (req.query === {})
        return res.status(404).send({ message: "Please Provide the product id." });
    await product
        .findOne(req.query)
        .then((data) => {
            //   // console.log(data)
            return res.send(data);
        })
        .catch((err) => {
            return res.send({ message: "Something went wrang !!!" });
        });
};

// add variation

exports.variation = async(req, res) => {
    try {
        //   =============================== Set Up The New Variant
        let image_urls = [];

        if (req.files["product_image"] !== undefined) {
            req.files["product_image"].map((val) => {
                image_urls.push(`${process.env.Official}/${val.path}`);
            });
        }

        req.body.primary_material = req.body.primary_material.split(",");
        req.body.polish = req.body.polish.split(",");
        req.body.warehouse = req.body.warehouse.split(",");

        // check for previously saved image
        let previousImages = JSON.parse(req.body.savedImages);

        if (previousImages.length > 0) image_urls.push(...previousImages);

        req.body.product_image = image_urls;

        // check for Images
        if (req.files["featured_image"] !== undefined)
            req.body.featured_image = `${process.env.Official}/${req.files["featured_image"][0].path}`;
        if (req.files["specification_image"] !== undefined)
            req.body.specification_image = `${process.env.Official}/${req.files["specification_image"][0].path}`;
        if (req.files["mannequin_image"] !== undefined)
            req.body.mannequin_image = `${process.env.Official}/${req.files["mannequin_image"][0].path}`;

        // selling points conversation in array
        req.body.selling_points = JSON.parse(req.body.selling_points);

        // // console.log("New Variant >>> ",req.body);
        //   =============================== Set Up The New Variant end

        // this will save the variant to the respective parent product
        // let response = await product.findOne({SKU : req.body.parent_SKU},{variations : 1});
        // // console.log(response, req.body.SKU)
        // response.variations.push(req.body.SKU)

        // let variations = response.variations;
        // await product.updateOne({SKU : req.body.parent_SKU}, {variations})

        // Now save the new product in Product Collection
        let data = product(req.body);
        response = await data.save();

        if (response)
            return res.send({ message: "Variant Added Successfully", response });
    } catch (err) {
        // console.log(err);
        return res.status(500).send("Something Went Wrong !!!");
    }
};

// APIS for Hardware

exports.getHardwareDropdown = async(req, res) => {
    try {
        //  hinge knob door handle fitting polish handle_material fabric textile
        const data = {
            hinge: [],
            knob: [],
            door: [],
            handle: [],
            fitting: [],
            polish: [],
            fabric: [],
            wheel: [],
            ceramic_drawer: [],
            ceramic_tiles: [],
            dial: [],
            cane: [],
            hook: [],
        };

        let polishRes = await polish.find({}, { _id: 1, polish_name: 1 });

        if (polishRes) data.polish = polishRes;

        let response = await hardware.find({}, {
            _id: 1,
            SKU: 1,
            title: 1,
            sub_category_name: 1,
            status: 1,
        });

        if (response) {
            data.wheel = response.filter((row) => {
                return row.sub_category_name.toLowerCase() === "wheel";
            });
            data.ceramic_drawer = response.filter((row) => {
                return row.sub_category_name.toLowerCase() === "ceramic drawer";
            });
            data.ceramic_tiles = response.filter((row) => {
                return row.sub_category_name.toLowerCase() === "ceramic tiles";
            });
            data.cane = response.filter((row) => {
                return row.sub_category_name.toLowerCase() === "cane";
            });
            data.hook = response.filter((row) => {
                return row.sub_category_name.toLowerCase() === "hook";
            });
            data.hinge = response.filter((row) => {
                return row.sub_category_name.toLowerCase() === "hinge";
            });
            data.knob = response.filter((row) => {
                return row.sub_category_name.toLowerCase() === "knob";
            });
            data.door = response.filter((row) => {
                return row.sub_category_name.toLowerCase() === "door";
            });
            data.handle = response.filter((row) => {
                return row.sub_category_name.toLowerCase() === "handle";
            });
            data.fitting = response.filter((row) => {
                return row.sub_category_name.toLowerCase() === "fitting";
            });
            data.fabric = response.filter((row) => {
                return row.sub_category_name.toLowerCase() === "fabric";
            });
            data.textile = response.filter((row) => {
                return row.sub_category_name.toLowerCase() === "textile";
            });
            data.dial = response.filter((row) => {
                return row.sub_category_name.toLowerCase() === "dial";
            });
        }
        // console.log(data);
        return res.send({
            status: 200,
            message: "Hardware data fetched successfully.",
            data,
        });
    } catch (err) {
        return res.status(500).send({
            status: 200,
            message: "Something went wrong !!!",
            data: {},
        });
    }
};

// get ArticlesId

exports.getArticlesId = async(req, res) => {
    try {
        let { search, PID } = req.query;

        PID = await purchase_order.findOne({ $and: [{ PID }, { completed: false }] }, { product_articles: 1, hardware_articles: 1, _id: 0 });

        let P_SKU = await product.aggregate([
            { $match: { SKU: { $regex: search, $options: "i" } } },
            {
                $project: {
                    _id: 0,
                    SKU: 1,
                    product_title: 1,
                },
            },
            { $limit: 10 },
        ]);
        // console.log(P_SKU)

        if (PID && PID.product_articles.length > 0) {
            let product_SKUs = PID.product_articles.map((row) => Object.keys(row)[0]);
            P_SKU = P_SKU.filter((row) => product_SKUs.includes(row.SKU) && row);
        }

        let H_SKU = await hardware.aggregate([
            { $match: { SKU: { $regex: search, $options: "i" } } },

            { $project: { SKU: 1 } },
            { $limit: 10 },
        ]);

        if (PID && PID.hardware_articles.length > 0) {
            let hardware_SKUs = PID.hardware_articles.map(
                (row) => Object.keys(row)[0]
            );
            H_SKU = H_SKU.filter((row) => hardware_SKUs.includes(row.SKU));
        }
        // console.log(">>> P", P_SKU, ">>> H", H_SKU)
        return res.send({ P_SKU, H_SKU });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

// get ArticlesId

exports.addCatalog = async(req, res) => {
    try {
        let data = catalog(req.body);
        data = await data.save();
        if (data) {
            res.send({
                status: 200,
                message: "SKU added to catalog successfully.",
                data,
            });
        } else {
            res.status(203).send({
                status: 203,
                message: "Facing problem while saving the data",
                data: {},
            });
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

exports.listCatalog = async(req, res) => {
    try {
        let filter = {};
        let list = "";

        if (req.query.catalog_type !== "" && req.query.catalog_type) {
            filter = { catalog_type: req.query.catalog_type };
            list = await catalog.find(filter).limit(10);
        } else {
            list = await catalog.find(filter);
        }

        if (list) {
            res.send({
                status: 200,
                message: "Catalog list fetched successfully.",
                data: list,
            });
        } else {
            res.status(203).send({
                status: 203,
                message: "Error occurred in fetching the list.",
                data: [],
            });
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

exports.deleteCatalog = async(req, res) => {
    try {
        let deleteCat = await catalog.findOneAndDelete({ _id: req.query.id });

        if (deleteCat) {
            res.send({
                status: 200,
                message: "Catalog SKU delete successfully.",
            });
        } else {
            res.status(203).send({
                status: 203,
                message: "Error occurred in SKU delete.",
            });
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

exports.getLinkedProduct = async(req, res) => {
    try {
        let { ACIN } = req.query;

        if (!ACIN || ACIN === "")
            return res.status(203).send({ status: 203, message: "Please provide the ACIN to search.", data: [] });

        let data = await product.find({ ACIN }, { SKU: 1, product_title: 1 })

        return res.status(200).send({ status: 200, message: "Variants found successfully.", data });

    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: 500, message: 'Something went wrong.' });
    }
}

exports.unlinkFromVariations = async(req, res) => {
    try {
        let { products } = req.body;

        products = products.split(',');

        if (!products || products.length < 1)
            return res.status(203).send({
                status: 203,
                message: "Please provide the product Ids."
            })

        products = products.map(row => ({ _id: row, ACIN: uuid.v4() }))

        let updatePromise = products.map(async data => {
            const filter = { _id: data._id }; // Filter using the _id field
            const update = {
                $set: { ACIN: data.ACIN } // Update the ACIN value
            };

            const result = await product.updateOne(filter, update);
            return result;
        });

        const results = await Promise.all(updatePromise);

        results.forEach((result, index) => {
            if (result.matchedCount === 1) {
                console.log(`Document with _id ${products[index]._id} updated`);
            } else {
                console.log(`Document with _id ${dataToUpdate[index]._id} not found`);
            }
        });

        return res.status(200).send({
            status: 200,
            message: "Product unlinked Successfully."
        })

    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: 500, message: 'Something went wrong.' });
    }
}
exports.linkToVariations = async(req, res) => {
    try {
        let { products, ACIN } = req.body;

        console.log(req.body)
        products = products.split(',');

        if (!products || !ACIN)
            return res.status(203).send({
                status: 203,
                message: "Please provide the product Ids and ACIN to connect."
            })

        products = products.map(row => ({ SKU: row, ACIN }))

        let updatePromise = products.map(async data => {
            const filter = { SKU: data.SKU }; // Filter using the _id field
            const update = {
                $set: { ACIN: data.ACIN } // Update the ACIN value
            };

            const result = await product.updateOne(filter, update);
            return result;
        });

        const results = await Promise.all(updatePromise);

        results.forEach((result, index) => {
            if (result.matchedCount === 1) {
                console.log(`Document with _id ${products[index]._id} updated`);
            } else {
                console.log(`Document with _id ${dataToUpdate[index]._id} not found`);
            }
        });

        return res.status(200).send({
            status: 200,
            message: "Product linked successfully."
        })

    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: 500, message: 'Something went wrong.' });
    }
}