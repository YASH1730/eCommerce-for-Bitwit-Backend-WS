const stock = require("../../database/models/stock");
const product = require("../../database/models/products");

// ============================ APIs for Stock ======================================

exports.addStock = async(req,res)=>{

    //console.log(req.body);

    // this will check the row is exist or if yes then update it or insert it on not  
    await stock.findOneAndUpdate({product_id : req.body.product_id, warehouse : req.body.warehouse  },req.body,{upsert : true})
    .then((response)=>{
        //console.log(response)
      return  res.send({message : 'Stock Added !!!',response})
    })
    .catch((err)=>{
        //console.log(err)
       return res.status(404).send('Something Went Wrong !!!')
    })

}
exports.updateStock = async(req,res)=>{

    //console.log(req.body);

    // this will check the row is exist or if yes then update it or insert it on not  
    await stock.findOneAndUpdate({product_id : req.body.product_id, warehouse : req.body.warehouse  },req.body,{upsert : true})
    .then((response)=>{
        //console.log(response)
      return  res.send({message : 'Stock Updated Successfully !!!'})
    })
    .catch((err)=>{
        //console.log(err)
       return res.status(404).send('Something Went Wrong !!!')
    })

}

exports.listStock = async (req,res)=>{

        await stock.find()
        .then((response)=>{
            res.send(response)
        })
        .catch((err)=>{
            res.status(404).send({message : 'Something went wrong !!!'})
        })
        
}

exports.deleteStock = async (req,res)=>{

        await stock.deleteOne(req.query)
        .then((response)=>{
            //console.log(response)
            if (response.deletedCount > 0)
                return res.send({message : 'Stock Deleted !!!'})
            else 
            return res.status(404).send({message : 'Something Went Wrong !!!'})

        })
        .catch((err)=>{
            res.status(404).send({message : 'Something went wrong !!!'})
        })
        
}

//  for product preview before adding

exports.preview = async (req,res)=>{

    product.findOne(req.query,{
           _id : 0,
            SKU : 1,
            product_title : 1,
            category_name : 1,
            seo_title : 1,
            featured_image : 1,
            primary_material : 1,
            length_main : 1,
            breadth : 1,
            height : 1,
            MRP : 1,
            selling_price : 1,
            showroom_price : 1,
            discount_limit : 1,
            COD : 1,
            returnable : 1,
            show_on_mobile : 1,
            range : 1,
    })
    .then((response)=>{
        console.log(response)
        if (response)
        return res.send(response);

        return res.send({message : 'No product found !!!'})
    })
    .catch((err)=>{
        //console.log(err);
        res.status(500).send('Something Went Wrong !!!')
    })

}