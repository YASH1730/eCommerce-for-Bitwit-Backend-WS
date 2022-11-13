require('dotenv').config();
const product = require('../../database/models/products')
const hardware = require('../../database/models/hardware')
const draft = require('../../database/models/draft')

// ================================================= Apis for Products ======================================================= 
//==============================================================================================================================

// Add Products 

exports.addProduct = async (req, res) => {
    //console.log('files>>>',req.files);
    // //console.log(req.body);

    // ////console.log(req.files['product_image'])

    // if (req.files['specification_image'] === undefined || req.files['featured_image'] === undefined || req.files['mannequin_image'] === undefined || req.files['product_image'] === undefined) return res.status(203).send({ message: 'Please Provide the required images !!!' })


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

    req.body.selling_points = JSON.parse(req.body.selling_points)


    //console.log('Complete>>>',req.body);

    // return res.send('all okay')

    const data = product(req.body);

    await data.save()
        .then((response) => {
            ////console.log(response)
            res.send({ message: 'Product added successfully !!!',response })
        })
        .catch((err) => {
            console.log(err)
            res.status(203).send({ message: 'Some error occurred !!!' })

        })


}

// Get Product List 

exports.getListProduct = async (req, res) => {

    // await product.deleteOne({SKU : 'P-01057'})
    // product.collection.drop();
    await product.find()
        .then((response) => {
            //   //console.log(response)
            res.send(response)
        })
        .catch((err) => {
            ////console.log(err)
            res.send("Not Done !!!")
        })
}

//   Get last product

exports.getLastProduct = async (req, res) => {

    await product.find({},{_id:0,SKU : 1})
        .sort({ _id: -1 })
        .limit(1)
        .then((response) => {
            if (response !== null) {
                //  ////console.log(response);
                res.send(response);
            }
            else {
                res.status(203).send('WS-01001')
            }
        })
        .catch((err) => {
            //  ////console.log(err)
            res.status(203).send({ message: 'Some error occurred !!!' })
        })

}

// delete products 

exports.deleteProduct = async (req, res) => {
    product.deleteOne({ _id: req.query.ID })
        .then((data) => {
            res.send({ message: "Product deleted successfully !!!" })
        })
        .catch((err) => {
            res.send({ message: 'Some error occurred !!!' })

        })
}

// update products 

exports.updateProduct = async (req, res) => {
    //console.log("Files >>>>> ",req.files);    

    // check for product images 
    let image_urls = []

    if (req.files['product_image'] !== undefined) {
        req.files['product_image'].map((val) => {
            image_urls.push(`${process.env.Official}/${val.path}`)
        })
    }

    // check for previously saved image 
    let previousImages = JSON.parse(req.body.savedImages) 

    if(previousImages.length > 0) image_urls.push(...previousImages)

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

    //console.log("Complete >>>> ",req.body);
    
    // return res.send('ALl OKay')

    await product.findOneAndUpdate({ _id: req.body._id }, req.body)
        .then((data) => {
            ////console.log(data)
            if (data)
                return res.status(200).send({ message: 'Product is updated successfully.',image : image_urls })
            else
                return res.status(203).send({ message: 'No entries found' })
        })
        .catch((error) => {
            //console.log(error)
            return res.status(203).send('Something Went Wrong !!!')
        })
}

// update in bulk 
exports.updateBulk = async (req, res) => {

    let arr = [];

    let skus = JSON.parse(req.body.SKUs);
    await skus.map((obj, index) => {

        arr.push({ SKU: obj.SKU });
    })


    await product.updateMany({ $or: arr }, req.body)
        .then((data) => {
            res.status(200).send({ message: 'Product is updated successfully.' })
        })
        .catch((error) => {
            ////console.log(error)
            res.status(203).send('Something Went Wrong')

        })

}

// get present SKUs
exports.getPresentSKUs = async (req, res) => {

    await product.find({}, {
        _id: 0,
        SKU: 1,
        product_title: 1,
        featured_image: 1,
        length_main: 1,
        breadth: 1,
        height: 1,
        MRP: 1,
        selling_price: 1,
        discount_limit: 1,
        range: 1,
    })
        .then((response) => {
            if (response !== null) {
                res.send(response);
            }
            else {
                res.status(203).send({ message: 'Please Add Some Products First !!!' })
            }
        })
        .catch((err) => {
            //  ////console.log(err)
            res.status(203).send({ message: 'Some error occurred !!!' })
        })

}

// for product detail to show 
exports.getProductDetails = async (req,res)=>{
    
    if (req.query === {}) return res.status(404).send({message : 'Please Provide the product id.'})
    await product.findOne(req.query)
    .then((data)=>{
          
        return res.send(data)
    })
    .catch((err)=> {return res.send({message : 'Something went wrang !!!'})})

}

// add variation 

exports.variation = async (req, res) => {
    //console.log("Files >>>>> ",req.files);    
    //console.log("Complete >>>> ",req.body);

    // check for product images 
    let image_urls = []

    if (req.files['product_image'] !== undefined) {
        req.files['product_image'].map((val) => {
            image_urls.push(`${process.env.Official}/${val.path}`)
        })
    }

    // check for previously saved image 
    let previousImages = JSON.parse(req.body.savedImages) 

    if(previousImages.length > 0) image_urls.push(...previousImages)

    req.body.product_image = image_urls;

    // check for Images 
    if (req.files['featured_image'] !== undefined)
        req.body.featured_image = `${process.env.Official}/${req.files['featured_image'][0].path}`;
    if (req.files['specification_image'] !== undefined)
        req.body.specification_image = `${process.env.Official}/${req.files['specification_image'][0].path}`;
    if (req.files['mannequin_image'] !== undefined)
        req.body.mannequin_image = `${process.env.Official}/${req.files['mannequin_image'][0].path}`;


    // selling points conversation in array
    req.body.selling_points = JSON.parse(req.body.selling_points);

    //console.log("Complete >>>> ",req.body);

    // return res.send('all okay')

    const data = product(req.body);

    await data.save()
        .then((response) => {
            product.findOneAndUpdate({SKU : req.body.parentProduct}, {variation_array : req.body.parentArray})
            .then((result)=>{
                //console.log(result);
                res.send({ message: 'Variation added successfully !!!',response })
            })
            .catch((err)=>{
                //console.log(err)
                res.status(203).send({ message: 'Some error occurred !!!' })
            })
        })
        .catch((err) => {
            //console.log(err)
            res.status(203).send({ message: 'Some error occurred !!!' })
        })


}

// APIS for Hardware 

exports.getHardwareDropdown = async (req,res)=>{
    hardware.find({},{
        _id : 0,
        SKU: 1,
        title: 1,
        sub_category_name: 1,
        status : 1
    })
    .then((response)=>{

        //  hinge knob door handle fitting polish handle_material fabric textile
        const data = {
            hinge : [],
            knob : [],
            door : [],
            fitting : [],
            polish : [],
            handle : [],
            fabric : [],
            textile : []
        }
        // console.log(response)
        data.hinge = response.filter((row)=>{return row.sub_category_name.toLowerCase() === 'hinge'}); 
        data.knob = response.filter((row)=>{return row.sub_category_name.toLowerCase() === 'knob'}); 
        data.door = response.filter((row)=>{return row.sub_category_name.toLowerCase() === 'door'}); 
        data.handle = response.filter((row)=>{return row.sub_category_name.toLowerCase() === 'handle'}); 
        data.fitting = response.filter((row)=>{return row.sub_category_name.toLowerCase() === 'fitting'}); 
        data.polish = response.filter((row)=>{return row.sub_category_name.toLowerCase() === 'polish'}); 
        data.fabric = response.filter((row)=>{return row.sub_category_name.toLowerCase() === 'fabric'}); 
        data.textile = response.filter((row)=>{return row.sub_category_name.toLowerCase() === 'textile'});
        
        // //console.log(data);
        return res.send(data)
    })
    .catch((err)=>{
        //console.log(err);
        return res.sendStatus(500).send('Something went wrong !!!')
    })
}


  // ================================================= Apis for Products Ends =======================================================



//   exports.updateProducts = async (req, res) => {
//     product.find({},{SKU : 1, 
//         featured_image : 1,
//         mannequin_image : 1,
//         specification_image : 1, _id : 0})
//     .then(async (response)=>{
//         // return res.send('okay')
//         let newResponse = response.map((row)=>{
//             row.featured_image = row.featured_image.replace('admin.admin.woodshala.in','admin.woodshala.in')
//             row.mannequin_image = row.mannequin_image.replace('admin.admin.woodshala.in','admin.woodshala.in')
//             row.specification_image = row.specification_image.replace('admin.admin.woodshala.in','admin.woodshala.in')
//             return row
//         })

        
//         // console.log(response)
        
//     //   return   res.send(newResponse)
//         Promise.all(newResponse.map(async(row)=>{
//             console.log(row)
//            return  await product.findOneAndUpdate({SKU : row.SKU},{
//             featured_image : row.featured_image,
//             mannequin_image : row.mannequin_image,
//             specification_image : row.specification_image
//            })
//         }))
//         .then((res1)=>{
//             return res.send(res1)
//         })
//         .catch((err)=>{
//             console.log(err)
//             return res.sendStatus(500).send('Something Wrong')
//         })


//     })
//     .catch((err)=>{
//         console.log(err)
//         return res.send(err)
//     })
// }
