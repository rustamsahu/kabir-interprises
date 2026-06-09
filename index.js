require("dotenv").config();
const dbURI=process.env.MONGO_URI;
const port=process.env.port;
const express=require("express");
const path=require("path");
const app=express();
const mongoose=require("mongoose");
mongoose.connect(dbURI).then(()=>{
    console.log("connected to online db")
});
const schema=new mongoose.Schema({
       productName:{type:String,required:true},
       price:{type:Number},
       quantity:{type:Number},
       pic:{type:String},
});
const pro=mongoose.model("pro",schema);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views");
app.use(express.urlencoded({extended:false}));
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"));
});
app.get("/index.html",async(req,res)=>{
    
    res.sendFile(path.join(__dirname,"index.html"));
});
app.get("/pro.ejs",async(req,res)=>{
    const allPro=await pro.find();
    res.render("pro",{allPro});
});
app.get("/bill.ejs",async(req,res)=>{
    res.render("bill");
});
app.get("/newPro.ejs",async(req,res)=>{
    res.render("newPro");
});
app.post("/submit",async(req,res)=>{
    const aim=await pro.findOne({productName:req.body.productName});
    let name=req.body.productName;
    if(!req.body.productName)
        res.json("Fill the product Name");
    else
    {
        if(!aim)
        { await pro.create({
          productName:req.body.productName,
          price:req.body.price,
          quantity:req.body.quantity,
          pic:req.body.pic,
         });
         res.redirect("/pro.ejs");
        }
        else
        {
            if(req.body.price)
            aim.price=req.body.price;
            if(req.body.quantity)
            aim.quantity=req.body.quantity;
            aim.save();
            res.redirect("/pro.ejs");
        }
    }
});
app.post("/submit1",async(req,res)=>{
      let mob=req.body.mob;
      let x=req.body["productName[]"];
      let y=req.body["quantity[]"];
      if(typeof x=="string")
      {
        x=[x];
        y=[y];
      }
      console.log(mob,req.body,x,y);
      for(let i of x)
      { let aim=await pro.findOneAndUpdate({productName:i},{$inc:{quantity:-Number(y[x.indexOf(i)])}});
      }
      res.redirect(`http://wa.me/91${mob}`);
    // res.json("aaaaaaa");
});
app.listen(port,()=>{console.log("Add New Product");
});
