const mongoose=require("mongoose");

const ledgerSchema= new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        require:[true, "ledger must be associated with account"],
        index:true,
        immutable:true,
    },
    amount:{
        type:Number,
        require:[true, "amount is required to create an ledger entry"],
        immutable:true,
    },
    transactions:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:true,
        immutable:true,
        index:true,
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT", "DEBIT"],
            message:"transaction type is required to make a ledger"
        },
        required:[true, "important field"],
        immutable:true,
    }
})

function preventLedgerModification(){
    throw new Error("Ledger entries are immutable")
}

ledgerSchema.pre('findOneAndUpdate',preventLedgerModification);
ledgerSchema.pre('findOneAndReplace',preventLedgerModification);
ledgerSchema.pre('findOneAndDelete',preventLedgerModification);
ledgerSchema.pre('updateOne',preventLedgerModification);
ledgerSchema.pre('remove',preventLedgerModification);
ledgerSchema.pre('deleteOne',preventLedgerModification);
ledgerSchema.pre('deleteMany',preventLedgerModification);
ledgerSchema.pre('updateMany',preventLedgerModification);


module.exports=mongoose.model("ledger", ledgerSchema);