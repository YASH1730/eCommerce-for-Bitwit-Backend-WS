// packages 
const bcrypt = require("bcrypt");
const JWT = require('jsonwebtoken');

// DB modules 
const userDB = require("../../database/models/user");

// ================================================= Apis for User ======================================================= 
//==============================================================================================================================



// for deafulting paging
exports.home = (req, res) => {
    res.send("This Apis is written for the WoodSala!!!");
};

exports.delete = async(req,res)=>{
    userDB.deleteOne({'_id':req.query._id})
    .then((data)=>{
        //console.log(data)
        res.send(data)
    })
}

// for registration API

exports.register = async(req, res) => {


    const data = userDB(req.body);

    data
        .save()
        .then((response) => {
            return res.status(200).send(req.body);
        })
        .catch((err) => {
            //console.log({ err });
            return res.status(203).send({ massage: "User Not Added !!!" });
        });
};

// for login Api

// function for generate JWT

function generateJWT(data) {
    // //console.log(process.env.JWT_Secrete)
    const token = JWT.sign(data,process.env.JWT_Secrete);
    return token;
}


exports.login = (req, res) => {

    //console.log(req.body)
    if (req.body.email === undefined || req.body.password === undefined) return res.status(203).send('Please provides the vaild data')

    userDB
        .findOne({ email: req.body.email })
        .then((data) => {
            //console.log(data)
            if (data != null) {
                bcrypt.compare(req.body.password, data.password, function(err, result) {
                    //console.log(req.body.role,data.role)

                    if (result === true) {
                        
                        if(req.body.role !== data.role)
                            return res.status(203).send({ message: "Incorrect Role !!!" })
                        
                        let token = generateJWT(req.body);
                        //console.log(data)
                        //console.log("User Found !!!", data);
                        return res.send({ message: "Log In Successfully !!!", token, name: data.user_Name, email: data.email, role : data.role })

                    } else
                        return res.status(203).send({ message: "User Not Found !!!" })
                });
            } else {
                return res.status(203).send({ message: "User Not Found !!!" })
            }
        })
        .catch((err) => {
            //console.log({ message: "User Not Found !!!", err });
            return res.status(203).send({ message: "User Not Found !!!", err })
        })

}

// ================================================= Apis for User Ends =======================================================