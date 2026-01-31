const mongoose = require("mongoose");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const constants = require("../utils/constants");
const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config")


// Logic to the Signup ---.> Customer(A) | Engineer(P) | Admin(P)

exports.signUp = async (req, res) => {

    let userStatus = req.body.userStatus;

    if(!req.body.userType || req.body.userType == "CUSTOMER"){
        userStatus = "CONFIRMED";
    }else {
        userStatus = "PENDING";
    }


    const userObj = {
        name: req.body.name,
        userId: req.body.userId,
        password: bcrypt.hashSync(req.body.password, 8),
        email: req.body.email,
        userType: req.body.userType,
        userStatus: userStatus,
    }

    try {
        const userCreated = await User.create(userObj);

        const postRes = {
            name: userCreated.name,
            userId: userCreated.userId,
            email: userCreated.email,
            userType: userCreated.userType,
            userStatus: userCreated.userStatus,
            createdAt: userCreated.createdAt,
            updatedAt: userCreated.updatedAt
        }
        res.status(201).send(postRes);
        
    } catch (err) {
        console.log("Error while creating user", err)
        res.status(500).send({
            message : "Some internal error while creating the user"
        })
    }
}

exports.signIn = async(req, res) => {


    try {
        const user = awaitUser.findOne({userId : req.body.userId})
        if (user == null) {
            res.status(503).send({
                message : `User Id  passed : ${req.body.userId} not correct`
            })
        }

        if(user.userStatus != constants.userStatus.approved){
            res.status(400).send({
                message : `Can't allow the login as the user status is not approved : Current status : ${user.userStatus}`
            })
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
        if(!passwordIsValid){
            return res.status(401).send({
                accessToken : null,
                message : "Invalid Password"
            })
        }

        const token = jwt.sign({id : user.userId}, config.secret, {
            expiresIn : 120
        })

        return res.status(200).send({
            name: user.name,
            userId: user.userId,
            email: user.email,
            userStatus: user.userStatus,
            accessToken : token
        })



    } catch (error) {
        console.log("Error while signing in to the system", error)
        res.status(500).send({
            message : "Error while logining to the system"
        })
    }


}