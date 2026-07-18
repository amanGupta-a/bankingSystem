const userModel=require("../models/user.model");
const jwt=require("jsonwebtoken");
const tokenBlackListModel = require("../models/tokenBlackList.model");
async function authMiddleware(req, res, next){
    const token=req.cookies.token|| req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message:"Invalid token, seems to be logged out"
        })
    }

    const isBlackListed=await tokenBlackListModel.findOne({token:token});
    if(isBlackListed){
        return res.status(400).json({
            message:"unauthorized access, this token is already blacklisted"
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

async function authSystemUserMiddleware(req, res, next){
    const token=req.cookies.token || req.headers.authorization.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message:"Invalid token, unauthorized access"
        })
    }

    const isBlackListed=await tokenBlackListModel.findOne({token:token});
    if(isBlackListed){
        return res.status(400).json({
            message:"unauthorized access, this token is already blacklisted"
        })
    }
    
    try{
        const decoded=jwt.verify(token, process.env.jwt_secret_key);
        const user=await userModel.findOne({_id:decoded.userId}).select("+systemUser -password")
        if(!user) return res.status(401).json({message:"Invalid user"});
        if(!user.systemUser){
            return res.status(403).json({
                message:"forbidden access"
            })
        }
        req.user=user;
        return next();
    }
    catch(err){
        return res.status(401).json({message:"unauthorized access"})
    }
}
module.exports={
    authMiddleware,
    authSystemUserMiddleware,
}