const userModel=require("../models/user.model");
const jwt=require("jsonwebtoken");
const emailService=require("../services/email.service")
const userRegisterController=async(req, res)=>{
    const {email, name, password}=req.body;
    const isExists=await userModel.findOne({
        email:email
    })
    if(isExists){
        return res.status(422).json({
            message:"user with this email already exists",
            status:"failed"
        })
    }
    const user=await userModel.create({
        email, name, password
    })
    const token=await jwt.sign({userId:user._id},process.env.jwt_secret_key, {expiresIn:"3d"});
    res.cookie("token", token, {
        httpOnly:true,
        maxAge:3*24*60*60*1000,
    });
    try {
        await emailService.sendRegistrationEmail(user.email, user.name)
    } catch (error) {
        console.error("Registration email failed:", error)
    }

    return res.status(201).json({
        user:{
            userId:user._id,
            name:user.name,
            email:user.email,
        }
    })
}

const userLoginController=async(req, res)=>{
    const {email, password}=req.body;
    const user=await userModel.findOne({email});
    if(!user)return res.status(401).json({
        message:"something went wrong, email is not registered",
        status:"failed"
    })
    const isValid=await user.comparePassword(password);
    if(!isValid)
    return res.status(401).json({
        message:"something went wrong, incorrect password",
        status:"failed"
    })
    
    const token=await jwt.sign({userId:user._id},process.env.jwt_secret_key, {expiresIn:"3d"});
    res.cookie("token", token,{
        httpOnly:true,
        maxAge:3*24*60*60*1000,
    });
    res.status(201).json({
        user:{
            userId:user._id,
            name:user.name,
            email:user.email,
        }
    })
}
module.exports={
    userRegisterController,
    userLoginController,
}
