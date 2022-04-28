
const banner = require("../../database/models/banner");

const localBaseUrl = 'http://localhost:8000'



// ================================================= Apis for banner ======================================================= 
//==============================================================================================================================

exports.addBanner = async(req,res) => {
console.log(req.file)


if(req.file !== undefined)
    req.body.banner_URL = `${localBaseUrl}/${req.file.path}`;
else 
    return res.status(203);

const data = banner(req.body)

await data.save()
.then((data)=>{
    // console.log(data)
    return res.send('Banner Added Successfully !!!')
})
.catch((err)=>{
    return res.send('Something went worng')
})

}


// list all the banners

exports.listBanner = async(req,res)=>{

    await banner.find()
    .then((data)=>{
        // console.log(data)
        if (data !== null)
            return res.send(data)
        else
            return res.send('Please Add some banner')
    })
    .catch((err)=>{
        console.log(err)
        return res.send("Somthing went worng !!!")
    })


}

// for Changing the Status of the banner

exports.changeStatus = async(req,res) =>{
    console.log(req.body)
    await banner.findByIdAndUpdate({_id : req.body._id},{banner_Status : req.body.banner_Status})
    .then((data)=>{
        console.log(data)
        res.send('all okay')
    })
    .catch((err)=>{
        console.log(err)
        res.send('Somthing went worang !!!')
    })
}

// ================================================= Apis for banner ends ======================================================= 
//==============================================================================================================================
