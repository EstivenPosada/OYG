const mongoose  = require("mongoose");

const {MONGODB_URI} = require("./config");

mongoose 
    .connect(MONGODB_URI)
    .then((db) => console.log("connected"))
    .catch((err) => console.log(err));
    
