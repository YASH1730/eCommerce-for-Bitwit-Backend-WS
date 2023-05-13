const user = require('../../../database/models/user')


// exports.listUser = async (req,res)=>{
//     try {
//         const users = user.find({},{'name': 1, "email":1});
//         return res.send(users)
//     } catch (error) {
//         console.log(error)
//         return res.status(500).send("Something went wrong !!!")
//     }
// }