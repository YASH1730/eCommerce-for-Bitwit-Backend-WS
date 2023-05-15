const user = require('../../../database/models/user')
const customer = require('../../../database/models/customer')


exports.listCustomer = async (req,res)=>{
    try {
        let cusList = await customer.find({},{'username': 1, "email":1});
        if(cusList)
        {
            cusList = cusList.map(row=>({name : row.username,email : row.email}))
            return res.send(cusList)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong !!!")
    }
}
exports.listTeam = async (req,res)=>{
    try {
        let team = await user.find({},{'user_name': 1, "email":1});
        if(team)
        {
            team = team.map(row=>({name : row.user_name,email : row.email}))
            return res.send(team)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong !!!")
    }
}
exports.getCustomerByEmail = async (req,res)=>{
    try {

        let {email} = req.query
        
        let data = await customer.find({email});
        // console.log
        if(data)
        {
            return res.send({data})
        }
        return res.status(203).send({message : "no details found",data})
    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong !!!")
    }
}