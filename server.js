require("dotenv").config()
const express=require("express");
const port=3000 || process.env.PORT
const ejs=require("ejs");
const path =require("path");
const expresslayouts=require("express-ejs-layouts");
const session=require("express-session");
const mongoose=require("mongoose");
const flash=require("express-flash");
// const { collection } = require("./app/models/menu");
const MongoDbStore=require("connect-mongo")(session);
const passport=require("passport");
const app=express();

const connection=mongoose.connection;
mongoose.connect("mongodb://127.0.0.1:27017/Pizza",{

}).then(()=>{
    console.log("connection is successfull...");
}).catch((error)=>{
    console.log("NOT connecting .....")
})


//session store
let mongoStore = new  MongoDbStore({
    mongooseConnection:connection,
    collections:'sessions'
})



app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    store:mongoStore,
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24} //24 hours

}))
//passport config
const passportinit=require("./app/config/passport");
passportinit(passport);
app.use(passport.initialize())
app.use(passport.session())


app.use(flash());


//global middleware
app.use((req,res,next)=>{
    res.locals.session=req.session;
    res.locals.user=req.user;
    next();
})



app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(expresslayouts);
app.set('view engine', "ejs");
app.set('views',path.join(__dirname,"/resources/views"));
app.use(express.static('public'));


require("./routes/web")(app);

app.listen(port,()=>{
    console.log(`Server is connected at ${port}`);
})