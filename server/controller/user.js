// packages 
const bcrypt = require("bcrypt");
const JWT = require('jsonwebtoken');

// DB modules 
const userDB = require("../../database/models/user");
const logging = require("../../database/models/logging");

// ================================================= Apis for User ======================================================= 
//==============================================================================================================================



// for defaulting paging
exports.home = (req, res) => {
    res.send("This Apis is written for the WoodSala!!!");
};

exports.delete = async (req, res) => {
    userDB.deleteOne({ '_id': req.query._id })
        .then((data) => {
            //console.log(data)
            res.send(data)
        })
}

// for registration API

exports.register = async (req, res) => {


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
    const token = JWT.sign(data, process.env.JWT_Secrete, { expiresIn: '3h' });
    return token;
}


exports.login = async (req, res) => {

    // console.log(req.body)

    if (req.body.email === undefined || req.body.password === undefined) return res.status(203).send('Please provides the valid data')

    try {
        let data = await userDB.findOne({ email: req.body.email })

        if (data != null) {
            bcrypt.compare(req.body.password, data.password, function (err, result) {
                // if password is correct
                if (result === true) {
                    // check role here for corresponding Credentials 
                    if (req.body.role !== data.role)
                        return res.status(203).send({ message: "Incorrect Role !!!" })

                    // generating a new access token
                    let token = generateJWT(req.body);
                    return res.send({ message: "Log In Successfully !!!", token, name: data.user_Name, email: data.email, role: data.role, expireIn: new Date().getTime() + 7200000 })

                } else
                    return res.status(203).send({ message: "User Not Found !!!" })
            });
        } else {
            return res.status(203).send({ message: "User Not Found !!!" })
        }

    }
    catch (err) {
        console.log('Error >> ', err);
        res.status(500).send('Something went wrong !!!');
    }


}

exports.refreshToken = async (req, res) => {

    // console.log(req.body)

    if (req.body.email === undefined || req.body.password === undefined || req.body.token === undefined) return res.status(203).send({ message: 'Some data is missing !!!' })

    try {
        let data = await userDB.findOne({ email: req.body.email })

        if (data != null) {
            bcrypt.compare(req.body.password, data.password, function (err, result) {
                // if password is correct
                if (result === true) {
                    // check role here for corresponding Credentials 
                    if (req.body.role !== data.role)
                        return res.status(203).send({ message: "Incorrect Role !!!" })

                    // generating a new access token
                    let token = generateJWT(req.body);
                    return res.status(200).send({ message: "Token refreshed successfully !!!", token, name: data.user_Name, email: data.email, role: data.role })

                } else
                    return res.status(203).send({ message: "User Not Found !!!" })
            });
        } else {
            return res.status(203).send({ message: "User Not Found !!!" })
        }

    }
    catch (err) {
        console.log('Error >> ', err);
        res.status(500).send('Something went wrong !!!');
    }

}

// list logs 
exports.listLogs = async (req, res) => {
    try {
        // logging.collection.drop()
        let response = await logging.find();
        // console.log(response)
        return res.send(response)

    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}

// ================================================= Apis for User Ends =======================================================