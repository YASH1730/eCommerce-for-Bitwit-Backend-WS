const reviewDB = require('../../database/models/review')

// Api for posting comment         
exports.comment = (req,res)=>{
        
    req.body.email = req.user.email;
    //console.log(req.body)
  
    reviewDB.findOneAndUpdate({uuid : req.body.uuid},{ $push: {review : req.body } }, {upsert: true}).then((res)=>{//console.log(res)});

    res.send({message : 'all okay'})
    
    
} 
