const mongoose=require("mongoose");

const tokenBlackListSchema=new mongoose.Schema({
    token:{
        type:String,
        required:[true,"Token is necessary"],
        unique:[true, "it needs to be unique" ]
    }
}, {timestamps:true});
tokenBlackListSchema.index({createdAt:1},{
    expireAfterSeconds:24*60*60*3
})

module.exports=mongoose.model("tokenBlackList",tokenBlackListSchema);