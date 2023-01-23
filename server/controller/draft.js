require('dotenv').config();
const draft = require('../../database/models/draft')
const product = require('../../database/models/products');
const { v4: uuid } = require('uuid');

// Schema({
//     DID : {type: String, unique : true},
//     AID : {type : String},
//     type : {type : String},
//     payload : {type : String}
//  },{timestamps: {
//      createdAt: 'created_at', 
//      updatedAt: 'updated_at' 
//    }})

// ================================================= Apis for Draft Products ======================================================= 
//==============================================================================================================================

// Add Draft 

exports.addDraft = async (req, res) => {

    let data = {
        DID: req.body.DID,
        AID: req.body.AID,
        type: req.body.type,
        operation: req.body.operation,
    }
    // console.log(req.files);
    console.log(req.body);

    switch (req.body.operation) {
        case 'insertProduct':

            let Product_image_urls = []

            if (req.files['product_image'] !== undefined) {
                req.files['product_image'].map((val) => {
                    Product_image_urls.push(`${process.env.Official}/${val.path}`)
                })
            }

            req.body.primary_material = req.body.primary_material.split(',');
            req.body.polish = req.body.polish.split(',');
            req.body.warehouse = req.body.warehouse.split(',');

            req.body.product_image = Product_image_urls;

            req.body.featured_image = req.files['featured_image'] ? `${process.env.Official}/${req.files['featured_image'][0].path}` : '';

            req.body.specification_image = req.files['specification_image'] ? `${process.env.Official}/${req.files['specification_image'][0].path}` : '';

            req.body.mannequin_image = req.files['mannequin_image'] ? `${process.env.Official}/${req.files['mannequin_image'][0].path}` : '';

            req.body.selling_points = JSON.parse(req.body.selling_points);

            // ACIN number for variations 
            req.body.ACIN = uuid();

            data.message = "Alert : New Product adding request.";

            data.payload = req.body;

            break;
        case 'updateProduct':
            let image_urls = []

            if (req.files['product_image'] !== undefined) {
                req.files['product_image'].map((val) => {
                    image_urls.push(`${process.env.Official}/${val.path}`)
                })
            }

            req.body.primary_material = req.body.primary_material.split(',');
            req.body.polish = req.body.polish.split(',');
            req.body.warehouse = req.body.warehouse.split(',');

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

            data.message = `Alert : Product ${req.body.SKU} updating request.`;

            data.payload = req.body;
            break;
        default:
            return res.sendStatus('406').send('Type not found.');
    }
    console.log(data.payload);


    console.log('+++++++end ');

    // return res.status(300).send('All okay')


    const insert = draft(data);

    await insert.save()
        .then((response) => {
            res.send({ message: 'Draft Added !!!' })
        })
        .catch((err) => {
            console.log(err)
            res.status(203).send({ message: 'Some error occurred !!!' })

        })
}

// Apis for Drop the Data into related table
exports.dropDraft = async (req, res) => {
    // console.log(req.files);
    console.log(req.body);
    // console.log(JSON.parse(req.body));

    // return res.send('All okay ')
    switch (req.body.operation) {
        case 'insertProduct':
            let data = product(req.body)
            data.save()
                .then(() => {
                    console.log(req.body.operation)
                    draft.updateOne({ DID: req.body.DID }, { draftStatus: req.body.draftStatus, AID: req.body.AID })
                        .then(() => { return res.send({ message: 'Draft Resolved !!!' }) })
                        .catch((err) => { console.log(err); return res.status(500).send({ message: 'Some Error Occurred !!!' }) })
                })
                .catch((err) => { console.log(err); return res.status(500).send({ message: 'Some Error Occurred !!!' }) })
            break;
        case 'updateProduct':
            product.findOneAndUpdate({ SKU: req.body.AID }, req.body)
                .then(() => {
                    console.log(req.body.operation)
                    draft.updateOne({ DID: req.body.DID }, { draftStatus: req.body.draftStatus })
                        .then(() => { return res.send({ message: 'Draft Resolved !!!' }) })
                        .catch((err) => { console.log(err); return res.status(500).send({ message: 'Some Error Occurred !!!' }) })
                })
                .catch((err) => { console.log(err); return res.status(500).send({ message: 'Some Error Occurred !!!' }) })
            break;
        default:
            return res.sendStatus('406').send('Type not found.');
    }

}

// Get Draft Id

exports.getDraftID = async (req, res) => {


    await draft.find({}, { _id: 0, DID: 1 })
        .sort({ _id: -1 })
        .limit(1)
        .then((response) => {
            if (response !== null) {
                res.send(response);
            }
            else {
                res.status(203).send('D-01001')
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(203).send({ message: 'Some error occurred !!!' })
        })

}

// draft getting
exports.getDraft = async (req, res) => {


    // draft.collection.drop();
    draft.find()
        .then((response) => {
            // console.log(response)
            return res.send(response)
        })
        .catch((err) => {
            console.log(err)
            return res.sendStatus(500).send('Something Went Wrong !!!')
        })
}

// delete products 

exports.deleteDraft = async (req, res) => {
    draft.deleteOne({ _id: req.query.ID })
        .then((data) => {
            res.send({ message: "Product deleted successfully !!!" })
        })
        .catch((err) => {
            res.send({ message: 'Some error occurred !!!' })

        })
}

// Analytics
exports.getMetaDraft = async (req, res) => {
    const data = {
        total: 0,
        pending: 0,
        resolved: 0,
    }
    try {
        const response = await draft.find({}, { _id: 1, draftStatus: 1 })
        // console.log(typeof(response))
        if (response) {

            response.map(row => {
                switch (row.draftStatus) {
                    case 'Approved':
                        data.resolved += 1
                        break;
                    case 'Pending':
                        data.pending += 1
                        break;
                    default:
                        break;
                }
            })

            data.total = response.length;
        }


        return res.send(data)
    } catch (error) {
        console.log(error)
        res.sendStatus('500').send({ message: 'Something Went Wrong !!!' })
    }


}

  // ================================================= Apis for Products Ends =======================================================
