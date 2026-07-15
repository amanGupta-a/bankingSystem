const accountModel=require("../models/accounts.model")

async function createAccountController(req, res){
    const user=req.user;
    const newAccount=await accountModel.create({
        user:user
    })
    return res.status(200). json({
        newAccount
    })
}

module.exports={
    createAccountController
}