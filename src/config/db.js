const mongoose = require("mongoose");

function connectToDB(){
    mongoose.connect(process.env.mongodb_url).then(()=>{
        console.log("server is connected");
    })
    .catch(err=>{
        console.log("error while connecting to db");
        process.exit(1);
    })
}

module.exports=connectToDB;