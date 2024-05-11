const homeController=require('../app/http/controllers/homecontroller');
const authController=require('../app/http/controllers/authController');
const cartController=require('../app/http/controllers/cartController');
const guest=require("../app/http/middleware/guest");

function initRoute(app){
    app.get("/",homeController().index);
    app.get("/login",guest,authController().login);
    app.post("/login",authController().postlogin);
    app.get("/register",guest,authController().register);
    app.post("/register",authController().postRegister);
    app.post("/logout",authController().logout);

    
    app.get("/cart",cartController().cart);
    app.post("/update-cart",cartController().update)

}

module.exports=initRoute;