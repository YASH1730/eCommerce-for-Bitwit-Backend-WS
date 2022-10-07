require('dotenv').config();
const merge = require('../../database/models/mergeProduct')

// ================================================= Apis for merges ======================================================= 
//==============================================================================================================================

// Add merges 

exports.addMergeProduct = async (req, res) => {
    console.log(req.files);

    // //console.log(req.files['merge_image'])

    if (req.files['specification_image'] === undefined || req.files['featured_image'] === undefined || req.files['mannequin_image'] === undefined || req.files['product_image'] === undefined) return res.status(203).send({ message: 'Please Provide the required images !!!' })


    let image_urls = []

    if (req.files['product_image'] !== null) {
        req.files['product_image'].map((val) => {
            image_urls.push(`${process.env.Official}/${val.path}`)
        })
    }

    req.body.product_image = image_urls;

    req.body.featured_image = `${process.env.Official}/${req.files['featured_image'][0].path}`;

    req.body.specification_image = `${process.env.Official}/${req.files['specification_image'][0].path}`;

    req.body.mannequin_image = `${process.env.Official}/${req.files['mannequin_image'][0].path}`;

    console.log(req.body);

    const data = merge(req.body);

    await data.save()
        .then((response) => {
            console.log(response)
            res.send({ message: 'Merge added successfully !!!' ,response})
        })
        .catch((err) => {
            console.log(err)
            res.status(203).send({ message: 'Some error occurred !!!' })
        })
}


// Get merge List 

exports.getListMergeProduct = async (req, res) => {
    await merge.find()
        .then((response) => {
              console.log(response)
            res.send(response)
        })
        .catch((err) => {
            // //console.log(err)
            res.send("Not Done !!!")
        })
}


//   Get last merge

exports.getLastMergeProduct = async (req, res) => {

    await merge.find({}, {_id : 0,MS : 1 })
        .sort({ _id: -1 })
        .limit(1)
        .then((response) => {
            console.log(response)
            if (response !== null) {
                res.send(response);
            }
            else {
                res.status(203).send('MS-01001')
            }
        })
        .catch((err) => {
            //  //console.log(err)
            res.status(203).send({ message: 'Some error occurred !!!' })
        })

}

// delete merges 

exports.deleteMergeProduct = async (req, res) => {
// merge.collection.drop();
   
    merge.deleteOne({ _id: req.query.ID })
        .then((data) => {
            res.send({ message: "Merge Product deleted successfully !!!" })
        })
        .catch((err) => {
            res.send({ message: 'Some error occurred !!!' })

        })
}

// update merges 

exports.updateMergeProduct = async (req, res) => {
    //console.log(req.body);
    console.log(req.files);

    if (req.files['featured_image'] !== undefined)
        req.body.featured_image = `${process.env.Official}/${req.files['featured_image'][0].path}`;
    if (req.files['specification_image'] !== undefined)
        req.body.specification_image = `${process.env.Official}/${req.files['specification_image'][0].path}`;
    if (req.files['mannequin_image'] !== undefined)
        req.body.mannequin_image = `${process.env.Official}/${req.files['mannequin_image'][0].path}`;



    if (req.body._id === undefined) return res.status(204).send('Payload is absent.')

    await merge.findOneAndUpdate({ _id: req.body._id }, req.body)
        .then((data) => {
            if (data)
                return res.status(200).send({ message: 'Merge Product is updated successfully.' })
            else
                return res.status(203).send({ message: 'No entries found' })
        })
        .catch((error) => {
            //console.log(error)
            return res.status(203).send('Something Went Wrong')
        })
}

// update in bulk 
exports.updateBulk = async (req, res) => {

    let arr = [];

    let skus = JSON.parse(req.body.SKUs);
    await skus.map((obj, index) => {

        arr.push({ SKU: obj.SKU });
    })


    await merge.updateMany({ $or: arr }, req.body)
        .then((data) => {
            res.status(200).send({ message: 'Merge Product is updated successfully.' })
        })
        .catch((error) => {
            //console.log(error)
            res.status(203).send('Something Went Wrong')

        })

}


// ================================================= Apis for merges Ends =======================================================

