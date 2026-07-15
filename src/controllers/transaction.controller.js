const transactionModel=require("../models/transaction.model");
const ledgerModel=require("../models/ledger.model")
const accountModel=require("../models/accounts.model")
const emailService=require("../services/email.service")


async function createTransaction(req, res){
    const {fromAccount,toAccount, amount, status, type,idempotencyKey}=req.body;
    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"all fields are required"
        })
    }
    const sender=await accountModel.findOne({_id:fromAccount}),
    const receiver=await accountModel.findOne({_id:toAccount}),
    if(!sender || !receiver){
        return res.status(401).json({
            message:"Invalid request"
        })
    }

    //idempotencyKey validation

    const isTransactionsExits=await transactionModel.findOne({idempotencyKey:idempotencyKey});

    if(isTransactionsExits){
        if(isTransactionsExits.status==="COMPLETED"){
            return res.status(200).json({
                message:"Transaction Completed, success"
            })
        }
        if(isTransactionsExits.status==="PENDING"){
            return res.status(200).json({
                message:"Your transaction is still under process"
            })
        }
        if(isTransactionsExits.status==="FAILED"){
            return res.status(500).json({
                message:"Your transaction is Failed"
            })
        }
        if(isTransactionsExits.status==="REVERSED"){
            return res.status(501).json({
                message:"Your Transaction is Reversed"
            })
        }
        //checking accounts status
        if(!sender.status==="ACTIVE" || !receiver.status==="ACTIVE"){
            return res.status(500).json({
                message:"For making a transaction both account should be ACTIVE"
            })
        }
        
    }
}