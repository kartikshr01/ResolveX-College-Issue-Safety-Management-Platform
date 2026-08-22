const express=require("express");
const cors=require("cors");
const cookieParsar=require("cookie-parser");
const app=express();
app.use(express.json());
app.get("/api/health",(req,res)=>{
    res.json({success:true,
            message:"ResolveX is Runnning",
    })
})
module.exports=app;