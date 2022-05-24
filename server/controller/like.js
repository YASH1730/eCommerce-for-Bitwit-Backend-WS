const likeDB = require('../../database/models/like')


// Api for posting likes         
exports.like = (req,res)=>{
    console.log(req.body)

    let data = {
        email : req.user.email,
        like : req.body.like
    }
  
    likeDB.updateOne({uuid : req.body.uuid },{$set :{likes : data}},{upsert : true}).then((res)=>{console.log(res)});

    res.send({message : 'all okay'})
    
} 

// Api for getting likes         
exports.getLike = async (req,res)=>{
    
    await likeDB.find({uuid : req.body.uuid})
    .then(
        (data)=>{
            let isLiked = false;
            data.map((obj)=>{
                if(obj.likes.email === req.user.email )
                isLiked = true;
            })
            return res.send({like : data.length,isLiked})
    })

    .catch((err)=>{console.log(err)});
    
} 
