const express= require('express');
const app=express();
const authRoute=require("./routes/auth.route");
const accountRoute=require("./routes/account.route")
const transactionRoute=require("./routes/transaction.route")
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/auth", authRoute);
app.use("/api/accounts", accountRoute)
app.use("/api/transactions",transactionRoute)
app.get("/", (req, res)=>{
    res.send("Ledger service is running up")
})
module.exports =app;
