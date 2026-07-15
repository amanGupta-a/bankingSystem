const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model")
const accountModel = require("../models/accounts.model")
const emailService = require("../services/email.service")


async function createTransaction(req, res) {

    //validating user
    const { fromAccount, toAccount, amount, status, type, idempotencyKey } = req.body;
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "all fields are required"
        })
    }
    const sender = await accountModel.findOne({ _id: fromAccount });
    const receiver = await accountModel.findOne({ _id: toAccount });
    if (!sender || !receiver) {
        return res.status(401).json({
            message: "Invalid request"
        })
    }

    //idempotencyKey validation
    const isTransactionsExists = await transactionModel.findOne({ idempotencyKey: idempotencyKey });
    if (isTransactionsExists) {
        if (isTransactionsExists.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction Completed, success"
            })
        }
        if (isTransactionsExists.status === "PENDING") {
            return res.status(200).json({
                message: "Your transaction is still under process"
            })
        }
        if (isTransactionsExists.status === "FAILED") {
            return res.status(500).json({
                message: "Your transaction is Failed"
            })
        }
        if (isTransactionsExists.status === "REVERSED") {
            return res.status(501).json({
                message: "Your Transaction is Reversed"
            })
        }
    }
    //checking accounts status
    if (!sender.status === "ACTIVE" || !receiver.status === "ACTIVE") {
        return res.status(500).json({
            message: "For making a transaction both account should be ACTIVE"
        })
    }
    //checking balance
    const balance = await sender.getBalance();
    if (balance < amount) {
        return res.status(500).json({
            message: `Invalid request your current account balance is ${balance} , but requested for debit of ${amount}`
        })
    }
    //creating a trnxn
    const session = await mongoose.createSession();
    session.startTransaction();
    const transaction = await transactionModel.create({
        fromAccount,
        toAccount,
        status: "PENDING",
        amount,
        idempotencyKey
    }, { session });

    const debitLedgerEntry = await ledgerModel.create({
        account: sender,
        amount,
        transactions: transaction._id,
        type: "DEBIT"
    }, { session });

    const creditLedgerEntry = await ledgerModel.create({
        account: receiver,
        amount,
        transactions: transaction._id,
        type: "CREDIT"
    }, { session });

    transaction.status = "COMPLETED",
        await transaction.save({ session });
    await session.commitTransaction();
    session.endSession();
    await emailService.sendTransactionSuccessMail(req.user.email, req.user.name, amount, sender._id);
    return res.status(201).json({
        message: "Transaction completed Successfully",
        transaction: transaction,
    })
}
module.exports = { createTransaction };