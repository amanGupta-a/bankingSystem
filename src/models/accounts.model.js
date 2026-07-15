const mongoose=require("mongoose");

const accountSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["ACTIVE", "FROZEN", "CLOSED"],
            message:"It can be only active/frozen/closed" ,
        },
        default:"ACTIVE"
    },
    currency:{
        type:String,
        required:true,
        default:"INR",
    }
}, {timestamps:true})

accountSchema.index({user:1, status:1});

module.exports=mongoose.model("account", accountSchema);