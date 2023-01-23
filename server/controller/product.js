require('dotenv').config();
const product = require('../../database/models/products')
const hardware = require('../../database/models/hardware');
const polish = require('../../database/models/polish');
const { match } = require('assert');

// ================================================= Apis for Products ======================================================= 
//==============================================================================================================================


// Add Products this function is not is use 

exports.addProduct = async (req, res) => {
    //console.log('files>>>',req.files);
    // //console.log(req.body);

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
    try {

    // product.collection.drop()
    //  console.log(req.query)
    const params = JSON.parse(req.query.filter)
    let total = await product.estimatedDocumentCount();
   
    // filter Section Starts

    let query = {}
    let filterArray = [];
    

    if(params.title !== '')
    filterArray.push({ 'product_title': { '$regex': params.title, '$options': 'i' } })
    
    if(params.SKU)
    filterArray.push({ 'SKU':  params.SKU })
    
    if(params.category)
    filterArray.push({ 'category_name': { '$regex': params.category, '$options': 'i' } })
    
    if(params.subCategory)
    filterArray.push({ 'sub_category_name': { '$regex': params.subCategory, '$options': 'i' } })
    

    // for checking the filter is free or not 
    if(filterArray.length > 0)
    {
        query = {'$and': filterArray};

        // this is for search document count 
        let count = await product.aggregate([
            {'$match' : query},
            {'$count' : 'Count'}
        ])
        total = count.length > 0 ? count[0].Count : 0;
    }

    // filter ends 

    // final operation center

    const response = await product.aggregate([
        {'$match' : query},
        {'$skip' : params.page > 0 ? (params.page - 1) * params.limit : 0},
        {'$limit' : params.limit}
    ])

    return res.send({data : response, total : total})
  
    ,{ allowDiskUse : true };
    } catch (err) {
        console.log("Error>>>",err);
        return res.status(500).send('Something Went Wrong !!!');
    }
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
                res.status(203).send('P-01001')
            }
        })
        .catch((err) => {
            //  ////console.log(err)
            res.status(203).send({ message: 'Some error occurred !!!' })
        })

}

// delete products 

exports.deleteProduct = async (req, res) => {
    product.deleteOne({ SKU: req.query.ID })
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

    console.log(req.query)


    product.aggregate(
        [
        {'$match' : {'SKU' : {'$regex' : req.query.search, '$options' : 'i' }}}, 

        {'$group' : {'_id' : '$_id',
                     'SKU': {'$first' : '$SKU'},
                     'product_title': {'$first' : '$product_title'},
                     'featured_image': {'$first' : '$featured_image'},
                     'length_main': {'$first' : '$length_main'},
                     'breadth': {'$first' : '$breadth'},
                     'height': {'$first' : '$height'},
                     'MRP': {'$first' : '$MRP'},
                     'selling_price': {'$first' : '$selling_price'},
                     'discount_limit': {'$first' : '$discount_limit'},
                     'range': {'$first' : '$range'},
        }}, 
        {'$limit' : 10}]
        ).then((response) => {
            console.log(response)
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
    
    // console.log(req.query)
    if (req.query === {}) return res.status(404).send({message : 'Please Provide the product id.'})
    await product.findOne(req.query)
    .then((data)=>{
        //   console.log(data)
        return res.send(data)
    })
    .catch((err)=> {return res.send({message : 'Something went wrang !!!'})})

}

// add variation 

exports.variation = async (req, res) => {
    
    try{

//   =============================== Set Up The New Variant
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


    // selling points conversation in array
    req.body.selling_points = JSON.parse(req.body.selling_points);

    // console.log("New Variant >>> ",req.body);
//   =============================== Set Up The New Variant end

// this will save the variant to the respective parent product
    // let response = await product.findOne({SKU : req.body.parent_SKU},{variations : 1});
    // console.log(response, req.body.SKU)
    // response.variations.push(req.body.SKU)

    // let variations = response.variations; 
    // await product.updateOne({SKU : req.body.parent_SKU}, {variations})

    // Now save the new product in Product Collection
    let data = product(req.body);
    response = await data.save()

    if(response) return res.send({message : 'Variant Added Successfully', response});

}
catch(err){
    console.log(err)
    return res.status(500).send('Something Went Wrong !!!')
}

}

// APIS for Hardware 

exports.getHardwareDropdown = async (req,res)=>{

    try {

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

        let polishRes = await polish.find({},{_id : 1,polish_name : 1})

        if (polishRes) data.polish = polishRes

        let response = await hardware.find({},{
            _id : 0,
            SKU: 1,
            title: 1,
            sub_category_name: 1,
            status : 1
        })
        
        if(response){
            // console.log(response)
            data.hinge = response.filter((row)=>{return row.sub_category_name.toLowerCase() === 'hinge'}); 
            data.knob = response.filter((row)=>{return row.sub_category_name.toLowerCase() === 'knob'}); 
            data.door = response.filter((row)=>{return row.sub_category_name.toLowerCase() === 'door'}); 
            data.handle = response.filter((row)=>{return row.sub_category_name.toLowerCase() === 'handle'}); 
            data.fitting = response.filter((row)=>{return row.sub_category_name.toLowerCase() === 'fitting'}); 
            data.fabric = response.filter((row)=>{return row.sub_category_name.toLowerCase() === 'fabric'}); 
            data.textile = response.filter((row)=>{return row.sub_category_name.toLowerCase() === 'textile'});
            
        }
        console.log(data)
        return res.send(data)
    }
    catch(err){
        console.log(err);
        return res.sendStatus(500).send('Something went wrong !!!')
    }
}

// get ArticlesId

exports.getArticlesId = async (req,res)=>{
    try {
        // const H_SKU = await hardware.find({},{_id : 0,SKU : 1})
        const P_SKU = await  product.aggregate(
            [
            {'$match' : {'SKU' : {'$regex' : req.query.search, '$options' : 'i' }}}, 

            {'$group' : {'_id' : '$_id',
                         'SKU': {'$first' : '$SKU'},
            }}, 
            {'$limit' : 10}]
            )
        const H_SKU = await  hardware.aggregate(
            [
            {'$match' : {'SKU' : {'$regex' : req.query.search, '$options' : 'i' }}}, 

            {'$group' : {'_id' : '$_id',
                         'SKU': {'$first' : '$SKU'},
            }}, 
            {'$limit' : 10}]
            )
        // console.log(P_SKU)
    
            res.send({P_SKU,H_SKU })
        } catch (error) {
            console.log(error)
            res.sendStatus(500)
    }
   
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
