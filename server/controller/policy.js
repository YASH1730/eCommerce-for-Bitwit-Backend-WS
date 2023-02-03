const pincode = require('../../database/models/pincode');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');


exports.uploadPincodeCSV = async (req, res) => {

    try {

        if (req.files['COD_File'] === undefined) return res.status(400).send({ message: 'Please select or formate the file in correct manner.' })

        let data = [];

        await fs.createReadStream(path.resolve(__dirname, '../../upload', req.files['COD_File'][0].path.split('/')[1]))
            .pipe(csv.parse({ headers: true }))
            .on('data', row => { data.push(row) })
            .on('error', err => {
                console.log(err => console.log(err))
                return res.status(202).send({ message: "File doesn't formatted in right scheme !!!" })
            })
            .on('end', async rowCount => {

                // promise to save data
                let response = await Promise.all(data.map(row => {
                    let formateData = {
                        pincode: row.pincode || row.Pincode || row.pin_code || 0,
                        city: row.city || row.City || row.District || row.district || 'Blank',
                        state: row.state || row.StateName || row.State || row.state_name || 'Blank',
                        delivery_status: true,
                    }
                    return pincode.findOneAndUpdate({ pincode: formateData.pincode }, formateData, { upsert: true });
                }))
                // promise ends
                if (response)
                    return res.send({ message: 'CSV File Uploaded Successfully !!!' })
            });

    } catch (err) {
        console.log('Error >> ', err);
        res.status(500).send({ message: 'Something went wrong !!!' })
    }
}


exports.listPinCode = async (req, res) => {
    try {

        // product.collection.drop()
        console.log(req.query)

        const params = JSON.parse(req.query.filter)
        let total = await pincode.estimatedDocumentCount();


        let query = {}
        let filterArray = [];


        if (params.pincode !== '')
            filterArray.push({ 'pincode': parseInt(params.pincode) })

        // for checking the filter is free or not 
        if (filterArray.length > 0) {
            query = { '$and': filterArray };

            // this is for search document count 
            let count = await pincode.aggregate([
                { '$match': query },
                { '$count': 'Count' }
            ])
            total = count.length > 0 ? count[0].Count : 0;
        }

        // final operation center

        const response = await pincode.aggregate([
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


exports.statusDelivery = async (req, res) => {

    try{
    console.log(req.body)
    let response = await pincode.findByIdAndUpdate({ _id: req.body._id }, { delivery_status: req.body.delivery_status })

    if (response)
     res.send({message : 'Delivery Status Updated !!!'})

    }
    catch(err){
        console.log('>>Error>>',err)
        res.status(500).send({message : 'Something went wrong !!!'})
    }
  }

  // delete category

exports.deleteCategory = async (req, res) => {
    try{
        // console.log(req.query)
        let data = await pincode.deleteOne({ _id: req.query.ID })
        if(data)
         return res.send({ massage: 'Pincode deleted !!!' })  
    }catch(err){
        console.log(err)
        res.status(500).send({message : 'Something went wrong !!!'})
    }
  }
  