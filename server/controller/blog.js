
const blogDB = require('../../database/models/blog')

const uuid = require('uuid')


// Api for card creation 

exports.createBlog = (req,res)=>{
    // console.log(req.user)
    req.body.uuid = uuid.v4();
    req.body.author = req.user.email;
    console.log(req.body)

    let SaveToDb = new blogDB(req.body);

      // saving data to db
      SaveToDb
      .save()
      .then((data)=>{console.log("Blog Added Successfully !!!"); return res.send({massage : "Blog Added Successfully !!!"})})
      .catch((err)=>{console.log({massage : "Blog Not Added !!!",err}); return res.status(203).send({massage : "Blog Not Added !!!"})})

} 

// Api for card extraction for dashboard
 
exports.getBlogOfUser = (req,res)=>{

      // get data from db
      blogDB
      .find({author : req.user.email})
      .then((data)=>{
          console.log("Data fetched",data);
        if(data != null)
        return res.send(data)
        else 
        return res.send({message : 'No post yet'})
    })
          
      .catch((err)=>{console.log({massage : "No Data !!!",err}); return res.status(203).send({massage : "No data !!!"})})

} 


// Api for card extraction for Home

exports.getBlogHome = (req,res)=>{
    
    // get data from db
    blogDB
    .find()
    .then((data)=>{
        console.log("Data fetched",data);
        if(data != null)
        return res.send(data)
        else 
        return res.send({message : 'No post yet'})
    })
          
      .catch((err)=>{console.log({massage : "No Data !!!",err}); return res.status(203).send({massage : "No data !!!"})})

} 
