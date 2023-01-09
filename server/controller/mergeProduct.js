require('dotenv').config();
const merge = require('../../database/models/mergeProduct')

// ================================================= Apis for merges ======================================================= 
//==============================================================================================================================

// Add merges 

exports.addMergeProduct = async (req, res) => {
    console.log(req.files);



    let image_urls = []

    if (req.files['product_image'] !== undefined) {
        req.files['product_image'].map((val) => {
            image_urls.push(`${process.env.Official}/${val.path}`)
        })
    }

    req.body.product_image = image_urls;

    req.body.featured_image = req.files['featured_image'] ? `${process.env.Official}/${req.files['featured_image'][0].path}` : '';

    req.body.specification_image = req.files['specification_image'] ? `${process.env.Official}/${req.files['specification_image'][0].path}` : '';

    req.body.mannequin_image = req.files['mannequin_image'] ? `${process.env.Official}/${req.files['mannequin_image'][0].path}` : '';


    req.body.warehouse = req.body.warehouse.split(',');
    req.body.product_articles = JSON.parse(req.body.product_articles)
    req.body.selling_points = JSON.parse(req.body.selling_points)

    console.log(req.body);

    // return res.send('all okay')

    const data = merge(req.body);

    await data.save()
        .then((response) => {
            res.send({ message: 'Merge added successfully !!!', response })
        })
        .catch((err) => {
            console.log(err)
            res.status(203).send({ message: 'Some error occurred !!!' })
        })
}

// update merges 

exports.updateMergeProduct = async (req, res) => {
    console.log(req.files);

    let image_urls = []

    if (req.files['product_image'] !== undefined) {
        req.files['product_image'].map((val) => {
            image_urls.push(`${process.env.Official}/${val.path}`)
        })
    }


    req.body.warehouse = req.body.warehouse.split(',');
    req.body.product_articles = JSON.parse(req.body.product_articles)

    // check for previously saved image 
    let previousImages = JSON.parse(req.body.savedImages)

    if (previousImages.length > 0) image_urls.push(...previousImages)

    req.body.product_image = image_urls;

    // check for Images 
    if (req.files['featured_image'] !== undefined)
        req.body.featured_image = `${process.env.Official}/${req.files['featured_image'][0].path}`;
    if (req.files['specification_image'] !== undefined)
        req.body.specification_image = `${process.env.Official}/${req.files['specification_image'][0].path}`;
    if (req.files['mannequin_image'] !== undefined)
        req.body.mannequin_image = `${process.env.Official}/${req.files['mannequin_image'][0].path}`;

    // check for product ID 
    if (req.body._id === undefined) return res.status(204).send('Payload is absent.')

    // selling points conversation in array
    req.body.selling_points = JSON.parse(req.body.selling_points);


    console.log(req.body);

    // ============================
    if (req.body._id === undefined) return res.status(204).send('Payload is absent.')

    // return res.send('All Okay')

    await merge.findOneAndUpdate({ _id: req.body._id }, req.body)
        .then((data) => {
            if (data)
                return res.status(200).send({ message: 'Merge Product is updated successfully.', updates: req.body })
            else
                return res.status(203).send({ message: 'No entries found' })
        })
        .catch((error) => {
            //console.log(error)
            return res.status(203).send('Something Went Wrong')
        })
}

// Get merge List 

exports.getListMergeProduct = async (req, res) => {
    try {
        //  console.log(req.query)
        const params = JSON.parse(req.query.filter)
        let total = await merge.estimatedDocumentCount();

        // filter Section Starts

        let query = {}
        let filterArray = [];


        if (params.title !== '')
            filterArray.push({ 'product_title': { '$regex': params.title, '$options': 'i' } })

        if (params.SKU)
            filterArray.push({ 'SKU': params.SKU })

        if (params.category)
            filterArray.push({ 'category_name': { '$regex': params.category, '$options': 'i' } })

        if (params.subCategory)
            filterArray.push({ 'sub_category_name': { '$regex': params.subCategory, '$options': 'i' } })


        // for checking the filter is free or not 
        if (filterArray.length > 0) {
            query = { '$and': filterArray };

            // this is for search document count 
            let count = await merge.aggregate([
                { '$match': query },
                { '$count': 'Count' }
            ])
            total = count.length > 0 ? count[0].Count : 0;
        }

        // filter ends 

        // final operation center

        const response = await merge.aggregate([
            { '$match': query },
            { '$skip': params.page > 0 ? (params.page - 1) * params.limit : 0 },
            { '$limit': params.limit }
        ])

        return res.send({ data: response, total: total })
            , { allowDiskUse: true };
    } catch (err) {
        console.log("Error>>>", err);
        return res.status(500).send('Something Went Wrong !!!');
    }
}


//   Get last merge

exports.getLastMergeProduct = async (req, res) => {
    try {
        const response = await merge.find({}, { _id: 0, M: 1 })
            .sort({ _id: -1 })
            .limit(1)
        if (response !== null) res.send(response);
        else res.status(200).send('M-01001');
    } catch (err) {
        console.log(err)
        res.status(203).send({ message: 'Some error occurred !!!' })
    }
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

