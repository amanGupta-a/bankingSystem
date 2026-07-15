const express=require("express");
const authMiddleware=require("../middleware/auth.middleware")
const transactionRoutes=express.Router();

transactionRoutes.post("/")

module.exports=transactionRoutes;