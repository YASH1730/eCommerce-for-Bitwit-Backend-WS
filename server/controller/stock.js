// const stock = require("../../database/models/stock");
const inward = require("../../database/models/Inward");
const outward = require("../../database/models/outward");
const product = require("../../database/models/products");
const transfer = require("../../database/models/transfer");
const uuid = require('uuid')

// ============================ APIs for Stock ======================================

// exports.addStock = async(req,res)=>{

//     //console.log(req.body);

//     // this will check the row is exist or if yes then update it or insert it on not  
//     await stock.findOneAndUpdate({product_id : req.body.product_id, warehouse : req.body.warehouse  },req.body,{upsert : true})
//     .then((response)=>{
//         //console.log(response)
//       return  res.send({message : 'Stock Added !!!',response})
//     })
//     .catch((err)=>{
//         //console.log(err)
//        return res.status(404).send('Something Went Wrong !!!')
//     })

// }
// exports.updateStock = async(req,res)=>{

//     //console.log(req.body);

//     // this will check the row is exist or if yes then update it or insert it on not  
//     await stock.findOneAndUpdate({product_id : req.body.product_id, warehouse : req.body.warehouse  },req.body,{upsert : true})
//     .then((response)=>{
//         //console.log(response)
//       return  res.send({message : 'Stock Updated Successfully !!!'})
//     })
//     .catch((err)=>{
//         //console.log(err)
//        return res.status(404).send('Something Went Wrong !!!')
//     })

// }

// exports.listStock = async (req,res)=>{

//         await stock.find()
//         .then((response)=>{
//             res.send(response)
//         })
//         .catch((err)=>{
//             res.status(404).send({message : 'Something went wrong !!!'})
//         })

// }

// exports.deleteStock = async (req,res)=>{

//         await stock.deleteOne(req.query)
//         .then((response)=>{
//             //console.log(response)
//             if (response.deletedCount > 0)
//                 return res.send({message : 'Stock Deleted !!!'})
//             else 
//             return res.status(404).send({message : 'Something Went Wrong !!!'})

//         })
//         .catch((err)=>{
//             res.status(404).send({message : 'Something went wrong !!!'})
//         })

// }

// //  for product preview before adding

// exports.preview = async (req,res)=>{

//     product.findOne(req.query,{
//            _id : 0,
//             SKU : 1,
//             product_title : 1,
//             category_name : 1,
//             seo_title : 1,
//             featured_image : 1,
//             primary_material : 1,
//             length_main : 1,
//             breadth : 1,
//             height : 1,
//             MRP : 1,
//             selling_price : 1,
//             showroom_price : 1,
//             discount_limit : 1,
//             COD : 1,
//             returnable : 1,
//             show_on_mobile : 1,
//             range : 1,
//     })
//     .then((response)=>{
//         console.log(response)
//         if (response)
//         return res.send(response);

//         return res.send({message : 'No product found !!!'})
//     })
//     .catch((err)=>{
//         //console.log(err);
//         res.status(500).send('Something Went Wrong !!!')
//     })

// }

// ========================= Inward ===================

exports.addInward = async (req, res) => {
    try {
        req.body.inward_id = uuid.v4();
        req.body.order_no = uuid.v4();
        req.body.product_articles = req.body.product_articles.split(',')
        req.body.hardware_articles = req.body.hardware_articles.split(',')

        let data = inward(req.body)
        data = await data.save()
        console.log(data)

        if (data) return res.send({ message: 'Inward Entries added !!!', response: data });

    } catch (error) {
        console.log(error)
        return res.sendStatus(500).send({ message: 'Something went wrong !!!' })
    }

}

// ======================== Outward ==============

exports.addOutward = async (req, res) => {
    try {
        req.body.outward_id = uuid.v4();
        req.body.order_no = uuid.v4();
        req.body.product_articles = req.body.product_articles.split(',')
        req.body.hardware_articles = req.body.hardware_articles.split(',')

        console.log(req.body)

        let data = outward(req.body)
        data = await data.save()
        console.log(data)

        if (data) return res.send({ message: 'Outward Entries added !!!', response: data });

    } catch (error) {
        console.log(error)
        return res.sendStatus(500).send({ message: 'Something went wrong !!!' })
    }

}

// ========================= Transfer ============ 
exports.addTransfer = async (req, res) => {
    try {
        req.body.transfer_id = uuid.v4();
        req.body.order_no = uuid.v4();
        req.body.product_articles = req.body.product_articles.split(',')
        req.body.hardware_articles = req.body.hardware_articles.split(',')

        console.log(req.body)

        let data = transfer(req.body)
        data = await data.save()
        console.log(data)

        if (data) return res.send({ message: 'Transfer Entries added !!!', response: data });

    } catch (error) {
        console.log(error)
        return res.sendStatus(500).send({ message: 'Something went wrong !!!' })
    }

}


// list all entries
exports.listEntires = async (req, res) => {
    try {
        const params = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 50,
            type: req.query.type
        }

        let data = '';
        let total = '';
        switch (params.type) {
            case 'Inward':
                total = await inward.estimatedDocumentCount()
                data = await inward.find({}).skip(params.page > 0 ? (params.page - 1) * params.limit : 0).limit(params.limit)
                if (data) return res.send({ data, total });
                break;
            case 'Outward':
                total = await outward.estimatedDocumentCount()
                data = await outward.find({}).skip(params.page > 0 ? (params.page - 1) * params.limit : 0).limit(params.limit)
                if (data) return res.send({ data, total });
                break;
            case 'Transfer':
                total = await transfer.estimatedDocumentCount()
                data = await transfer.find({}).skip(params.page > 0 ? (params.page - 1) * params.limit : 0).limit(params.limit)
                if (data) return res.send({ data, total });
                break;
            default:
                return res.send({ data: [], total: 0 });
        }
    } catch (error) {
        console.log(error)
        return res.sendStatus(500).send({ message: 'Something went wrong !!!' })
    }

}

// total entires
exports.totalEntries = async (req, res) => {
    try {
        let data = {}
        data.inward = await inward.estimatedDocumentCount();
        data.outward = await outward.estimatedDocumentCount();
        data.transfer = await transfer.estimatedDocumentCount();
        return res.send(data);
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);

    }
}