const accountModel=require("../models/accounts.model")

async function createAccountController(req, res){
    const user=req.user;
    const newAccount=await accountModel.create({
        user:user._id
    })
    return res.status(200). json({
        newAccount
    })
}

async function getUserAccounts(req, res){
    const accounts=await accountModel.find({user:req.user._id});
    return res.status(200).json({accounts});
}

async function getAccountBalanceController(req, res) {
    const { accountId } = req.params;
    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })
    if (!account) {
        return res.status(404).json({
            message: "Account not found or invalid access"
        })
    }

    const balance = await account.getBalance();
    console.log(balance);
    res.status(200).json({
        accountId: account._id,
        balance: balance
    })
}

module.exports={
    createAccountController,
    getUserAccounts,
    getAccountBalanceController,
}