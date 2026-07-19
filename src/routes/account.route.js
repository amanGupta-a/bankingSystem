const express=require("express");
const authMiddleware=require("../middleware/auth.middleware")
const accountController=require("../controllers/account.controller")
const router=express.Router();

router.post("/newAccount", authMiddleware.authMiddleware, accountController.createAccountController)
router.get("/accountInfo", authMiddleware.authMiddleware,accountController.getUserAccounts )
router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController)
module.exports=router;