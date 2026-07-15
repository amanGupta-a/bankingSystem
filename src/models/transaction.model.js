const mongoose =require("mongoose")
const transactionSchema=new mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true, "From Account is required"],
        index:true,
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true, "To account is required"],
        index:true,
    },
    status:{
        type:String,
        enum:{
            values:["PENDING", "FAILED", "REVERSED", "COMPLETED"],
            message:"Only this are valid options"
        },
        default:"PENDING",
    },
    amount:{
        type:Number,
        required:[true,"amount is required to initiated a trxn"],
        min:[0, "Trnxn amount cannot be negative"]
    },
    idempotencyKey:{
        type:String,
        required:[true, "very necessary for transactions"],
        unique:true,
        index:true,
    }
}, {timestamps:true});



module.exports=mongoose.model("transaction", transactionSchema);