const express=require("express");
const port=3000 || process.env.PORT
const ejs=require("ejs");
const path =require("path");
const expresslayouts=require("express-ejs-layouts");


const app=express();

app.get("/",(req,res)=>{
    res.render("home");
})

app.set('view engine', "ejs");
app.set('views',path.join(__dirname,"/resources/views"));





app.use(expresslayouts);
app.listen(port,()=>{
    console.log(`Server is connected at ${port}`);
})