const homeController=require('../app/http/controllers/homecontroller');
const authController=require('../app/http/controllers/authController');
const cartController=require('../app/http/controllers/customers/cartController');
const orderController=require('../app/http/controllers/customers/orderController');
const AdminorderController=require('../app/http/controllers/admin/orderController');
const guest=require("../app/http/middleware/guest");
const auth=require("../app/http/middleware/auth")
const admin=require("../app/http/middleware/admin");

function initRoute(app){
    app.get("/",homeController().index);
    app.get("/login",guest,authController().login);
    app.post("/login",authController().postlogin);
    app.get("/register",guest,authController().register);
    app.post("/register",authController().postRegister);
    app.post("/logout",authController().logout);

    
    app.get("/cart",cartController().cart);
    app.post("/update-cart",cartController().update)
    

    //Customer Route
    app.post("/order",auth, orderController().status);
    app.get("/customer/orders",auth, orderController().index);


    //Admin

   app.get("/admin/orders",admin,AdminorderController().index);


}

module.exports=initRoute;