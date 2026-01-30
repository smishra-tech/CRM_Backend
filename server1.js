// 1. Logic to start the express server
// 2. Make a connection to mongodb, and create a ADMIN user ar the server boot (If not already present)
// 3. I will have to connect to the route layer


const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user.model");
const bcryptjs = require("bcryptjs");


const PORT = process.env.PORT || 7777
app.listen(PORT, () => {
    console.log(`Server started running on the port num : ${PORT}`);
})

// make a connection to the mongodb

mongoose.connect("mongodb://127.0.0.1:27017/CRM");
const db = mongoose.connection;

db.on("error", () => {
    console.log("Error while connecting to the mongoDB")
})
db.once("open", () => {
    console.log("Connected to mongoDb")
    init();
})

async function init() {
    const user = await User.findOne({userId : "ADMIN"})
    if(!user){
        const admin = await User.create({
            name: "Sunny",
            userId: "admin",
            email: "sunnymishra836935@gmail.com",
            userType: "ADMIN",
            password: bcryptjs.hashSync("Welcome1", 8)
        })
    }

}



