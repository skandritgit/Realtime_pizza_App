const express=require("express");
const port=3000 || process.env.PORT
const ejs=require("ejs");
const path =require("path");
const expresslayouts=require("express-ejs-layouts");


const app=express();
app.use(expresslayouts);
app.set('view engine', "ejs");
app.set('views',path.join(__dirname,"/resources/views"));





app.use(express.static('public'));

app.get("/login",(req,res)=>{
    res.render("auth/login")
})
app.get("/register",(req,res)=>{
    res.render("auth/register")
})

app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/cart",(req,res)=>{
    res.render("customers/cart");
})



app.listen(port,()=>{
    console.log(`Server is connected at ${port}`);
})