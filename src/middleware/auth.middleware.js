const userModel=require("../models/user.model");
const jwt=require("jsonwebtoken");
async function authMiddleware(req, res, next){
    const token=req.cookies.token|| req.header.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message:"Invalid token, seems to be logged out"
        })
    }

    try{
    const decoded=jwt.verify(token, process.env.jwt_secret_key);
    const user=await userModel.findById(decoded.userId).select("-password") ;
    if(!user) return res.status(401).json({message:"Invalid user"});
    req.user=user;
    return next();
    }
    catch(err){
        return res.status(401).json({message:"unauthorized access"})
    }


}

module.exports={
    authMiddleware
}