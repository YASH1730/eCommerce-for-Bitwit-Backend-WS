const customer = require("../../database/models/customer");
const { v4: uuidv4 } = require('uuid');
const Crypt = require('cryptr');
const crypt = new Crypt('asdf465f4s2d1f65e4s32d1f6534361e65##$#$#$#23$#5er135##4dfd434<>?<?');
// const decryptedString = crypt.decrypt(encryptedString);

// ================================================= Apis for banner ======================================================= 
//==============================================================================================================================

const localURL = "http://localhost:8000";
const official = "https://woodshala.in";


// place an customer 

exports.addCustomer = async(req,res) => {   
    req.body.CID = `CID-${uuidv4()}`

    //console.log(req.files)

  if (req.files['profile_image'] !== undefined) 
  req.body.profile_image = `${official}/${req.files['profile_image'][0].path}` 
 

    req.body.password = crypt.encrypt(req.body.password);

    //console.log(req.body);
    // mongodb+srv://woodsala:woodsala2022@woodsala.unthc.mongodb.net/woodSala?retryWrites=true&w=majority
    const data = customer(req.body);
    await data.save(req.body)
    .then((response)=>{
       return res.status(200).send({message : 'Customer added successfully !!!',response});
    })
    .catch((err)=>{
      //console.log(err)
       return res.status(400).send({message : 'Duplicate entries are not allowed !!!'})
    })
}

// list customer

exports.listCustomer = async(req,res) => {

    await customer.find({$sort: { register_time : -1 }})
    .then((response)=>{
      // //console.log(response)
       return res.status(200).send(response);
    })
    .catch((err)=>{
       return res.status(203).send({message : 'No entries !!!'})
    })
}

// get delete customer

exports.deleteCustomer = async(req,res) => {   
    //console.log(req.query)
    await customer.deleteOne(req.query)
    .then((response)=>{
       return res.status(200).send(response);
    })
    .catch((err)=>{
      return res.status(203).send({message : 'Customer has been deleted !!!'})
    })
}

// get specific customer

exports.searchCustomer = async(req,res) => {   
    
    await customer.find(req.query)
    .then((response)=>{
       return res.status(200).send(response);
    })
    .catch((err)=>{
       return res.status(500).send(err);
    })
}


// for Changing the Status of the Customer

exports.changeCustomerStatus = async(req,res) =>{
  //  //console.log(req.body)
   await customer.findByIdAndUpdate({_id : req.body._id},{status : req.body.status})
   .then((data)=>{
       //console.log(data)
       res.send('all okay')
   })
 
   .catch((err)=>{
       //console.log(err)
       res.status(203).send('Something went wrong !!!')
   })
 }


// edit categories ======================


exports.updateCustomer = async (req, res) => {

   //console.log(req.body);
   //console.log(req.files['profile_image'])
 
   if (req.files['profile_image'] !== undefined) 
       req.body.profile_image = `${official}/${req.files['profile_image'][0].path}` 
 
 
   await customer.findOneAndUpdate({ CID: req.body.CID }, req.body)
       .then((data) => {
         if (data)
           return res.status(200).send({ message: 'Customer is updated successfully.' })
         else
           return res.status(203).send({ message: 'No entries found' })
       })
       .catch((error) => {
         //console.log(error)
         return res.status(203).send({message : 'Something went wrong !!!'})
       })
 
 }
 