function guest(req,res,next){
   if(!req.isAuthenticated()){
    return next()
   }
   else if(req.isAuthenticated()){
     
   return res.redirect("/login")
   }

}


module.exports=guest;