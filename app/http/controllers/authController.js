const { request } = require("express");
const User = require("../../models/user");
const bcrypt=require("bcrypt");
const passport=require("passport");
const _getredirect=(req)=>{
    return req.user.role=='admin'? '/admin/orders': '/customer/orders'
}


function authController() {
    return {
        login(req, res) {

            res.render("auth/login")
        },
        postlogin(req,res,next){
            passport.authenticate('local',(err,user,info)=>{
                if(err){
                    req.flash('error',info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error',info.message)
                    return res.redirect('/login');
                }
                req.logIn(user,(err)=>{
                  if(err){
                    req.flash('error',info.message)
                    return next(err)
                  }

                  return res.redirect('/')
                })
            })(req,res,next)

        },
        register(req, res) {
            res.render("auth/register")
        },
        async postRegister(req, res) {
            let { name, email, password,role } = req.body;

            if (!name || !email || !password) {
             req.flash('error', 'All filed are required')
            req.flash('name', name);
            req.flash('email', email);
            return res.redirect('/register');
           
        }


          const existuser=await  User.exists({email:email});
                if(existuser){
                req.flash('error', 'Email already taken')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')

                }
            
            //create a user 

            const hashedpassword=await bcrypt.hash(password,10);
            const user =await User.create({
                name,
                email,
                role,
                password:hashedpassword,
            })
            await user.save().then((user)=>{

                return res.redirect("/login")

             }).catch((error)=>{
                req.flash('error', 'Something Went Wrong')
                req.flash('name', name);
                req.flash('email', email);
                return res.redirect("/register");
                

             })

        },
        logout(req, res){
            req.logout(function(err) {
                if (err) { return next(err); }
                return res.redirect("/login");
            });
        }
    }
    
}

module.exports = authController;