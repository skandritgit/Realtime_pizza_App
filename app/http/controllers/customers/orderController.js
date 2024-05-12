const Order=require("../../../models/order")
const moment=require("moment");

function orderController(){
    return{
        async status(req,res){

            const {phone,address}=req.body;
             if(!phone || !address){
                req.flash('error',"All fields are required")
                return res.redirect('/cart');
             }

             const order=await Order.create({
                customerId:req.user._id,
                items:req.session.cart.items,
                phone,
                address,
             })

             order.save().then((result)=>{
             
               delete req.session.cart
                req.flash('success','order placed successfully')
                return res.redirect('/customer/orders');

             }).catch(err=>{
                req.flash('error',"Something went wrong");
                return res.redirect("/cart");
             })

        },
        async index(req,res){
         const order= await Order.find({customerId:req.user._id},
            null,
            {sort:{'createdAt':-1}}
         )
     
         
        return res.render('customers/orders' ,{order,moment})
         
        }
    }
}


module.exports=orderController;