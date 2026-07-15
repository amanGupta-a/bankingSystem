const mongoose=require("mongoose");
const ledgerModel=require("../models/ledger.model")
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


accountSchema.methods.getBalance = async function () {
    const balanceData = await ledgerModel.aggregate([
        { $match: { account: this._id } },
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: [
                            { $eq: [ "$type", "DEBIT" ] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: [
                            { $eq: [ "$type", "CREDIT" ] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                balance: { $subtract: [ "$totalCredit", "$totalDebit" ] }
            }
        }
    ])

    if(balanceData.length==0){
        return 0;
    }
    else return balanceData[0].balance;
}


module.exports=mongoose.model("account", accountSchema);