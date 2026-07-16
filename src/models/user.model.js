const mongoose=require("mongoose");
const bcrypt=require("bcrypt")
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true, "Email is require to create a user"],
        lowercase:true,
        trim:true,
        match:[/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, "Invalid Email"],
        unique:[true, "Email already exits"]
    },
    name:{
        type:String,
        required:[true, "Name is required"],
    },
    password:{
        type:String,
        required:[true, "necessary"],
        minLength:[6, "atleast 6 char should be there"]
    },
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false,
    }
}, {timestamps:true})
userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return;
    }
    const pass= await bcrypt.hash(this.password, 10);
    this.password=pass;
})

userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare( password, this.password);
}

const user=mongoose.model("user",userSchema);
module.exports=user;