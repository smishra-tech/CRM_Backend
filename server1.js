// 1. Logic to start the express server
// 2. Make a connection to mongodb, and create a ADMIN user ar the server boot (If not already present)
// 3. I will have to connect to the route layer


const express = require("express");
const app = express();
require("dotenv").config();


const PORT = process.env.PORT || 7777
app.listen(PORT, () => {
    console.log(`Server started running on the port num : ${PORT}`);
})




