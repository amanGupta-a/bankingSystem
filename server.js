require("dotenv").config();
const app=require("./src/app");
const connectedToDB=require("./src/config/db")
connectedToDB();
app.get("/", (req, res)=>{
    res.send("working , champion")
})

app.listen(3000, ()=>{
    console.log("app is running");
})